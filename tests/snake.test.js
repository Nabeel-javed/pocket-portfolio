import test from "node:test";
import assert from "node:assert/strict";
import { initialGame, turnGame, stepGame } from "../src/snake.js";

test("ready and paused games do not advance", () => {
  const game = initialGame();
  const before = JSON.stringify(game.snake);
  stepGame(game);
  assert.equal(JSON.stringify(game.snake), before);
  game.state = "paused";
  stepGame(game);
  assert.equal(JSON.stringify(game.snake), before);
});
test("opposite direction is rejected, including rapid double turns", () => {
  const game = initialGame();
  game.state = "running";
  turnGame(game, "left");
  assert.equal(game.pending, "right");
  turnGame(game, "up");
  turnGame(game, "left");
  assert.equal(game.pending, "up");
  stepGame(game);
  assert.deepEqual(game.snake[0], { x: 7, y: 5 });
});
test("eating grows the snake and places food in an empty cell", () => {
  const game = initialGame();
  game.state = "running";
  game.food = { x: 8, y: 6 };
  stepGame(game, () => 0);
  assert.equal(game.score, 1);
  assert.equal(game.snake.length, 4);
  assert.ok(
    !game.snake.some((p) => p.x === game.food.x && p.y === game.food.y),
  );
});
test("wall collision ends the game without inserting an invalid position", () => {
  const game = initialGame();
  game.state = "running";
  game.snake = [
    { x: 17, y: 5 },
    { x: 16, y: 5 },
  ];
  stepGame(game);
  assert.equal(game.state, "over");
  assert.deepEqual(game.snake[0], { x: 17, y: 5 });
});
test("collision with the body ends the game", () => {
  const game = initialGame();
  game.state = "running";
  game.direction = "right";
  game.pending = "down";
  game.snake = [
    { x: 3, y: 3 },
    { x: 2, y: 3 },
    { x: 2, y: 4 },
    { x: 3, y: 4 },
    { x: 4, y: 4 },
  ];
  stepGame(game);
  assert.equal(game.state, "over");
});
test("moving into the vacating tail cell is valid", () => {
  const game = initialGame();
  game.state = "running";
  game.direction = "right";
  game.pending = "down";
  game.snake = [
    { x: 3, y: 3 },
    { x: 2, y: 3 },
    { x: 2, y: 4 },
    { x: 3, y: 4 },
  ];
  stepGame(game);
  assert.equal(game.state, "running");
  assert.deepEqual(game.snake[0], { x: 3, y: 4 });
});
test("filling the board wins without trying to choose unavailable food", () => {
  const game = initialGame();
  game.state = "running";
  game.direction = "right";
  game.pending = "right";
  game.food = { x: 1, y: 0 };
  game.snake = [{ x: 0, y: 0 }];
  for (let y = 0; y < 12; y++)
    for (let x = 0; x < 18; x++)
      if (!(y === 0 && (x === 0 || x === 1))) game.snake.push({ x, y });
  stepGame(game);
  assert.equal(game.state, "won");
  assert.equal(game.snake.length, 216);
});
