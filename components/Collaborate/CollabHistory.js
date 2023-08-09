import { t } from 'ttag';
import * as Y from 'yjs';
import { ySyncPlugin, ySyncPluginKey } from 'y-prosemirror';
import { useProseMirror, ProseMirror } from 'use-prosemirror';
import { schema } from './Schema';
import { exampleSetup } from 'prosemirror-example-setup';
import { useState, useRef, useEffect, forwardRef, useCallback } from 'react';
import { Button, Modal, Box, Typography } from '@material-ui/core';
import { ToggleButtonGroup, ToggleButton } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles(theme => ({
  prosemirrorEditor: {
    borderRadius: 8,
    border: `1px solid ${theme.palette.secondary[200]}`,
    marginBottom: 16,
    flexGrow: 1,
    overflow: 'auto',
  },
  modal: {
    display: 'flex',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '80vh',
    height: '80vh',
    backgroundColor: 'white',
    border: `1px solid ${theme.palette.secondary[200]}`,
    borderRadius: 10,
    padding: 20,
  },
  modalSideBar: {
    flex: 'none',
    display: 'flex',
    flexDirection: 'column',
    width: 200,
    padding: 4,
  },
  modalMain: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    padding: 4,
  },
  modalClose: {
    position: 'absolute',
    right: 12,
    top: 10,
    color: theme.palette.secondary[100],
  },
}));

const renderVersion = (editorview, version, prevVersion) => {
  const transaction = editorview.state.tr.setMeta(ySyncPluginKey, {
    snapshot: Y.decodeSnapshot(version.snapshot),
    prevSnapshot:
      prevVersion == null
        ? Y.emptySnapshot
        : Y.decodeSnapshot(prevVersion.snapshot),
  });
  editorview.dispatch(transaction);
};

// const unrenderVersion = editorview => {
//   const binding = ySyncPluginKey.getState(editorview.state).binding;
//   if (binding != null) {
//     binding.unrenderSnapshot();
//   }
// };

/**
 * Should render `Versions` after `editorLoaded`,
 * `Versions` will default render latest version
 * @param {EditorView} editorView
 * @param {Y.Doc} ydoc
 * @param {(version: Y.Snapshot, index: number) => void} onSelect - called when version selected
 */
const Versions = ({ editorView, ydoc, onSelect }) => {
  const versions = ydoc.getArray('versions');
  const defaultVIdx = versions.length - 1;
  const [selectedVersion, setSelectedVersion] = useState(null);

  useEffect(() => {
    // default select latest version
    selectAndRender(defaultVIdx);
  }, [defaultVIdx, selectAndRender]);

  const selectAndRender = useCallback(
    reverseIdx => {
      setSelectedVersion(reverseIdx);
      const version = versions.get(reverseIdx);
      const prevVersion = reverseIdx > 0 ? versions.get(reverseIdx - 1) : null;
      onSelect(version, reverseIdx);
      renderVersion(editorView, version, prevVersion);
    },
    [versions, onSelect, editorView]
  );

  const toggleChanged = (event, reverseIdx) => {
    // avoid deselect toggle
    if (reverseIdx === null) return;
    selectAndRender(reverseIdx);
  };

  return (
    <>
      <Typography variant="h6">{t`Versions`}</Typography>
      {versions.length > 0 ? (
        <ToggleButtonGroup
          orientation="vertical"
          value={selectedVersion}
          exclusive
          onChange={toggleChanged}
          style={{ overflow: 'auto' }}
        >
          {versions.map((v, i) => {
            // list version in reverse order
            const reverseIdx = versions.length - 1 - i;
            const version = versions.get(reverseIdx);

            return (
              <ToggleButton key={reverseIdx} value={reverseIdx}>
                {new Date(version.date).toLocaleString()}
              </ToggleButton>
            );
          })}
        </ToggleButtonGroup>
      ) : (
        <div>No snapshots..</div>
      )}
    </>
  );
};

const CustomModalContent = forwardRef(function CustomModalContent(
  { ydoc, onClose },
  ref
) {
  const editor = useRef(ref);
  const classes = useStyles();
  const [versionTitle, setVersionTitle] = useState('');
  const [editorLoaded, setEditorLoaded] = useState(false);

  const permanentUserData = new Y.PermanentUserData(ydoc);
  const yXmlFragment = ydoc.get('prosemirror', Y.XmlFragment);
  const onFirstRender = () => {
    setEditorLoaded(true);
  };

  const [state, setState] = useProseMirror({
    schema,
    plugins: [
      ySyncPlugin(yXmlFragment, {
        permanentUserData,
        onFirstRender,
      }),
    ].concat(exampleSetup({ schema, menuBar: false })),
  });

  return (
    <>
      <Box className={classes.modal}>
        <Box className={classes.modalSideBar}>
          {/* show Versions after editorLoaded to ensure default snapshot rendered correctly */}
          {editorLoaded && (
            <Versions
              editorView={editor.current.view}
              ydoc={ydoc}
              onSelect={version =>
                setVersionTitle(new Date(version.date).toLocaleString())
              }
            />
          )}
        </Box>
        <Box className={classes.modalMain}>
          <Typography variant="h6">{t`Difference between version ${versionTitle} and its previous version`}</Typography>
          <ProseMirror
            ref={editor}
            state={state}
            onChange={setState}
            className={classes.prosemirrorEditor}
          />
        </Box>
        <CloseIcon className={classes.modalClose} onClick={onClose} />
      </Box>
    </>
  );
});

const CollabHistory = ({ ydoc }) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const classes = useStyles();

  return (
    <>
      <div className="CollabEditor">
        <Button
          variant="outlined"
          className={classes.editButton}
          onClick={handleOpen}
        >
          {t`History`}
        </Button>
        <Modal open={open} onClose={handleClose}>
          <CustomModalContent ydoc={ydoc} onClose={handleClose} />
        </Modal>
      </div>
    </>
  );
};

export default CollabHistory;
