import { readTextFile } from "../utils.ts";

// INPUT    | ROCK     | PAPER     | SCISSORS

// WIN      | SCISSORS | ROCK      | PAPER
// DRAW     | ROCK     | PAPER     | SCISSORS
// LOSE     | PAPER    | SCISSORS  | ROCK

enum Shape {
  Rock = 1,
  Paper = 2,
  Scissors = 3,
}

type LeftInput = "A" | "B" | "C";

const OPPONENT_INPUT_MAP: Record<LeftInput, Shape> = {
  A: Shape.Rock,
  B: Shape.Paper,
  C: Shape.Scissors,
};

type RightInput = "X" | "Y" | "Z";

const PLAYER_INPUT_MAP: Record<RightInput, Shape> = {
  X: Shape.Rock,
  Y: Shape.Paper,
  Z: Shape.Scissors,
};

enum Result {
  Win = "win",
  Draw = "draw",
  Lose = "lose",
}

const RESULT_SCORE_MAP: Record<Result, number> = {
  [Result.Win]: 6,
  [Result.Draw]: 3,
  [Result.Lose]: 0,
};

const LOSING_COMBINATIONS: Record<Shape, Shape> = {
  [Shape.Rock]: Shape.Scissors,
  [Shape.Paper]: Shape.Rock,
  [Shape.Scissors]: Shape.Paper,
};

const WINING_COMBINATIONS: Record<Shape, Shape> = {
  [Shape.Rock]: Shape.Paper,
  [Shape.Paper]: Shape.Scissors,
  [Shape.Scissors]: Shape.Rock,
};

function battle(player: Shape, opponent: Shape): Result {
  if (player === opponent) return Result.Draw;

  if (WINING_COMBINATIONS[opponent] === player) {
    return Result.Win;
  } else {
    return Result.Lose;
  }
}

function first(lines: string[]): number {
  let result = 0;

  for (const line of lines) {
    const [opponentInput, playerInput] = line.split(" ") as [
      LeftInput,
      RightInput
    ];

    const player = PLAYER_INPUT_MAP[playerInput];
    const opponent = OPPONENT_INPUT_MAP[opponentInput];

    if (!player || !opponent) throw new Error("Wrong input!");

    const battleResult = battle(player, opponent);

    const battleScore = RESULT_SCORE_MAP[battleResult];

    const shapeScore = player;

    const totalScore = battleScore + shapeScore;

    result += totalScore;
  }

  return result;
}

const EXPECTED_OUTCOME_MAP: Record<RightInput, Result> = {
  X: Result.Lose,
  Y: Result.Draw,
  Z: Result.Win,
};

function second(lines: string[]): number {
  let result = 0;

  const getCombinationFor = (outcome: Result, opponent: Shape): Shape => {
    switch (outcome) {
      case Result.Win:
        return WINING_COMBINATIONS[opponent];

      case Result.Lose:
        return LOSING_COMBINATIONS[opponent];

      case Result.Draw:
      default:
        return opponent;
    }
  };

  for (const line of lines) {
    const [opponentInput, outcomeInput] = line.split(" ") as [
      LeftInput,
      RightInput
    ];

    const opponent = OPPONENT_INPUT_MAP[opponentInput];
    const outcome = EXPECTED_OUTCOME_MAP[outcomeInput];

    const desiredMove = getCombinationFor(outcome, opponent);

    result += RESULT_SCORE_MAP[outcome] + desiredMove;
  }

  return result;
}

const lines = readTextFile("./test_data.txt");

const r = second(lines);

console.log(r);
