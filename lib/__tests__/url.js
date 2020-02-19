import Router from "next/router";
import querystring from "querystring";
import { goToUrlQueryAndResetPagination, getArrayFromQueryParam } from "../url";

jest.mock("next/router");

it("goToUrlQueryAndResetPagination converts object to query string", () => {
  // Setup
  Router.push.mockClear();
  goToUrlQueryAndResetPagination({});
  goToUrlQueryAndResetPagination({
    foo: "string",
    bar: [1, 2, 3],
    before: "cursor1",
    after: "cursor2"
  });

  expect(Router.push.mock.calls[0][0]).toMatchInlineSnapshot(`"/"`);
  expect(Router.push.mock.calls[1][0]).toMatchInlineSnapshot(
    `"/?foo=string&bar=1&bar=2&bar=3"`
  );

  // Teardown
  Router.push.mockClear();
});

it("getArrayFromQueryParam ensures querystring arrays are arrays", () => {
  expect(getArrayFromQueryParam(querystring.parse("ids=1").ids)).toEqual(["1"]);
  expect(getArrayFromQueryParam(querystring.parse("ids=1&ids=2").ids)).toEqual([
    "1",
    "2"
  ]);
});
