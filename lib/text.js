import React from 'react';
import gql from 'graphql-tag';

const BREAK = { $$BREAK: true };

/**
 * Invokes traverseForStrings for each item in elems.
 * When `BREAK` is received, break traversal immediately.
 *
 * @param {*} elem Array of elements to traverse
 * @param {Function} callback passed to traverseForStrings()
 */
function traverseElems(elems, callback) {
  const result = [];
  for (let i = 0; i < elems.length; i += 1) {
    const returnValue = traverseForStrings(elems[i], callback);
    if (returnValue === BREAK) break;
    result.push(returnValue);
  }

  return result;
}

/**
 * Traverses elem tree for strings, returns callback(string)
 * @param {*} elem
 * @param {Function} callback
 */
function traverseForStrings(elem, callback) {
  switch (true) {
    case typeof elem === 'string':
      return callback(elem);

    case elem instanceof Array:
      return traverseElems(elem, callback);

    case React.isValidElement(elem): {
      const children = React.Children.toArray(elem.props.children);
      const newChildren = traverseElems(children, callback);

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

    const tokenized = str.split(urlRegExp).map((s, i) =>
      s.match(urlRegExp) ? (
        <a key={`link${i}`} href={s} {...props}>
          {shortenUrl(s, maxLength)}
        </a>
      ) : (
        s
      )
    );

    return flatternPureStrings(tokenized);
  });
}

const newLinePattern = '(\r\n|\r|\n)';
// Spaces around new line pattern should be safe to trim, because we are placing <br>
// on the newLinePattern.
const newLineRegExp = RegExp(` *${newLinePattern} *`, 'g');

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
      .split(newLineRegExp)
      .filter(token => token !== '') // Filter out empty strings
      .map((line, idx) =>
        line.match(newLineRegExp) ? <br key={`br${idx}`} /> : line
      );

    // If the tokenized contains only string, join into one single string.
    //
    return flatternPureStrings(tokenized);
  });
}

/**
 *
 * @param {string} text
 * @param {number} option.wordCount
 * @param {string} option.morePostfix
 */
export function ellipsis(
  text,
  { wordCount = Infinity, morePostfix = '⋯⋯' } = {}
) {
  if (text.length <= wordCount) {
    return text;
  }

  return `${text.slice(0, wordCount)}${morePostfix}`;
}

/**
 * Truncates the given elem to the specified wordCount.
 * When truncated, appends moreElem to the end of the string.
 *
 * @param {*} elem React element, string, array of string & react elements
 * @param {<wordCount: Number, moreElem: ReactElement>} options
 * @returns {JSXElement}
 */
export function truncate(elem, { wordCount = Infinity, moreElem = null } = {}) {
  let currentWordCount = 0;
  const result = traverseForStrings(elem, str => {
    if (currentWordCount >= wordCount) return BREAK;

    currentWordCount += str.length;
    const exceededCount = currentWordCount - wordCount;

    return exceededCount <= 0 ? str : str.slice(0, -exceededCount);
  });

  switch (true) {
    // Not exceeding wordCount, just return the original element
    case currentWordCount <= wordCount:
      return elem;

    // If the result is an array, append moreElem
    case result instanceof Array:
      return result.concat(moreElem);

    // Others, including result being a string or React Element.
    default:
      return [result, moreElem];
  }
}

/**
 * Converts Highlight string (with "<HIGHLIGHT></HIGHLIGHT>") to JSX array of strings and <mark> elems
 *
 * @param {string | null | undefined} highlightStr
 * @param {string} highlightClassName
 * @returns {JSXElement[]}
 */
function getMarkElems(highlightStr, highlightClassName) {
  if (typeof highlightStr !== 'string') return [];

  return highlightStr
    .split('</HIGHLIGHT>')
    .flatMap((tokens, idx) => {
      const [nonHighlight, highlighted] = tokens.split('<HIGHLIGHT>');

      return [
        nonHighlight,
        highlighted && (
          <mark key={`highlight-${idx}`} className={highlightClassName}>
            {highlighted}
          </mark>
        ),
      ];
    })
    .filter(jsxElem => !!jsxElem);
}

/**
 * Processes Highlights object from rumors-api
 *
 * @param {object} highlightObj React element, string, array of string & react elements
 * @param {{highlight: string; reference: string, hyperlinks: string}} classes
 * @returns {JSXElement}
 */
export function highlightSections({ text, reference, hyperlinks }, classes) {
  const jsxElems = [];

  if (text) {
    jsxElems.push(...getMarkElems(text, classes.highlight));
  }

  if (reference) {
    jsxElems.push(
      <section className={classes.reference} key="reference-section">
        {getMarkElems(reference, classes.highlight)}
      </section>
    );
  }

  if (hyperlinks && hyperlinks.length) {
    jsxElems.push(
      ...hyperlinks.map(({ title, summary }, idx) => (
        <section
          className={classes.hyperlinks}
          key={`hyperlink-section-${idx}`}
        >
          {getMarkElems(`${title || ''} ${summary || ''}`, classes.highlight)}
        </section>
      ))
    );
  }

  return jsxElems;
}

highlightSections.fragments = {
  HighlightFields: gql`
    fragment HighlightFields on Highlights {
      text
      reference
      hyperlinks {
        title
        summary
      }
    }
  `,
};
