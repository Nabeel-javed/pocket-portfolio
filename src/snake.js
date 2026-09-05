const COLS = 18,
  ROWS = 12;
const VECTORS = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

// Pure game rules, shared by the renderer and the regression checks.
export function initialGame() {
  return {
    snake: [
      { x: 7, y: 6 },
      { x: 6, y: 6 },
      { x: 5, y: 6 },
    ],
    direction: "right",
    pending: "right",
    food: { x: 12, y: 6 },
    score: 0,
    state: "ready",
  };
}
export function turnGame(game, direction) {
  if (!VECTORS[direction]) return;
  const current = VECTORS[game.direction],
    next = VECTORS[direction];
  if (current.x + next.x === 0 && current.y + next.y === 0) return;
  game.pending = direction;
}
export function stepGame(game, random = Math.random) {
  if (game.state !== "running") return;
  game.direction = game.pending;
  const vector = VECTORS[game.direction];
  const head = { x: game.snake[0].x + vector.x, y: game.snake[0].y + vector.y };
  const eating = head.x === game.food.x && head.y === game.food.y;
  const body = eating ? game.snake : game.snake.slice(0, -1);
  if (
    head.x < 0 ||
    head.x >= COLS ||
    head.y < 0 ||
    head.y >= ROWS ||
    body.some((p) => p.x === head.x && p.y === head.y)
  ) {
    game.state = "over";
    return;
  }
  game.snake.unshift(head);
  if (eating) {
    game.score++;
    const free = [];
    for (let y = 0; y < ROWS; y++)
      for (let x = 0; x < COLS; x++)
        if (!game.snake.some((p) => p.x === x && p.y === y))
          free.push({ x, y });
    if (!free.length) {
      game.state = "won";
      return;
    }
    game.food =
      free[Math.min(free.length - 1, Math.floor(random() * free.length))];
  } else game.snake.pop();
}

export function createSnake(canvas, { onUpdate }) {
  const ctx = canvas.getContext("2d");
  let game = initialGame();
  let timer;
  const size = 13;
  function paint() {
    ctx.fillStyle = "#a8bc92";
    ctx.fillRect(0, 0, 234, 156);
    ctx.fillStyle = "#93aa7d";
    for (let y = 0; y < ROWS; y++)
      for (let x = 0; x < COLS; x++)
        ctx.fillRect(x * size + 6, y * size + 6, 1, 1);
    ctx.fillStyle = "#456345";
    ctx.fillRect(game.food.x * size + 3, game.food.y * size + 3, 7, 7);
    ctx.fillStyle = "#354e38";
    game.snake.forEach((segment, index) => {
      ctx.fillRect(segment.x * size + 1, segment.y * size + 1, 11, 11);
      if (index === 0) {
        ctx.fillStyle = "#bbcca6";
        ctx.fillRect(segment.x * size + 8, segment.y * size + 3, 2, 2);
        ctx.fillStyle = "#354e38";
      }
    });
    if (game.state !== "running") {
      ctx.fillStyle = "#a8bc92e8";
      ctx.fillRect(22, 43, 190, 68);
      ctx.strokeStyle = "#658159";
      ctx.strokeRect(22.5, 43.5, 189, 67);
      ctx.fillStyle = "#2d4834";
      ctx.textAlign = "center";
      ctx.font = "bold 20px monospace";
      ctx.fillText(
        {
          ready: "S N A K E",
          paused: "PAUSED",
          over: "GAME OVER",
          won: "YOU WIN!",
        }[game.state],
        117,
        72,
      );
      ctx.font = "8px monospace";
      ctx.fillText(
        game.state === "paused"
          ? "PRESS OK TO RESUME"
          : game.state === "ready"
            ? "PRESS OK TO PLAY"
            : `SCORE ${game.score} — OK TO PLAY AGAIN`,
        117,
        94,
      );
    }
    onUpdate(game.state, game.score);
  }
  function schedule() {
    clearInterval(timer);
    if (game.state === "running")
      timer = setInterval(
        () => {
          stepGame(game);
          if (game.state !== "running") clearInterval(timer);
          paint();
        },
        Math.max(95, 190 - game.score * 4),
      );
  }
  paint();
  return {
    direction(direction) {
      turnGame(game, direction);
    },
    toggle() {
      if (game.state === "running") game.state = "paused";
      else if (game.state === "paused") game.state = "running";
      else {
        game = initialGame();
        game.state = "running";
      }
      schedule();
      paint();
    },
    pause() {
      if (game.state === "running") {
        game.state = "paused";
        clearInterval(timer);
        paint();
      }
    },
    destroy() {
      clearInterval(timer);
    },
  };
}
