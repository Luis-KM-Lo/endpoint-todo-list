import { TodoStatus, Todo } from '../types';

export const getItemStatus = ({ dueDate, isComplete }: Todo): TodoStatus => {
  if (isComplete) {
    return TodoStatus.COMPLETE;
  }
  if (dueDate && new Date(Date.now()).getTime() - new Date(dueDate).getTime()) {
    return TodoStatus.OVERDUE;
  }
  return TodoStatus.DEFAULT;
};

export const getListItemBackgroundColor = (status: TodoStatus): string => {
  switch (status) {
    case TodoStatus.COMPLETE:
      return 'rgba(0, 255, 0, 0.2)';
    case TodoStatus.OVERDUE:
      return 'rgba(255, 0, 0, 0.2)';
    case TodoStatus.DEFAULT:
      return 'rgba(196, 196, 196, 0.2)';
    default:
      const exhaustiveCheck: never = status;
      throw new Error(`Unhandled color case: ${exhaustiveCheck}`);
  }
};
