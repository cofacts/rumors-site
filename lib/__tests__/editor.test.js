import { LIST_STYLES, addListStyle } from '../editor';

describe('editor', () => {
  describe('List style module: addListStyle', () => {
    let element;
    beforeEach(() => {
      const value = Math.random()
        .toString(36)
        .substring(100, 200);
      const pos = ~~(Math.random() * 100);
      element = { value, selectionStart: pos, selectionEnd: pos };
    });

    it('returns same value when no list style provided', () => {
      const snapshot = { ...element };
      addListStyle(element, null);
      Object.keys(element).map(key => {
        expect(element[key]).toBe(snapshot[key]);
      });
    });

    describe('when bulleted list style selected', () => {
      it('returns the correct value & position with cursor at the end', () => {
        let start = element.value.length;
        element.selectionStart = element.selectionEnd = start;
        const result = addListStyle(element, LIST_STYLES.BULLETED);
        const asserted = element.value + '- ';
        expect(result.value).toBe(asserted);
        expect(result.selectionStart).toBe(asserted.length);
      });
      it('returns the correct value & position with cursor at the middle', () => {
        const result = addListStyle(element, LIST_STYLES.BULLETED);
        const { value, selectionStart: index } = element;
        const asserted = value.slice(0, index) + '- ' + value.slice(index);
        expect(result.value).toBe(asserted);
        expect(result.selectionStart).toBe(index + 2);
      });
    });

    describe('when numbered list style selected', () => {
      it('returns the correct value & position with cursor at the end', () => {
        element.value = 'test\n';
        let start = element.value.length;
        element.selectionStart = element.selectionEnd = start;
        const result = addListStyle(element, LIST_STYLES.NUMBERED);
        const asserted = element.value + '1. ';
        expect(result.value).toBe(asserted);
        expect(result.selectionStart).toBe(asserted.length);
      });
      it('succeed the number in previous line with cursor at the end', () => {
        element.value = 'test\n1. \n';
        let start = element.value.length;
        element.selectionStart = element.selectionEnd = start;
        const result = addListStyle(element, LIST_STYLES.NUMBERED);
        const asserted = element.value + '2. ';
        expect(result.value).toBe(asserted);
        expect(result.selectionStart).toBe(asserted.length);
      });
      it('returns the correct value & position with cursor at the middle', () => {
        element.value = 'test\n\ntest';
        element.selectionStart = element.selectionEnd = 5;
        const result = addListStyle(element, LIST_STYLES.NUMBERED);
        const asserted = 'test\n1. \ntest';
        expect(result.value).toBe(asserted);
        expect(result.selectionStart).toBe(5 + 3);
      });
      it('succeed the number in previous line with cursor at the middle', () => {
        element.value = 'test\n23. \n\ntest';
        element.selectionStart = element.selectionEnd = 10;
        const result = addListStyle(element, LIST_STYLES.NUMBERED);
        const asserted = 'test\n23. \n24. \ntest';
        expect(result.value).toBe(asserted);
        expect(result.selectionStart).toBe(10 + 4);
      });
    });
  });
});
