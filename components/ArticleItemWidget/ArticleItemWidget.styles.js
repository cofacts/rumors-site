import css from 'styled-jsx/css'; // eslint-disable-line import/no-unresolved

export const articleItemWidgetStyle = css`
  ul {
    --selection-size: 0.8em;
    position: absolute;
    right: 0;
    /* variable from listItem.styles.js */
    bottom: var(--list-item-padding);
    height: calc(var(--font-size) * 2);
  }
  ul.active {
    --selection-size: 1em;
    width: 50%;
  }
  ul.active li {
    transform: translateX(calc(var(--index) * -2.5em));
    opacity: 1;
  }
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

  /* clickable area */
  .tag {
    width: var(--selection-size);
    height: var(--selection-size);
    border-radius: 50%;
    background-color: var(--color);
  }
  /* the visual dot */
  .tag::after {
    content: '';
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    --selection-border-size: calc(var(--selection-size) * 1.3);
    width: var(--selection-border-size);
    height: var(--selection-border-size);
    border-radius: 50%;
    border: 1px solid var(--color);
    opacity: 0;
  }

  li.active .dot::after {
    opacity: 1;
  }
`;
