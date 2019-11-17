import { t } from 'ttag';
import levelNames from '../constants/levelNames';
import Tooltip from '@material-ui/core/Tooltip';

export default function EditorName({ editorName, editorLevel }) {
  const levelName = levelNames[editorLevel];
  return (
    <Tooltip title={t`Lv.${editorLevel} ${levelName}`} placement="top">
      <span>{editorName}</span>
    </Tooltip>
  );
}
