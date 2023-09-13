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
import { useProseMirror, ProseMirror } from 'use-prosemirror';
import { schema } from './Schema';
import { exampleSetup } from 'prosemirror-example-setup';
import { keymap } from 'prosemirror-keymap';
import { useState, useRef, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import useCurrentUser from 'lib/useCurrentUser';
import PlaceholderPlugin from './Placeholder';
import getConfig from 'next/config';
import CollabHistory from './CollabHistory';

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

const Editor = ({ provider, currentUser, className, innerRef, onUnmount }) => {
  useEffect(() => {
    // console.log('editor mount');
    return () => {
      onUnmount();
    };
  }, [onUnmount]);

  const ydoc = provider.document;
  const permanentUserData = new Y.PermanentUserData(ydoc);
  permanentUserData.setUserMapping(
    ydoc,
    ydoc.clientID,
    JSON.stringify({
      id: currentUser.id,
      name: currentUser.name,
    })
  );

  const yXmlFragment = ydoc.get('prosemirror', Y.XmlFragment);

  const [state, setState] = useProseMirror({
    schema,
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
  });

  return (
    <ProseMirror
      ref={innerRef}
      state={state}
      onChange={setState}
      className={className}
    />
  );
};

/**
 * @param {Article} props.article
 */
const CollabEditor = ({ article }) => {
  const editor = useRef(null);
  const [showEditor, setShowEditor] = useState(null);
  const [isSynced, setIsSynced] = useState(false);
  const currentUser = useCurrentUser();

  // onTranscribe setup provider for both Editor and CollabHistory to use.
  // And, to avoid duplicated connection, provider will be destroyed(close connection) when Editor unmounted.
  const [provider, setProvider] = useState(null);

  const onTranscribe = () => {
    if (!currentUser) {
      return alert(t`Please login first.`);
    }

    setShowEditor(true);

    if (provider) return;
    setIsSynced(false);
    const provider = new HocuspocusProvider({
      url: PUBLIC_COLLAB_SERVER_URL,
      name: article.id,
      broadcast: false,
      document: new Y.Doc({ gc: false }), // set gc to false to keep doc (delete)history
      onSynced: () => {
        // https://github.com/ueberdosis/hocuspocus/blob/main/docs/provider/events.md
        // console.log('onSynced');
        setIsSynced(true);
      },
      // onAwarenessChange: ({ states }) => {
      //   console.log('provider', states);
      // },
    });
    provider.setAwarenessField('user', {
      name: currentUser.name,
      color,
    });
    setProvider(provider);
  };

  const onDone = () => {
    // get EditorView: https://github.com/ponymessenger/use-prosemirror#prosemirror-
    const prosemirrorEditorView = editor.current?.view;
    if (prosemirrorEditorView) {
      let text = '';
      prosemirrorEditorView.state.doc.content.forEach(node => {
        // console.log(node.textContent);
        // console.log(node.type.name);
        if (node.textContent) {
          text += node.textContent;
        }
        text += '\n';
      });

      // TODO: listen textChanged event?
      article.text = text;
    }
    setShowEditor(false);
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
            {!showEditor ? (
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
            {!showEditor ? (
              <Button
                variant="outlined"
                className={classes.editButton}
                onClick={onTranscribe}
              >
                <TranscribePenIcon className={classes.newReplyFabIcon} />
                {t`Edit`}
              </Button>
            ) : (
              isSynced && (
                <CollabHistory ydoc={provider.document} docName={article.id} />
              )
            )}
          </>
        )}
      </div>
      {!showEditor ? (
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
      {showEditor && isSynced && (
        <Editor
          provider={provider}
          innerRef={editor}
          className={classes.prosemirrorEditor}
          currentUser={currentUser}
          onUnmount={() => {
            // console.log('destroy provider');
            provider.destroy();
          }}
        />
      )}
      {!showEditor ? null : (
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
