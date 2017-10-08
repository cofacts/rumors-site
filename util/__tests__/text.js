import React from 'react';
import { linkify, nl2br, truncate } from '../text';

describe('text', () => {
  describe('linkify', () => {
    it('does nothing on strings, arrays and elements without links', () => {
      expect(linkify('foo')).toBe('foo');

      const singleLevelElem = <p>foo</p>;
      expect(linkify(singleLevelElem)).toBe(singleLevelElem);

      const nestedElem = <p>foo <span> bar </span> foo2</p>;
      expect(linkify(nestedElem)).toBe(nestedElem);

      const array = ['foo', 'bar', <span key="elem">lala</span>];
      expect(linkify(array)).toEqual(array);
    });

    it('attach link on strings containing links', () => {
      expect(linkify('Please go to http://google.com')).toMatchSnapshot();
    });

    it('attach link on simple elements containing links', () => {
      expect(
        linkify(<span>Please go to http://google.com</span>)
      ).toMatchSnapshot();
    });

    it('attach link on nested elements containing links', () => {
      expect(
        linkify(
          <span>
            Please go to <span>http://google.com</span> lalala
          </span>
        )
      ).toMatchSnapshot();
    });

    it('attach link on arrays containing elements that has link', () => {
      expect(
        linkify([
          'Please go to http://google.com',
          <span key="elem">Please go to http://google.com</span>,
        ])
      ).toMatchSnapshot();
    });

    it('decodes URI encoded URLs', () => {
      expect(
        linkify(
          'Please go to http://www.rumtoast.com/5444/line%E7%BE%A4%E7%B5%84%E8%A1%8C%E5%8B%95%E6%A2%9D%E7%A2%BC%E9%82%80%E8%AB%8B-%E4%B8%80%E5%AE%9A%E8%A6%81%E9%97%9C%E6%8E%89%EF%BC%8C%E4%B8%8D%E7%84%B6%E9%A7%AD%E5%AE%A2%E6%9C%83%E5%85%A5%E4%BE%B5'
        )
      ).toMatchSnapshot();
    });

    it('decodes URLS that is too long', () => {
      expect(
        linkify(
          'Please go to http://www.rumtoast.com/5444/line%E7%BE%A4%E7%B5%84%E8%A1%8C%E5%8B%95%E6%A2%9D%E7%A2%BC%E9%82%80%E8%AB%8B-%E4%B8%80%E5%AE%9A%E8%A6%81%E9%97%9C%E6%8E%89%EF%BC%8C%E4%B8%8D%E7%84%B6%E9%A7%AD%E5%AE%A2%E6%9C%83%E5%85%A5%E4%BE%B5',
          { maxLength: 10 }
        )
      ).toMatchSnapshot();
    });

    it('sets prop to link', () => {
      expect(
        linkify('Please go to http://google.com', {
          props: { target: '_blank' },
        })
      ).toMatchSnapshot();
    });
  });

  describe('nl2br', () => {
    it('does nothing on strings, arrays and elements without line breaks', () => {
      expect(nl2br('foo')).toBe('foo');

      const singleLevelElem = <p>foo</p>;
      expect(nl2br(singleLevelElem)).toBe(singleLevelElem);

      const nestedElem = <p>foo <span> bar </span> foo2</p>;
      expect(nl2br(nestedElem)).toBe(nestedElem);

      const array = ['foo', 'bar', <span key="elem">lala</span>];
      expect(nl2br(array)).toEqual(array);
    });

    it('inserts <br> on line breaks in strings, with ending <br>s trimmed', () => {
      expect(nl2br('Foo\nBar')).toMatchSnapshot();

      expect(
        nl2br(`This should be first line with empty next line

          This should be second line with no <br> afterwards`)
      ).toMatchSnapshot();
    });

    it('inserts <br> on line breaks within elements', () => {
      expect(
        nl2br(
          <p>
            {`This should be first line

              This should be second line with no <br> afterwards`}
          </p>
        )
      ).toMatchSnapshot();
    });

    it('preserves line ends on the end of tag', () => {
      expect(
        nl2br([
          <a href="" key="link">
            http://www.appledaily.com.tw/realtimenews/article/new/20170817/1184132/
          </a>,
          '\n15少年集體性侵驢子　全染上狂犬病',
        ])
      ).toMatchSnapshot();
    });
  });

  describe('truncate', () => {
    it('does nothing if wordCount is infinity', () => {
      expect(truncate('12345')).toBe('12345');

      const singleLevelElem = <p>This is not truncated</p>;
      expect(singleLevelElem).toBe(singleLevelElem);
    });

    it('truncates strings', () => {
      const moreElem = <button key="btn">...more</button>;

      expect(truncate('12345', { moreElem, wordCount: 3 })).toEqual([
        '123',
        moreElem,
      ]);
    });

    it('truncates nested DOM', () => {
      const moreElem = <button key="btn">...more</button>;
      const inputElem = (
        <div>
          12
          <p>
            34
            <a href="">56</a>
            78
            <a href="">90</a>
            12
          </p>
          34
        </div>
      );

      expect(truncate(inputElem, { moreElem, wordCount: 3 })).toMatchSnapshot();
      expect(truncate(inputElem, { moreElem, wordCount: 5 })).toMatchSnapshot();
      expect(truncate(inputElem, { moreElem, wordCount: 7 })).toMatchSnapshot();
      expect(truncate(inputElem, { moreElem, wordCount: 9 })).toMatchSnapshot();
    });
  });
});
