import MockDate from 'mockdate';
import { formatDate } from '../TimeInfo';

it('formatDate formats date', () => {
  MockDate.set('2020-01-01T12:00:00Z');
  const now = new Date();

  expect(formatDate(now)).toMatchInlineSnapshot(`"now"`);

  // 5 sec ago
  expect(formatDate(new Date(now - 5000))).toMatchInlineSnapshot(`"5s ago"`);

  // 1.5 min ago (rounds up)
  expect(formatDate(new Date(now - 90000))).toMatchInlineSnapshot(`"2m ago"`);

  // 1.5 hours ago (rounds up)
  expect(
    formatDate(new Date(now - 1.5 * 60 * 60 * 1000))
  ).toMatchInlineSnapshot(`"2h ago"`);

  // 0.5 days and 1 seconds ago
  expect(formatDate(new Date('2019-12-31T23:59:59Z'))).toMatchInlineSnapshot(
    `"12h ago"`
  );

  // 1 day ago
  expect(formatDate(new Date('2019-12-31T12:00:00Z'))).toMatchInlineSnapshot(
    `"yesterday"`
  );

  // 1.5 days ago, still in "yesterday"
  expect(formatDate(new Date('2019-12-31T00:00:00Z'))).toMatchInlineSnapshot(
    `"yesterday"`
  );

  // 1.5 days and 1 second ago, but it's the day before yesterday
  expect(formatDate(new Date('2019-12-30T23:59:59Z'))).toMatchInlineSnapshot(
    `"2d ago"`
  );

  // exactly 2 days ago
  expect(formatDate(new Date('2019-12-30T12:00:00Z'))).toMatchInlineSnapshot(
    `"Dec 30, 2019"`
  );

  // Many months ago
  expect(formatDate(new Date('2019-06-30'))).toMatchInlineSnapshot(
    `"Jun 30, 2019"`
  );

  MockDate.reset();
});
