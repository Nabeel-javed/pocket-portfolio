import test from "node:test";
import assert from "node:assert/strict";
import { createSecretCode } from "../src/easter-egg.js";

test("only a complete name sequence unlocks, with no partial or wrong-code matches", () => {
  const code = createSecretCode();
  for (const digit of "623335") assert.equal(code.feed(digit), false);
  for (const digit of "62233") assert.equal(code.feed(digit), false);
  assert.equal(code.feed("5"), true);
  assert.equal(code.feed("5"), false);
});

test("long pauses, resets, and control keys cancel an incomplete code", () => {
  let time = 0;
  const code = createSecretCode(() => time);
  for (const digit of "622") code.feed(digit);
  time = 8001;
  for (const digit of "335") assert.equal(code.feed(digit), false);
  for (const digit of "622") code.feed(digit);
  code.reset();
  for (const digit of "335") assert.equal(code.feed(digit), false);
  for (const digit of "622") code.feed(digit);
  code.feed("*");
  for (const digit of "335") assert.equal(code.feed(digit), false);
});
