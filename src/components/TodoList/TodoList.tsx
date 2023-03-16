import { useCallback, useState } from 'react';
import { Box, List, CircularProgress, styled } from '@mui/material';
import { Todo } from '../../types';
import { TodoItem } from '../TodoItem';
import { useTodos } from '../../hooks/useTodos';

export function TodoList() {
  const {
    todoData,
    completedList,
    incompletedList,
    todosError,
    mutateTodo,
    isTodosLoading,
  } = useTodos();

  const [selectedItem, setSelectedItem] = useState<{
    id: string;
    loading: boolean;
  }>({ id: '', loading: false });

  const StyledListContainer = styled(Box)`
    display: flex;
    justify-content: center;
    margin-top: 16px;
  `;

  const handleClick = useCallback(
    async ({ id, isComplete, ...rest }: Todo) => {
      setSelectedItem({ id: id ?? '', loading: true });

      try {
        const res = await fetch(
          `${process.env.REACT_APP_API_URL}/patch/${id}`,
          {
            method: 'PATCH',
            mode: 'cors',
            headers: {
              'Content-Type': 'application/json',
              'X-Api-Key': process.env.REACT_APP_API_KEY ?? '',
            },
            body: JSON.stringify({ isComplete }),
          }
        );
        const data = await res.json();

        if (data.status === 'success') {
          const newTodoData = [
            ...(todoData?.filter((todo) => todo?.id !== id) ?? []),
            { id, isComplete, ...rest },
          ];
          // revalidate changed to false to disable refetching since this is a mocked API.
          mutateTodo('/get', newTodoData, { revalidate: false });
        }
      } catch (error) {
        console.log('Error', error);
      }

      setSelectedItem({ id: id ?? '', loading: false });
    },
    [todoData, mutateTodo]
  );

  if (todosError) {
    return <StyledListContainer>Failure to fetch</StyledListContainer>;
  }

  if (isTodosLoading) {
    return (
      <StyledListContainer>
        <CircularProgress />
      </StyledListContainer>
    );
  }

  return (
    <StyledListContainer>
      <List sx={{ width: 543 }}>
        {incompletedList?.map(({ id, ...rest }) => (
          <TodoItem
            selectedItem={selectedItem}
            onClick={handleClick}
            key={id}
            id={id}
            {...rest}
          />
        ))}
        {completedList?.map(({ id, ...rest }) => (
          <TodoItem
            selectedItem={selectedItem}
            onClick={handleClick}
            key={id}
            id={id}
            {...rest}
          />
        ))}
      </List>
    </StyledListContainer>
  );
}

export default TodoList;
