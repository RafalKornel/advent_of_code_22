import { readTextFile } from "../read_text_file.js";

// INPUT    | ROCK     | PAPER     | SCISSORS

// WIN      | SCISSORS | ROCK      | PAPER
// DRAW     | ROCK     | PAPER     | SCISSORS
// LOSE     | PAPER    | SCISSORS  | ROCK

const ROCK = 1;
const PAPER = 2;
const SCISSORS = 3;

const OPPONENT_INPUT_MAP = {
  A: ROCK,
  B: PAPER,
  C: SCISSORS,
};

const PLAYER_INPUT_MAP = {
  X: ROCK,
  Y: PAPER,
  Z: SCISSORS,
};

const WIN = "win";
const DRAW = "draw";
const LOSE = "lose";

const RESULT_SCORE_MAP = {
  [WIN]: 6,
  [DRAW]: 3,
  [LOSE]: 0,
};

const LOSING_COMBINATIONS = {
  [ROCK]: SCISSORS,
  [PAPER]: ROCK,
  [SCISSORS]: PAPER,
};

const WINING_COMBINATIONS = {
  [ROCK]: PAPER,
  [PAPER]: SCISSORS,
  [SCISSORS]: ROCK,
};

/**
 * Description
 * @param {ROCK | PAPER | SCISSORS} player
 * @param {ROCK | PAPER | SCISSORS} opponent
 * @returns {WIN | DRAW | LOSE} If the player won
 */
function battle(player, opponent) {
  if (player === opponent) return DRAW;

  if (WINING_COMBINATIONS[opponent] === player) {
    return WIN;
  } else {
    return LOSE;
  }
}

/**
 * Description
 * @param {string[]} lines
 * @returns {Promise<number>} score
 */
async function first(lines) {
  let result = 0;

  for (const line of lines) {
    const [opponentInput, playerInput] = line.split(" ");

    const player = PLAYER_INPUT_MAP[playerInput];
    const opponent = OPPONENT_INPUT_MAP[opponentInput];

    if (!player || !opponent) throw new Error("Wrong input!");

    const battleResult = battle(player, opponent);

    const battleScore = RESULT_SCORE_MAP[battleResult];

    const shapeScore = player;

    const totalScore = battleScore + shapeScore;

    // console.log(totalScore);

    result += totalScore;
  }

  return result;
}

const EXPECTED_OUTCOME_MAP = {
  X: LOSE,
  Y: DRAW,
  Z: WIN,
};

/**
 * Description
 * @param {string[]} lines
 * @returns {Promise<number>} score
 */
async function second(lines) {
  let result = 0;

  const getCombinationFor = (outcome, opponent) => {
    if (outcome === DRAW) return opponent;

    if (outcome === WIN) return WINING_COMBINATIONS[opponent];

    if (outcome === LOSE) return LOSING_COMBINATIONS[opponent];
  };

  for (const line of lines) {
    const [opponentInput, outcomeInput] = line.split(" ");

    const opponent = OPPONENT_INPUT_MAP[opponentInput];
    const outcome = EXPECTED_OUTCOME_MAP[outcomeInput];

    const desiredMove = getCombinationFor(outcome, opponent);

    result += RESULT_SCORE_MAP[outcome] + desiredMove;
  }

  return result;
}

const lines = await readTextFile("./input.txt");

const r = await second(lines);

console.log(r);
