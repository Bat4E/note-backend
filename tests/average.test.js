const { test, describe } = require("node:test");
const assert = require("node:assert");

const { average } = require("../utils/for_testing");

// describe blocks can be used for grouping test into logical collections.
// the test output also uses the name of the describe block
describe("average", () => {
  test("of one value is the value itself", () => {
    assert.strictEqual(average([1]), 1);
  });

  test("of many is calculated right", () => {
    assert.strictEqual(average([1, 2, 3, 4, 5, 6]), 3.5);
  });

  test("of empty array is zero", () => {
    assert.strictEqual(average([]), 0);
  });
});
