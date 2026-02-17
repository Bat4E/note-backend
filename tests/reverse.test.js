// in order to use test just run the command: npm test
// test files will be name using this: .test.js
// the testing library node:test executes files automatically with those file extension

const { test } = require("node:test"); // defines keyword test
const assert = require("node:assert"); // assert library

const reverse = require("../utils/for_testing").reverse; // importing function to be tested

/*
@params:
1st argument is a string description of the test as a string
2nd argument is a function that defines the functionality of the test
*/
test("reverse of a", () => {
  const result = reverse("a");

  assert.strictEqual(result, "a");
});

test("reverse of react", () => {
  const result = reverse("react");

  assert.strictEqual(result, "tcaer");
});

test("reverse of saippuakauppias", () => {
  const result = reverse("saippuakauppias");

  assert.strictEqual(result, "saippuakauppias");
});
