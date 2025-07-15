export const LIST_STYLES = {
  BULLETED: 'BULLETED',
  NUMBERED: 'NUMBERED',
};

export function addListStyle(
  { value = '', selectionStart = 0, selectionEnd = 0 },
  style
) {
  switch (style) {
    case LIST_STYLES.BULLETED: {
      const newValue =
        value.slice(0, selectionStart) + '- ' + value.slice(selectionStart);
      const newPos = selectionStart + 2;
      return { value: newValue, selectionStart: newPos, selectionEnd: newPos };
    }
    case LIST_STYLES.NUMBERED: {
      const lines = value.slice(0, selectionStart).split('\n');
      const lastLine = lines[lines.length - 2] || "0.";
      const lastNum = ~~lastLine.match(/^(\d+)\.\s.*/)?.[1];
      const current = lastNum + 1;
      const newValue =
        value.slice(0, selectionStart) +
        `${current}. ` +
        value.slice(selectionStart);
      const newPos = selectionStart + 1 + (current + '0').length;
      return { value: newValue, selectionStart: newPos, selectionEnd: newPos };
    }
    default:
      return { value, selectionStart, selectionEnd };
  }
}

export function replaceListPrefixAtCursorLine(
  { value = '', selectionStart = 0, selectionEnd = 0 }, style
) {
  const lines = value.split('\n');
  let charCount = 0;
  let targetLineIndex = 0;

  // Find the current line
  for (let i = 0; i < lines.length; i++) {
    const lineLength = lines[i].length + 1; // +1 for \n
    if (selectionStart < charCount + lineLength) {
      targetLineIndex = i;
      break;
    }
    charCount += lineLength;
  }

  const line = lines[targetLineIndex];

  // Match and remove existing list prefix
  const match = line.match(/^(\s*)(-|\*|\d+\.)\s+/);
  let oldPrefixLength = 0;
  let newLine = line;

  if (match) {
    oldPrefixLength = match[0].length;
    newLine = line.slice(oldPrefixLength);
  }

  // Add new prefix if provided
  let newPrefix = '';
  switch (style) {
    case LIST_STYLES.BULLETED: {
      newPrefix = "- ";
      break;
    }
    case LIST_STYLES.NUMBERED: {
      const lines = value.slice(0, selectionStart).split('\n');
      const lastLine = lines[lines.length - 2] || "0.";
      const lastNum = ~~lastLine.match(/^(\d+)\.\s.*/)?.[1];
      const current = lastNum + 1;
      newPrefix = `${current}. `;
      break;
    }
    }
  lines[targetLineIndex] = newPrefix + newLine;

  // Calculate adjustment in character length
  const lineStartIndex = charCount;
  const newPrefixLength = newPrefix.length;
  const delta = newPrefixLength - oldPrefixLength;

  const newSelectionStart =
    selectionStart >= lineStartIndex + oldPrefixLength
      ? selectionStart + delta
      : selectionStart;

  const newSelectionEnd =
    selectionEnd >= lineStartIndex + oldPrefixLength
      ? selectionEnd + delta
      : selectionEnd;

  return {
    value: lines.join('\n'),
    selectionStart: newSelectionStart,
    selectionEnd: newSelectionEnd,
  };
  }
