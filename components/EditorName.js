import React from 'react';
import levelNames from '../constants/levelNames';
import 'balloon-css/balloon.css';

export default function EditorName({ editorName, editorLevel }) {
  return (
    <span
      data-balloon={`Lv.${editorLevel} ${levelNames[editorLevel]} `}
      data-balloon-pos="up"
    >
      {editorName}
    </span>
  );
}
