import React from 'react';

/**
 * Traverses elem tree for strings, returns callback(string)
 * @param {*} elem
 * @param {Function} callback
 */
function traverseForStrings(elem, callback) {
  switch (true) {
    case typeof elem === 'string':
      return callback(elem);
    case elem instanceof Array: {
      return elem.map(el => traverseForStrings(el, callback));
    }
    case React.isValidElement(elem): {
      const children = React.Children.toArray(elem.props.children);
      const newChildren = children.map(childElem =>
        traverseForStrings(childElem, callback)
      );

      // No need to clone element if new children is identical with the original
      //
      if (
        children.length === newChildren.length &&
        children.every((child, idx) => child === newChildren[idx])
      ) {
        return elem;
      }

      return React.cloneElement(elem, {}, newChildren);
    }
    default:
      return null;
  }
}

function shortenUrl(s, maxLength) {
  try {
    s = decodeURIComponent(s);
  } catch (e) {
    // Probably malformed URI components.
    // Do nothing, just use original string
  }
  return s.length <= maxLength
    ? s
    : `${s.slice(0, maxLength / 2)}⋯${s.slice(-maxLength / 2)}`;
}

const urlRegExp = /(https?:\/\/\S+)/;

/**
 * Wrap <a> around hyperlinks inside a react element or string.
 *
 * @param {*} elem React element, string, array of string & react elements
 * @param {<maxLength: Number, blank: Boolean>} options
 */
export function linkify(elem, { maxLength = 80, props = {} } = {}) {
  return traverseForStrings(elem, str => {
    if (!str) return null;
    const tokenized = str.split(urlRegExp).map(
      (s, i) =>
        s.match(urlRegExp)
          ? <a key={`link${i}`} href={s} {...props}>
              {shortenUrl(s, maxLength)}
            </a>
          : s
    );

    // If the tokenized contains only string, join into one single string.
    //
    return tokenized.every(token => typeof token === 'string')
      ? tokenized.join()
      : tokenized;
  });
}

const newLineRegExp = /(\r\n|\r|\n)/g;
export function nl2br(text = '') {
  return text
    .split(newLineRegExp)
    .map(
      (line, idx) =>
        line.match(newLineRegExp) ? <br key={`br${idx}`} /> : linkify(line)
    );
}
