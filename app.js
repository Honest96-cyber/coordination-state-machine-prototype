const apiBase = '/tasks';

const tasksContainer = document.getElementById('tasks-container');
const createTaskForm = document.getElementById('create-task-form');
const refreshBtn = document.getElementById('refresh-btn');

async function fetchTasks() {
  const response = await fetch(apiBase);
  if (!response.ok) {
    throw new Error('Failed to fetch tasks');
  }
  return response.json();
}

async function postAction(url, body) {
  const response = await fetch(url, {
    method: 'POST',
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = data.message || 'Request failed';
    throw new Error(Array.isArray(message) ? message.join(', ') : message);
  }

  return data;
}

function formatDate(value) {
  if (!value) return '—';
  return new Date(value).toLocaleString();
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function getActionButtons(task) {
  const buttons = [];

  if (task.status === 'OPEN') {
    buttons.push(
      `<button data-action="start" data-id="${task.id}">Start</button>`
    );
  }

  if (task.status === 'IN_PROGRESS') {
    buttons.push(
      `<button data-action="complete" data-id="${task.id}">Mark Complete</button>`
    );
  }

  if (task.status === 'COMPLETED_PENDING_PAYOUT') {
    buttons.push(
      `<button data-action="add-payment-link" data-id="${task.id}">Add Payment Link</button>`
    );
    buttons.push(
      `<button data-action="hold" data-id="${task.id}">Put On Hold</button>`
    );
  }

  if (task.status === 'PAYOUT_SENT') {
    buttons.push(
      `<button data-action="confirm-payment" data-id="${task.id}">Confirm Payment</button>`
    );
    buttons.push(
      `<button data-action="hold" data-id="${task.id}">Put On Hold</button>`
    );
  }

  if (task.status === 'ON_HOLD') {
    buttons.push(
      `<button data-action="release" data-id="${task.id}">Release Hold</button>`
    );
  }

  return buttons.join('');
}

function renderTasks(tasks) {
  if (!tasks.length) {
    tasksContainer.innerHTML = `<p class="empty-state">No tasks yet.</p>`;
    return;
  }

  tasksContainer.innerHTML = tasks
    .map((task) => {
      const paymentLinkHtml = task.paymentLink
        ? `<div class="payment-link"><strong>Payment Link:</strong> <a href="${escapeHtml(
            task.paymentLink
          )}" target="_blank" rel="noreferrer">${escapeHtml(
            task.paymentLink
          )}</a></div>`
        : '';

      return `
        <div class="task-card">
          <div class="task-top">
            <div>
              <div class="task-title">${escapeHtml(task.title)}</div>
              <div class="task-meta">${escapeHtml(task.description)}</div>
              <div class="task-meta"><strong>Reward:</strong> ${escapeHtml(
                task.reward
              )}</div>
              <div class="task-meta"><strong>Completed:</strong> ${formatDate(
                task.completedAt
              )}</div>
              <div class="task-meta"><strong>Paid:</strong> ${formatDate(
                task.paidAt
              )}</div>
              ${paymentLinkHtml}
            </div>
            <div class="task-status status-${task.status}">${task.status}</div>
          </div>

          <div class="task-actions">
            ${getActionButtons(task)}
          </div>
        </div>
      `;
    })
    .join('');
}

async function loadTasks() {
  try {
    const tasks = await fetchTasks();
    renderTasks(tasks);
  } catch (error) {
    tasksContainer.innerHTML = `<p class="empty-state">${error.message}</p>`;
  }
}

createTaskForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const title = document.getElementById('title').value.trim();
  const description = document.getElementById('description').value.trim();
  const reward = document.getElementById('reward').value.trim();

  if (!title || !description || !reward) {
    alert('Please fill out all fields.');
    return;
  }

  try {
    await postAction(apiBase, { title, description, reward });
    createTaskForm.reset();
    await loadTasks();
  } catch (error) {
    alert(error.message);
  }
});

refreshBtn.addEventListener('click', loadTasks);

tasksContainer.addEventListener('click', async (event) => {
  const target = event.target;
  if (!(target instanceof HTMLButtonElement)) return;

  const { action, id } = target.dataset;
  if (!action || !id) return;

  try {
    if (action === 'start') {
      await postAction(`${apiBase}/${id}/start`);
    }

    if (action === 'complete') {
      await postAction(`${apiBase}/${id}/complete`);
    }

    if (action === 'hold') {
      await postAction(`${apiBase}/${id}/hold`);
    }

    if (action === 'release') {
      await postAction(`${apiBase}/${id}/release`);
    }

    if (action === 'confirm-payment') {
      await postAction(`${apiBase}/${id}/confirm-payment`);
    }

    if (action === 'add-payment-link') {
      const paymentLink = window.prompt('Enter LanceMint payment link:');
      if (!paymentLink || !paymentLink.trim()) {
        return;
      }

      await postAction(`${apiBase}/${id}/payment-link`, {
        paymentLink: paymentLink.trim(),
      });
    }

    await loadTasks();
  } catch (error) {
    alert(error.message);
  }
});

loadTasks();
