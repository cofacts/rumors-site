import MockDate from "mockdate";
import { formatDate } from "../TimeInfo";

it("formatDate formats date", () => {
  MockDate.set("2020-01-01");
  const now = new Date();

  expect(formatDate(now)).toMatchInlineSnapshot(`"now"`);

  // 5 sec ago
  expect(formatDate(new Date(now - 5000))).toMatchInlineSnapshot(
    `"5 sec. ago"`
  );

  // 1.5 min ago (rounds up)
  expect(formatDate(new Date(now - 90000))).toMatchInlineSnapshot(
    `"2 min. ago"`
  );

  // 1.5 hours ago (rounds up)
  expect(
    formatDate(new Date(now - 1.5 * 60 * 60 * 1000))
  ).toMatchInlineSnapshot(`"2 hr. ago"`);

  // 1 day ago
  expect(formatDate(new Date("2019-12-31"))).toMatchInlineSnapshot(
    `"yesterday"`
  );

  // 1.5 days ago (rounds up)
  expect(
    formatDate(new Date(now - 1.5 * 24 * 60 * 60 * 1000))
  ).toMatchInlineSnapshot(`"2 days ago"`);

  // 2 days ago, uses absolute time
  expect(formatDate(new Date("2019-12-30"))).toMatchInlineSnapshot(
    `"Dec 30, 2019"`
  );

  // Many months ago
  expect(formatDate(new Date("2019-06-30"))).toMatchInlineSnapshot(
    `"Jun 30, 2019"`
  );

  MockDate.reset();
});
