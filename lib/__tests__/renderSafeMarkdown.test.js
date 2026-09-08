import { marked } from 'marked';
import { renderSafeMarkdown } from '../renderSafeMarkdown';

describe('renderSafeMarkdown', () => {
  it('renders headings, bold, lists, and links', () => {
    const html = renderSafeMarkdown(
      '## 標題\n\n這是 **重點**，也是 *斜體*。\n\n- a\n- b'
    );

    expect(html).toMatch(/<h2[^>]*>標題<\/h2>/);
    expect(html).toContain('<strong>重點</strong>');
    expect(html).toContain('<em>斜體</em>');
    expect(html).toContain('<li>a</li>');
  });

  it('renders links with safe new-tab attributes', () => {
    const html = renderSafeMarkdown('[範例](https://example.com/page?a=1)');

    expect(html).toContain('href="https://example.com/page?a=1"');
    expect(html).toMatch(/<a [^>]*target="_blank"/);
    expect(html).toMatch(/<a [^>]*rel="noopener noreferrer ugc nofollow"/);
  });

  it('escapes raw HTML including script and event handlers', () => {
    const source = [
      '<script>alert("xss")</script>',
      '<div onclick="alert(1)">內容</div>',
      '<iframe src="https://evil.example/frame"></iframe>',
    ].join('\n\n');
    const html = renderSafeMarkdown(source);

    expect(html).not.toContain('<script>');
    expect(html).not.toContain('<div');
    expect(html).not.toContain('<iframe');
    expect(html).toContain('&lt;script&gt;');
    expect(html).toContain('&lt;div onclick=');
    expect(html).toContain('&lt;iframe src=');
  });

  it('escapes double quotes in link hrefs to prevent attribute injection', () => {
    const html = renderSafeMarkdown('[x](https://a"onmouseover="alert(1))');

    expect(html).not.toContain('"onmouseover="');
    expect(html).not.toMatch(/href="[^"]*"[a-z]/i);
    expect(html).toContain('&quot;');
  });

  it('escapes double quotes in link titles to prevent attribute injection', () => {
    const html = renderSafeMarkdown('["t"](https://a "ti"tle")');

    expect(html).not.toContain('title="ti"tle"');
    expect(html).toContain('&quot;');
  });

  it('escapes raw HTML image elements', () => {
    const html = renderSafeMarkdown(
      '<img src="https://evil.example/img.png" onerror="alert(1)">'
    );

    expect(html).not.toMatch(/<img\b/i);
    expect(html).toContain('&lt;img src=');
  });

  it('removes markdown images', () => {
    const html = renderSafeMarkdown(
      '![inline](https://evil.example/inline.png "title") ![data](data:image/svg+xml;base64,PHN2Zz48L3N2Zz4=)'
    );

    expect(html).not.toMatch(/<img\b/i);
    expect(html).not.toContain('inline.png');
  });

  it('does not emit unsafe protocols as href', () => {
    const html = renderSafeMarkdown(
      '[JavaScript](javascript:alert(1)) [資料](data:text/html;base64,PHNjcmlwdD4=)'
    );

    expect(html).not.toContain('href="javascript:');
    expect(html).not.toContain('href="data:');
    expect(html).not.toMatch(/<a\b[^>]*javascript:/i);
  });

  it('does not emit anchors for entity- or whitespace-obfuscated javascript URLs', () => {
    const sources = [
      '[x](javascript&colon;alert(1))',
      '[x](javascript&#58;alert(1))',
      '[x](javascript&#x3A;alert(1))',
      '[x](java\tscript:alert(1))',
      '[x](\\\\\\\\evil.com)',
    ];

    for (const source of sources) {
      const html = renderSafeMarkdown(source);
      expect(html).not.toMatch(/<a\b/i);
      expect(html).toContain('x');
    }
  });

  it('replaces out-of-range numeric entities instead of throwing', () => {
    const sources = ['[x](&#1114112;)', '[x](&#x110000;)'];

    for (const source of sources) {
      expect(() => renderSafeMarkdown(source)).not.toThrow();
      const html = renderSafeMarkdown(source);
      expect(html).not.toMatch(/<a\b/i);
      expect(html).toContain('x');
    }
  });

  it('keeps benign links with ampersands in query strings', () => {
    const html = renderSafeMarkdown('[q](https://a/?x=1&y=2)');

    expect(html).toMatch(/<a [^>]*href="https:\/\/a\/\?x=1&(?:amp;)?y=2"/);
    expect(html).toMatch(/<a [^>]*rel="[^"]*ugc nofollow"/);
  });

  it('does not create attacker-controlled heading IDs', () => {
    const html = renderSafeMarkdown('# location');

    expect(html).toBe('<h1>location</h1>\n');
  });

  it('does not emit checkbox inputs for task lists', () => {
    const html = renderSafeMarkdown('- [ ] todo');

    expect(html).not.toMatch(/<input\b/i);
    expect(html).toContain('<li>');
  });

  it('returns empty string for empty or null input', () => {
    expect(renderSafeMarkdown('')).toBe('');
    expect(renderSafeMarkdown(null)).toBe('');
    expect(renderSafeMarkdown(undefined)).toBe('');
  });

  it('does not pollute the global marked parser', () => {
    expect(marked.parse('<b>raw</b>')).toContain('<b>raw</b>');
    expect(marked.parse('![i](https://e/i.png)')).toContain('<img');
  });
});
