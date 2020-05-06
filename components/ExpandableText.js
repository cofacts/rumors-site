import React, { useState, useEffect, useRef } from 'react';
import { t } from 'ttag';
import { truncate } from 'lib/text';
import { withStyles, makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    position: 'relative',
    overflow: 'hidden',
  },
  toggleButtonContainer: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    paddingLeft: '3em',
    backgroundImage: `linear-gradient(90deg, rgba(255,255,255,0) 0%, ${theme.palette.common.white} 30%, ${theme.palette.common.white} 100%)`,
  },
}));

const ToggleButton = withStyles({
  root: {
    border: 0,
    color: '#2079F0',
    outline: 'none',
    cursor: 'pointer',
    background: 'transparent',
  },
})(({ classes, toggleExpand, expanded }) => (
  <button className={classes.root} onClick={toggleExpand}>
    ({expanded ? t`Show Less` + ' ▲' : t`Show More` + ' ▼'})
  </button>
));

const ExpandableText = ({ className, lineClamp, wordCount = 40, children }) => {
  const [expanded, setExpanded] = useState(false);
  const [height, setHeight] = useState(0);
  const [lineHeight, setLineHeight] = useState(16);
  const rootRef = useRef(null);
  const containerRef = useRef(null);
  const classes = useStyles();

  const toggleExpand = () => setExpanded(!expanded);

  const cloneAndComputeHeight = () => {
    const computedStyle = window.getComputedStyle(containerRef.current);
    setLineHeight(parseFloat(computedStyle.lineHeight));
    const clone = containerRef.current.cloneNode(true);
    clone.style.maxHeight = '';
    rootRef.current.appendChild(clone);
    setHeight(parseFloat(window.getComputedStyle(clone).height));
    rootRef.current.removeChild(clone);
  };

  useEffect(() => {
    if (lineClamp) {
      cloneAndComputeHeight();
    }
  }, []);

  const renderWithLineChampLimits = () => {
    return (
      <div
        ref={containerRef}
        className={classes.root}
        style={{ maxHeight: expanded ? undefined : lineHeight * lineClamp }}
      >
        {children}
        {height >= lineHeight * lineClamp && (
          <div className={classes.toggleButtonContainer}>
            <ToggleButton toggleExpand={toggleExpand} expanded={expanded} />
          </div>
        )}
      </div>
    );
  };

  const renderWithWordCountLimits = () =>
    expanded ? (
      <>
        {children}
        <ToggleButton toggleExpand={toggleExpand} expanded={expanded} />
      </>
    ) : (
      truncate(children, {
        wordCount,
        // eslint-disable-next-line react/display-name
        moreElem: (() => (
          <ToggleButton
            key="expandable-text-more-button"
            toggleExpand={toggleExpand}
            expanded={expanded}
          />
        ))(),
      })
    );

  // Note: if "children" is short enough, expanded should never be true.
  //
  return (
    <div className={className} ref={rootRef}>
      {lineClamp ? renderWithLineChampLimits() : renderWithWordCountLimits()}
    </div>
  );
};

export default ExpandableText;
