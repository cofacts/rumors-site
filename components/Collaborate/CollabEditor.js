/* eslint-env browser */

import * as Y from 'yjs';
import { HocuspocusProvider } from '@hocuspocus/provider';
import {
  ySyncPlugin,
  yCursorPlugin,
  yUndoPlugin,
  undo,
  redo,
} from 'y-prosemirror';
import { t } from 'ttag';
import { nl2br, linkify } from 'lib/text';
import { Button, Typography } from '@material-ui/core';
import { TranscribePenIcon } from 'components/icons';
import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { schema } from 'prosemirror-schema-basic';
import { DOMParser } from 'prosemirror-model';
import { exampleSetup } from 'prosemirror-example-setup';
import { keymap } from 'prosemirror-keymap';
import { useState, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import useCurrentUser from 'lib/useCurrentUser';
import cx from 'clsx';
import PlaceholderPlugin from './Placeholder';
import getConfig from 'next/config';

const {
  publicRuntimeConfig: { PUBLIC_COLLAB_SERVER_URL },
} = getConfig();

const useStyles = makeStyles(theme => ({
  transcriptHeader: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 0,
  },
  transcriptTitle: {
    fontWeight: 'bold',
    color: theme.palette.secondary[200],
  },
  transcriptFooter: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: 0,
  },
  transcribeButton: {
    borderRadius: 30,
    // border: `1px solid ${theme.palette.primary.main}`,
  },
  editButton: {
    color: theme.palette.secondary[200],
    borderRadius: 30,
    // border: `1px solid ${theme.palette.primary.main}`,
  },
  newReplyFabIcon: {
    marginRight: 8,
    fontSize: '1.2rem',
  },
  prosemirrorEditor: {
    borderRadius: 8,
    border: `1px solid ${theme.palette.secondary[200]}`,
    marginTop: 16,
    marginBottom: 16,
    '&.hide': { display: 'none' },
  },
}));

const colors = [
  '#ECD444',
  '#EE6352',
  '#9E6F21',
  '#E5F9DB',
  '#1B9C85',
  '#068DA9',
  '#EB455F',
  '#5D3891',
  '#BAD1C2',
];

const color = colors[Math.floor(Math.random() * colors.length)];

const CollabEditor = ({ article }) => {
  const editor = useRef(null);
  const [editorView, setEditorView] = useState(null);
  const currentUser = useCurrentUser();
  const onTranscribe = () => {
    if (!currentUser) {
      return alert(t`Please login first.`);
    }
    const ydoc = new Y.Doc();
    const permanentUserData = new Y.PermanentUserData(ydoc);
    permanentUserData.setUserMapping(ydoc, ydoc.clientID, currentUser.name);
    ydoc.gc = false;

    const provider = new HocuspocusProvider({
      url: PUBLIC_COLLAB_SERVER_URL,
      name: article.id,
      broadcast: false,
      document: ydoc,
      // onAwarenessChange: ({ states }) => {
      //   console.log('provider', states);
      // },
    });
    provider.setAwarenessField('user', {
      name: currentUser.name,
      color,
    });
    const yXmlFragment = ydoc.get('prosemirror', Y.XmlFragment);

    if (editorView) editorView.destroy();
    setEditorView(
      new EditorView(editor.current, {
        state: EditorState.create({
          schema,
          doc: DOMParser.fromSchema(schema).parse(editor.current),
          plugins: [
            ySyncPlugin(yXmlFragment, { permanentUserData }),
            yCursorPlugin(provider.awareness),
            yUndoPlugin(),
            keymap({
              'Mod-z': undo,
              'Mod-y': redo,
              'Mod-Shift-z': redo,
            }),
            PlaceholderPlugin(t`Input transcript`),
          ].concat(exampleSetup({ schema, menuBar: false })),
        }),
      })
    );
  };

  const onDone = () => {
    if (editorView) {
      let text = '';
      editorView.state.doc.content.forEach(node => {
        // console.log(node.textContent);
        // console.log(node.type.name);
        if (node.textContent) {
          text += node.textContent;
        }
        text += '\n';
      });

      // TODO: listen textChanged event?
      article.text = text;
      editorView.destroy();
    }
    setEditorView(null);
  };

  const classes = useStyles();
  return (
    <div className="CollabEditor">
      <div className={classes.transcriptHeader}>
        {!article.text ? (
          <>
            <Typography
              className={classes.transcriptTitle}
              variant="body2"
              color="textSecondary"
              display="block"
            >
              {t`No transcripts yet`}
            </Typography>
            {!editorView ? (
              <>
                <Button
                  color="primary"
                  variant="outlined"
                  className={classes.transcribeButton}
                  onClick={onTranscribe}
                >
                  <TranscribePenIcon className={classes.newReplyFabIcon} />
                  {t`Transcribe`}
                </Button>
              </>
            ) : null}
          </>
        ) : (
          <>
            <Typography
              className={classes.transcriptTitle}
              variant="body2"
              color="textSecondary"
              display="block"
            >
              {t`Transcript`}
            </Typography>
            {!editorView ? (
              <>
                <Button
                  variant="outlined"
                  className={classes.editButton}
                  onClick={onTranscribe}
                >
                  <TranscribePenIcon className={classes.newReplyFabIcon} />
                  {t`Edit`}
                </Button>
              </>
            ) : null}
          </>
        )}
      </div>
      {!editorView ? (
        <>
          {article.text &&
            nl2br(
              linkify(article.text, {
                props: {
                  target: '_blank',
                  rel: 'ugc nofollow',
                },
              })
            )}
        </>
      ) : null}
      <div
        ref={editor}
        className={cx(classes.prosemirrorEditor, !editorView && 'hide')}
      />
      {!editorView ? null : (
        <>
          <div className={classes.transcriptFooter}>
            <Button
              color="primary"
              variant="contained"
              style={{ borderRadius: 30 }}
              onClick={onDone}
            >
              {t`Done`}
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default CollabEditor;
