import { memo } from 'react';
import { format } from 'date-fns';
import {
  Checkbox,
  ListItem,
  ListItemIcon,
  ListItemText,
  styled,
  css,
  CircularProgress,
} from '@mui/material';
import { Todo, TodoStatus } from '../../types';
import { getItemStatus, getListItemBackgroundColor } from '../../helpers';

interface Props extends Todo {
  onClick: ({ id, isComplete }: Todo) => void;
  selectedItem: {
    id: string;
    loading: boolean;
  };
}

export const TodoItem = memo(function ({
  id,
  description,
  isComplete,
  dueDate,
  selectedItem,
  onClick,
}: Props) {
  const StyledListItem = styled(ListItem)<{ status: TodoStatus }>`
    margin: 8px 0;
    height: 50px;
    ${({ status }) => css`
      background-color: ${getListItemBackgroundColor(status)};
    `}
  `;

  return (
    <StyledListItem
      dense
      status={getItemStatus({ dueDate, isComplete })}
      onClick={() =>
        onClick({ id, isComplete: !isComplete, description, dueDate })
      }
      secondaryAction={
        dueDate ? (
          <ListItemText
            primary={
              dueDate ? `${format(new Date(dueDate), 'MM/dd/yyyy')}` : ''
            }
            sx={{ border: '1px solid #000', padding: '4px' }}
          />
        ) : (
          <></>
        )
      }>
      <ListItemIcon>
        {id === selectedItem?.id && selectedItem?.loading ? (
          <CircularProgress sx={{ marginLeft: '8px' }} size={24} />
        ) : (
          <Checkbox
            defaultChecked={isComplete}
            disableRipple
            sx={{
              '&.Mui-checked': {
                color: 'black',
              },
            }}
            inputProps={{ 'aria-labelledby': description }}
          />
        )}
      </ListItemIcon>
      <ListItemText
        primary={description}
        sx={{ textDecoration: isComplete ? 'line-through' : 'none' }}
      />
    </StyledListItem>
  );
});
