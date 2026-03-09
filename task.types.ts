export type TaskStatus =
  | 'OPEN'
  | 'IN_PROGRESS'
  | 'COMPLETED_PENDING_PAYOUT'
  | 'ON_HOLD'
  | 'PAYOUT_SENT'
  | 'PAID_CONFIRMED';

export interface Task {
  id: string;
  title: string;
  description: string;
  reward: string;
  status: TaskStatus;
  paymentLink?: string;
  completedAt?: string | null;
  paidAt?: string | null;
}
