import React, { useState, useEffect, useRef, Fragment } from 'react';
import { t } from 'ttag';
import { truncate } from 'lib/text';
import { withStyles, makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    position: 'relative',
    overflow: 'hidden',
  },

  /**
   * Moving toggle button to bottom-right for line-clamp sytle ExpandableText
   */
  toggleButtonContainer: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    background: `var(--background, ${theme.palette.common.white})`,

    /**
     * Fade-out area
     */
    '&::before': {
      content: '""',
      position: 'absolute',
      right: '100%',
      top: 0,
      bottom: 0,
      width: '5em',
      background: 'inherit',
      maskImage:
        'linear-gradient(90deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.75) 50%, #000 100%)',
    },
  },
}));

const ToggleButton = withStyles({
  root: {
    border: 0,
    color: '#2079F0',
    outline: 'none',
    cursor: 'pointer',
    background: 'transparent',
    fontSize: 'inherit',
    lineHeight: 'inherit',
    padding: 0,
    margin: 0,
  },
})(({ classes, toggleExpand, expanded, ...otherProps }) => (
  <button className={classes.root} onClick={toggleExpand} {...otherProps}>
    ({expanded ? t`Show Less` + ' ▲' : t`Show More` + ' ▼'})
  </button>
));

ToggleButton.displayName = 'ExpandableTextToggleButton';

const ExpandableText = ({ className, lineClamp, wordCount = 40, children }) => {
  const [expanded, setExpanded] = useState(false);
  const [height, setHeight] = useState(0);
  const [lineHeight, setLineHeight] = useState(16);
  const rootRef = useRef(null);
  const containerRef = useRef(null);
  const classes = useStyles();

  const toggleExpand = () => setExpanded(!expanded);

  useEffect(() => {
    if (lineClamp) {
      const computedStyle = window.getComputedStyle(containerRef.current);
      const lh = parseFloat(computedStyle.lineHeight);
      setLineHeight(isNaN(lh) ? 14 : lh);
      const clone = containerRef.current.cloneNode(true);
      clone.style.maxHeight = '';
      rootRef.current.appendChild(clone);
      setHeight(parseFloat(window.getComputedStyle(clone).height));
      rootRef.current.removeChild(clone);
    }
  }, [lineClamp]);

  const renderWithLineChampLimits = () => {
    return (
      <div
        ref={containerRef}
        className={classes.root}
        style={{ maxHeight: expanded ? undefined : lineHeight * lineClamp }}
      >
        {children}
        {height >= lineHeight * lineClamp &&
          (expanded ? (
            <ToggleButton
              style={{ float: 'right' }}
              toggleExpand={toggleExpand}
              expanded={expanded}
            />
          ) : (
            <div className={classes.toggleButtonContainer}>
              <ToggleButton toggleExpand={toggleExpand} expanded={expanded} />
            </div>
          ))}
      </div>
    );
  };

  const renderWithWordCountLimits = () =>
    expanded ? (
      <>
        {children}
        <ToggleButton
          style={{ marginLeft: '1em' }}
          toggleExpand={toggleExpand}
          expanded={expanded}
        />
      </>
    ) : (
      truncate(children, {
        wordCount,
        moreElem: (
          <Fragment
            key="toggle" /* key required because truncate() returns array */
          >
            ⋯
            <ToggleButton
              key="expandable-text-more-button"
              toggleExpand={toggleExpand}
              expanded={expanded}
            />
          </Fragment>
        ),
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
