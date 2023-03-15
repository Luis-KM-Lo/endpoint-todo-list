export interface Todo {
  id?: string;
  description?: string;
  isComplete?: boolean;
  dueDate?: string | null;
}

export enum TodoStatus {
  COMPLETE,
  OVERDUE,
  DEFAULT,
}
