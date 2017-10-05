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

function flatternPureStrings(tokens) {
  return tokens.every(token => typeof token === 'string')
    ? tokens.join()
    : tokens;
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
    if (!str) return str;

    const tokenized = str.split(urlRegExp).map(
      (s, i) =>
        s.match(urlRegExp)
          ? <a key={`link${i}`} href={s} {...props}>
              {shortenUrl(s, maxLength)}
            </a>
          : s
    );

    return flatternPureStrings(tokenized);
  });
}

const newLinePattern = '(\r\n|\r|\n)';
// Spaces around new line pattern should be safe to trim, because we are placing <br>
// on the newLinePattern.
const newLineRegExp = RegExp(` *${newLinePattern} *`, 'g');
const leadingAndTrailingNewLineRegExp = RegExp(
  `^ *${newLinePattern}+ *| *${newLinePattern}+ *$`,
  'g'
);

/**
 * Place <br> for each line break.
 * Automatically trims away leading & trailing line breaks.
 *
 * @param {*} elem React element, string, array of string & react elements
 */
export function nl2br(elem) {
  return traverseForStrings(elem, str => {
    if (!str) return str;

    const tokenized = str
      .replace(leadingAndTrailingNewLineRegExp, '')
      .split(newLineRegExp)
      .filter(token => token !== '') // Filter out empty strings
      .map(
        (line, idx) =>
          line.match(newLineRegExp) ? <br key={`br${idx}`} /> : line
      );

    // If the tokenized contains only string, join into one single string.
    //
    return flatternPureStrings(tokenized);
  });
}
