import React from 'react';

export function shortenUrl(s, maxLength) {
  try {
    s = decodeURIComponent(s);
  } catch (e) {
    // Probably malformed URI components.
    // Do nothing, just use original s
  }
  return s.length <= maxLength
    ? s
    : `${s.slice(0, maxLength / 2)}⋯${s.slice(-maxLength / 2)}`;
}

const urlRegExp = /(https?:\/\/\S+)/;
export function linkify(str, maxLength = 80) {
  if (!str) return '';
  return str
    .split(urlRegExp)
    .map(
      (s, i) =>
        s.match(urlRegExp)
          ? <a key={`link${i}`} href={s}>{shortenUrl(s, maxLength)}</a>
          : s
    );
}

export function nl2br(text = '') {
  const sentences = text.split('\n');
  if (sentences.length <= 1) return sentences.map(s => linkify(s));
  return sentences.map((sentence, i) =>
    <div style={{ minHeight: '1.6em' }} key={i}>{linkify(sentence)}</div>
  );
}
