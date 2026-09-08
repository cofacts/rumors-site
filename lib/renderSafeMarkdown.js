import { marked, Renderer } from 'marked';

/**
 * Escape raw HTML so nothing from user input is ever emitted as a tag:
 * marked passes both block-level and inline raw HTML tokens here.
 */
function escapeHtml(html) {
  return html
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Numeric character references (&#58;, &#x3a;) plus named entities that can
// decode to scheme-relevant characters. Unknown named entities stay literal:
// they cannot decode into scheme characters, so they are safe to leave.
const NAMED_ENTITIES = {
  colon: ':',
  tab: '\t',
  newline: '\n',
  sol: '/',
  semi: ';',
  period: '.',
  plus: '+',
};

/**
 * Canonicalize an href the way a browser decodes attribute values, so
 * allowlist checks see the URL the browser will actually act on:
 * entity decoding first, then removal of characters browsers strip from URLs.
 */
function canonicalizeHref(href) {
  return href
    .replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (match, body) => {
      if (body[0] === '#') {
        const isHex = body[1] === 'x' || body[1] === 'X';
        const code = parseInt(
          isHex ? body.slice(2) : body.slice(1),
          isHex ? 16 : 10
        );
        if (!Number.isInteger(code) || code < 0 || code > 0x10ffff) {
          // Browsers replace out-of-range numeric references with U+FFFD.
          return '\uFFFD';
        }
        return String.fromCodePoint(code);
      }
      const named = NAMED_ENTITIES[body.toLowerCase()];
      return named === undefined ? match : named;
    })
    .replace(/[\t\n\r\f\v]/g, '')
    .split('\u0000')
    .join('');
}

// Safe href schemes, tested on the canonicalized URL. Backslash is excluded:
// browsers treat `\` as `/` in special URLs, so `\\evil.com` would be a
// protocol-relative URL to an external site. Relative URLs and in-page
// anchors are also allowed.
const SAFE_HREF = /^(?:https?:|mailto:|[^:/?#\\]*(?:[/?#]|$)|#)/i;

// Isolated renderer and options: passed per parse call so the global `marked`
// singleton (used by pages/terms.js etc.) is never mutated.
const renderer = new Renderer();

renderer.html = html => escapeHtml(html);

renderer.image = () => '';

renderer.checkbox = () => '';

renderer.link = (href, title, text) => {
  // marked v4 passes tokens as an object here in some code paths
  // (walker/walkTokens); normalize both shapes defensively.
  if (typeof href === 'object' && href !== null) {
    ({ href, title, text } = href);
  }
  const safeHref = typeof href === 'string' ? href : '';
  // A U+FFFD in the canonical form means malformed numeric references:
  // reject outright instead of guessing what the browser will resolve.
  const canonical = canonicalizeHref(safeHref);
  if (canonical.includes('\uFFFD') || !SAFE_HREF.test(canonical)) {
    return text;
  }
  const titleAttr = title ? ` title="${escapeHtml(title)}"` : '';
  return `<a href="${escapeHtml(
    safeHref
  )}"${titleAttr} target="_blank" rel="noopener noreferrer ugc nofollow">${text}</a>`;
};

const PARSE_OPTIONS = {
  renderer,
  breaks: true,
  gfm: true,
  // User-provided headings do not need document-global IDs. Omitting them also
  // avoids exposing attacker-controlled named properties on window/document.
  headerIds: false,
};

/**
 * Render untrusted Markdown into HTML that is safe to inject into the page.
 */
export function renderSafeMarkdown(source) {
  if (!source) return '';
  return marked.parse(source, PARSE_OPTIONS);
}
