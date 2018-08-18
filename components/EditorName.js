import React from 'react';
import ReactToolTip from 'react-tooltip';
import levelNames from '../constants/levelNames';

export default function EditorName({ editorName, editorLevel }) {
  return (
    <span>
      <span data-tip data-for="editor-info">
        {editorName}
      </span>
      <ReactToolTip id="editor-info" wrapper="span">
        <span>{`Lv.${editorLevel} ${levelNames[editorLevel]} `}</span>
      </ReactToolTip>
    </span>
  );
}
