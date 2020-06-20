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
      const lastLine = lines[lines.length - 2];
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
