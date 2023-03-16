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
  onClick: (params: Todo) => void;
  selectedItem: {
    id: string;
    loading: boolean;
  };
}

const StyledListItem = styled(ListItem)<{ status: TodoStatus }>`
  margin: 8px 0;
  height: 50px;
  ${({ status }) => css`
    background-color: ${getListItemBackgroundColor(status)};
  `}
`;

export const TodoItem = memo(function ({
  id,
  description,
  isComplete,
  dueDate,
  selectedItem,
  onClick,
}: Props) {
  return (
    <StyledListItem
      dense
      status={getItemStatus({ dueDate, isComplete })}
      onClick={() => {
        if (id !== selectedItem?.id && selectedItem?.loading) {
          return;
        }
        onClick({ id, isComplete: !isComplete, description, dueDate });
      }}
      disabled={id !== selectedItem?.id && selectedItem?.loading}
      sx={{
        '&.Mui-disabled': {
          opacity: 1,
          cursor: 'not-allowed',
        },
      }}
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
            disabled={id !== selectedItem?.id && selectedItem?.loading}
            sx={{
              '&.Mui-checked': {
                color: 'black',
              },
              '&.Mui-disabled': {
                cursor: 'not-allowed',
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
