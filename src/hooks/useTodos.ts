import { useMemo } from 'react';
import useSWR, { useSWRConfig } from 'swr';
import { Todo } from '../types';

const getTodos = async (url: string) => {
  const res = await fetch(`${process.env.REACT_APP_API_URL}${url}`, {
    method: 'GET',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      'X-Api-Key': process.env.REACT_APP_API_KEY ?? '',
    },
  });
  return await res.json();
};

interface ReturnType {
  isTodosLoading: boolean;
  todoData?: Todo[];
  completedList?: Todo[];
  incompletedList?: Todo[];
  todosError?: any;
  mutateTodo?: any;
}

export function useTodos(): ReturnType {
  const {
    data: todoData,
    isLoading: isTodosLoading,
    error: todosError,
  } = useSWR<Todo[]>('/get', getTodos);
  const { mutate: mutateTodo } = useSWRConfig();

  const completedList = useMemo(
    () =>
      todoData
        ?.filter((todo) => todo.isComplete)
        ?.sort((a: Todo, b: Todo) => {
          const dateA = a.dueDate ? new Date(a.dueDate) : new Date(Date.now());
          const dateB = b.dueDate ? new Date(b.dueDate) : new Date(Date.now());
          return dateA.getTime() - dateB.getTime();
        }) ?? [],
    [todoData]
  );

  const incompletedList = useMemo(
    () =>
      todoData
        ?.filter((todo) => !todo.isComplete)
        ?.sort((a: Todo, b: Todo) => {
          const dateA = a.dueDate ? new Date(a.dueDate) : new Date(Date.now());
          const dateB = b.dueDate ? new Date(b.dueDate) : new Date(Date.now());
          return dateA.getTime() - dateB.getTime();
        }) ?? [],
    [todoData]
  );

  return useMemo(
    () => ({
      isTodosLoading,
      todoData: todoData ?? [],
      completedList,
      incompletedList,
      todosError,
      mutateTodo,
    }),
    [
      completedList,
      incompletedList,
      todoData,
      isTodosLoading,
      todosError,
      mutateTodo,
    ]
  );
}
