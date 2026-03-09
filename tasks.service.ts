import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { CreateTaskDto } from './dto/create-task.dto';
import { AddPaymentLinkDto } from './dto/add-payment-link.dto';
import { Task } from './task.types';

@Injectable()
export class TasksService {
  private tasks: Task[] = [
    {
      id: randomUUID(),
      title: 'Create governance mockup',
      description: 'First UI draft for bounty flow',
      reward: '50 USDC',
      status: 'OPEN',
      paymentLink: '',
      completedAt: null,
      paidAt: null,
    },
  ];

  getAll(): Task[] {
    return this.tasks;
  }

  create(dto: CreateTaskDto): Task {
    const task: Task = {
      id: randomUUID(),
      title: dto.title,
      description: dto.description,
      reward: dto.reward,
      status: 'OPEN',
      paymentLink: '',
      completedAt: null,
      paidAt: null,
    };

    this.tasks.push(task);
    return task;
  }

  start(id: string): Task {
    const task = this.findById(id);

    if (task.status !== 'OPEN') {
      throw new BadRequestException('Only OPEN tasks can be started.');
    }

    task.status = 'IN_PROGRESS';
    return task;
  }

  complete(id: string): Task {
    const task = this.findById(id);

    if (task.status !== 'IN_PROGRESS') {
      throw new BadRequestException('Only IN_PROGRESS tasks can be completed.');
    }

    task.status = 'COMPLETED_PENDING_PAYOUT';
    task.completedAt = new Date().toISOString();
    return task;
  }

  hold(id: string): Task {
    const task = this.findById(id);

    if (
      task.status !== 'COMPLETED_PENDING_PAYOUT' &&
      task.status !== 'PAYOUT_SENT'
    ) {
      throw new BadRequestException(
        'Only payout-stage tasks can be placed on hold.',
      );
    }

    task.status = 'ON_HOLD';
    return task;
  }

  release(id: string): Task {
    const task = this.findById(id);

    if (task.status !== 'ON_HOLD') {
      throw new BadRequestException('Only ON_HOLD tasks can be released.');
    }

    task.status = 'COMPLETED_PENDING_PAYOUT';
    return task;
  }

  addPaymentLink(id: string, dto: AddPaymentLinkDto): Task {
    const task = this.findById(id);

    if (task.status !== 'COMPLETED_PENDING_PAYOUT') {
      throw new BadRequestException(
        'Payment links can only be added to COMPLETED_PENDING_PAYOUT tasks.',
      );
    }

    if (!dto.paymentLink || !dto.paymentLink.trim()) {
      throw new BadRequestException('paymentLink is required.');
    }

    task.paymentLink = dto.paymentLink.trim();
    task.status = 'PAYOUT_SENT';
    return task;
  }

  confirmPayment(id: string): Task {
    const task = this.findById(id);

    if (task.status !== 'PAYOUT_SENT') {
      throw new BadRequestException(
        'Only PAYOUT_SENT tasks can be payment-confirmed.',
      );
    }

    if (!task.paymentLink) {
      throw new BadRequestException(
        'Cannot confirm payment without a payment link.',
      );
    }

    task.status = 'PAID_CONFIRMED';
    task.paidAt = new Date().toISOString();
    return task;
  }

  private findById(id: string): Task {
    const task = this.tasks.find((t) => t.id === id);

    if (!task) {
      throw new NotFoundException(`Task ${id} not found.`);
    }

    return task;
  }
}
