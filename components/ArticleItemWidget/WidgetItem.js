import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

const WidgetItem = ({
  hover,
  activated,
  name,
  description,
  children,
  index,
  color,
  ...otherProps
}) => {
  return (
    <li
      data-description={description}
      name={name}
      {...otherProps}
      onTouchStart={event => event.preventDefault()}
      className={cx('tag', { active: hover })}
      style={{
        '--index': index,
        '--color': color,
      }}
    >
      <div className={cx('tag-dot', { active: activated })} />
      {children}
      <style jsx>{`
        /* clickable area */
        li {
          list-style: none;
          position: absolute;
          right: 0;
          top: 0;
          padding: 0.75em;
          transition: transform 0.1s ease-out;
          opacity: 0;
        }
        /* the description tooltip */
        li::after,
        li::before {
          --bg-color: #1f1f1f;
          content: '';
          position: absolute;
          left: 50%;
          transition: transform 0.3s ease-out;
          transform-origin: center bottom;
          transform: translateX(-50%);
          opacity: 0;
        }
        /* tooltip bottom triangle */
        li::before {
          width: 0;
          height: 0;
          bottom: 1.8em;
          border-style: solid;
          border-width: 0.8em 0.5em 0 0.5em;
          border-color: var(--bg-color) transparent transparent transparent;
        }
        /* tooltip description body */
        li::after {
          content: attr(data-description);
          bottom: 2.5em;
          background: var(--bg-color);
          color: white;
          padding: 1em 0.5em;
          border-radius: 0.5em;
          pointer-events: none;
        }

        li.active::after,
        li.active::before {
          transform: translate(-50%, -0.5em);
          opacity: 1;
        }
        li:first-of-type {
          z-index: 1;
          opacity: 1;
        }

        /* the visual dot */
        .tag-dot {
          width: var(--selection-size);
          height: var(--selection-size);
          border-radius: 50%;
          background-color: var(--color);
        }
      `}</style>
    </li>
  );
};

WidgetItem.propTypes = {
  hover: PropTypes.bool.isRequired,
  description: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func,
  onClick: PropTypes.func,
  color: PropTypes.string.isRequired,
  // this active className is for future, some tag like political or health could have some style to show it's already been tagged
  activated: PropTypes.bool,
};

export default WidgetItem;
