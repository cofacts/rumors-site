import { LIST_STYLES, addListStyle } from '../editor';

describe('editor', () => {
  describe('List style module: addListStyle', () => {
    it('returns same value when no list style provided', () => {
      const element = { value: 'test', selectionStart: 0, selectionEnd: 0 };
      addListStyle(element, null);
      expect(element.value).toBe('test');
      expect(element.selectionStart).toBe(0);
      expect(element.selectionEnd).toBe(0);
    });

    describe('when bulleted list style selected', () => {
      it('returns the correct value & position with cursor at the end', () => {
        const element = { value: 'test\n', selectionStart: 5, selectionEnd: 5 };
        const result = addListStyle(element, LIST_STYLES.BULLETED);
        const asserted = 'test\n- ';
        expect(result.value).toBe(asserted);
        expect(result.selectionStart).toBe(asserted.length);
      });
      it('returns the correct value & position with cursor at the middle', () => {
        const element = {
          value: 'test\ntest',
          selectionStart: 5,
          selectionEnd: 5,
        };
        const result = addListStyle(element, LIST_STYLES.BULLETED);
        const asserted = 'test\n- test';
        expect(result.value).toBe(asserted);
        expect(result.selectionStart).toBe(5 + 2);
      });
    });

    describe('when numbered list style selected', () => {
      it('returns the correct value & position with cursor at the end', () => {
        const element = { value: 'test\n', selectionStart: 5, selectionEnd: 5 };
        const result = addListStyle(element, LIST_STYLES.NUMBERED);
        const asserted = 'test\n1. ';
        expect(result.value).toBe(asserted);
        expect(result.selectionStart).toBe(asserted.length);
      });
      it('succeed the number in previous line with cursor at the end', () => {
        const element = {
          value: 'test\n1. \n',
          selectionStart: 9,
          selectionEnd: 9,
        };
        const result = addListStyle(element, LIST_STYLES.NUMBERED);
        const asserted = 'test\n1. \n2. ';
        expect(result.value).toBe(asserted);
        expect(result.selectionStart).toBe(asserted.length);
      });
      it('returns the correct value & position with cursor at the middle', () => {
        const element = {
          value: 'test\n\ntest',
          selectionStart: 5,
          selectionEnd: 5,
        };
        const result = addListStyle(element, LIST_STYLES.NUMBERED);
        const asserted = 'test\n1. \ntest';
        expect(result.value).toBe(asserted);
        expect(result.selectionStart).toBe(5 + 3);
      });
      it('succeed the number in previous line with cursor at the middle', () => {
        const element = {
          value: 'test\n23. \n\ntest',
          selectionStart: 10,
          selectionEnd: 10,
        };
        const result = addListStyle(element, LIST_STYLES.NUMBERED);
        const asserted = 'test\n23. \n24. \ntest';
        expect(result.value).toBe(asserted);
        expect(result.selectionStart).toBe(10 + 4);
      });
    });
  });
});
