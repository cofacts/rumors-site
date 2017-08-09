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

const newLineRegExp = /(\r\n|\r|\n)/g;
export function nl2br(text = '') {
  return text
    .split(newLineRegExp)
    .map(
      (line, idx) =>
        line.match(newLineRegExp) ? <br key={`br${idx}`} /> : linkify(line)
    );
}
