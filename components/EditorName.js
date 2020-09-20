import { t } from 'ttag';
import Link from 'next/link';
import levelNames from '../constants/levelNames';
import Tooltip from './Tooltip';

export default function EditorName({ id, editorName, editorLevel }) {
  const levelName = levelNames[editorLevel];
  return (
    <Tooltip title={t`Lv.${editorLevel} ${levelName}`} placement="top">
      <Link href="/user/[id]" as={`/user/${id}`}>
        <a>{editorName}</a>
      </Link>
    </Tooltip>
  );
}
