import ActionMenu from 'components/ActionMenu';
import { MenuItem } from '@material-ui/core';

const ReplyActions = ({ disabled, handleAction, actionText }) => {
  return (
    <ActionMenu>
      <MenuItem disabled={disabled} onClick={handleAction}>
        {actionText}
      </MenuItem>
    </ActionMenu>
  );
};

export default ReplyActions;
