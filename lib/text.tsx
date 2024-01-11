import React, { CSSProperties } from 'react';
import { gql } from 'graphql-tag';
import { withStyles, WithStyles, createStyles } from '@material-ui/core/styles';
import { HighlightFieldsFragment } from 'typegen/graphql';

const BREAK = { $$BREAK: true } as const;

/**
 * Called when `traverseForStrings()` reaches a string.
 */
type Callback = (s: string) => React.ReactNode | typeof BREAK;

/**
 * Invokes traverseForStrings for each item in elems.
 * When `BREAK` is received, break traversal immediately.
 *
 * @param elems - Array of elements to traverse
 * @param callback - passed to traverseForStrings()
 */
function traverseElems(elems: React.ReactNode[], callback: Callback) {
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
 * @param elem
 * @param callback
 */
function traverseForStrings(elem: React.ReactNode, callback: Callback) {
  if (typeof elem === 'string') {
    return callback(elem);
  }

  if (elem instanceof Array) {
    return traverseElems(elem, callback);
  }

  if (React.isValidElement(elem)) {
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

  return null;
}

type CropperProps = {
  maxWidth: CSSProperties['maxWidth'];
  children: React.ReactNode;
};

const cropperStyle = createStyles({
  cropper: {
    display: 'inline-block',
    maxWidth: ({ maxWidth }: CropperProps) => `min(100%, ${maxWidth})`, // 100% ensures this inline-block does not stick out its container
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    textDecoration: 'inherit',
    verticalAlign: 'bottom', // align with the rest of the URLs
  },
});

const Cropper = withStyles(cropperStyle)(
  ({ children, classes }: CropperProps & WithStyles<typeof cropperStyle>) => {
    return <span className={classes.cropper}>{children}</span>;
  }
);

function shortenUrl(s: string, maxLength: number) {
  try {
    s = decodeURIComponent(s);
  } catch (e) {
    // Probably malformed URI components.
    // Do nothing, just use original string
  }
  return s.length <= maxLength ? (
    s
  ) : (
    <>
      <Cropper maxWidth={`${maxLength / 4}em`}>
        {s.slice(0, -maxLength / 2)}
      </Cropper>
      {s.slice(-maxLength / 2)}
    </>
  );
}

function flatternPureStrings(tokens: React.ReactChild[]) {
  return tokens.every(token => typeof token === 'string')
    ? tokens.join()
    : tokens;
}

const urlRegExp = /(https?:\/\/\S+)/;

/**
 * Wrap <a> around hyperlinks inside a react element or string.
 *
 * @param elem React element, string, array of string & react elements
 * @param options
 */
export function linkify(
  elem: React.ReactNode,
  {
    maxLength = 80,
    props = {},
  }: { maxLength?: number; props?: React.ComponentPropsWithoutRef<'a'> } = {}
) {
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
 * @param elem React element, string, array of string & react elements
 */
export function nl2br(elem: React.ReactNode) {
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

export function ellipsis(
  /** Text to ellipsis */
  text: string,
  {
    wordCount = Infinity,
    morePostfix = '⋯⋯',
  }: {
    /** Max length of the text before it's being ellipsised */
    wordCount?: number;

    /** The ellipsis postfix. Default to '⋯⋯' */
    morePostfix?: string;
  } = {}
) {
  if (text.length <= wordCount) {
    return text;
  }

  return `${text.slice(0, wordCount)}${morePostfix}`;
}

/**
 * Truncates the given elem to the specified `wordCount`.
 * When truncated, appends `moreElem` to the end of the string.
 *
 * @param elem - React element, string, array of string & react elements
 * @param options
 */
export function truncate(
  elem: React.ReactNode,
  {
    wordCount = Infinity,
    moreElem = null,
  }: {
    wordCount?: number;
    moreElem?: React.ReactElement;
  } = {}
) {
  let currentWordCount = 0;
  const result = traverseForStrings(elem, str => {
    if (currentWordCount >= wordCount) return BREAK;

    currentWordCount += str.length;
    const exceededCount = currentWordCount - wordCount;

    return exceededCount <= 0 ? str : str.slice(0, -exceededCount);
  });

  // Not exceeding wordCount, just return the original element
  if (currentWordCount <= wordCount) {
    return elem;
  }

  // If the result is an array, append moreElem
  if (result instanceof Array) {
    return result.concat(moreElem);
  }

  // Others, including result being a string or React Element.
  return [result, moreElem];
}

/**
 * Converts highlight string (with "<HIGHLIGHT></HIGHLIGHT>") to JSX array of strings and <mark> elems
 */
function getMarkElems(
  highlightStr: string | null | undefined,
  highlightClassName: string
) {
  if (typeof highlightStr !== 'string') return [];

  return highlightStr
    .split('</HIGHLIGHT>')
    .reduce<React.ReactChild[]>((tokens, token, idx) => {
      const [nonHighlight, highlighted] = token.split('<HIGHLIGHT>');

      return [
        ...tokens,
        nonHighlight,
        highlighted && (
          <mark key={`highlight-${idx}`} className={highlightClassName}>
            {highlighted}
          </mark>
        ),
      ];
    }, [])
    .filter(jsxElem => !!jsxElem);
}

export const HighlightFields = gql`
  fragment HighlightFields on Highlights {
    text
    reference
    hyperlinks {
      title
      summary
    }
  }
`;

/**
 * Processes Highlights object from rumors-api
 */
export function highlightSections(
  highlightFields: HighlightFieldsFragment,
  classes: {
    highlight?: string;
    reference?: string;
    hyperlinks?: string;
  }
) {
  const { text, reference, hyperlinks } = highlightFields;

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

const formatter =
  Intl && typeof Intl.NumberFormat === 'function'
    ? new Intl.NumberFormat()
    : null;

export function formatNumber(num: number) {
  return formatter ? formatter.format(num) : num.toString();
}
