import { assertEquals } from "https://deno.land/std@0.196.0/assert/assert_equals.ts";
import { first, second } from "./index.ts";
import { readTextFile } from "../utils.ts";

const testData = readTextFile("./test_data.txt");

Deno.test("Test data - first", () => {
  const answers = [7, 5, 6, 10, 11];

  testData.forEach((record, i) => {
    assertEquals(first(record), answers[i]);
  });
});

Deno.test("Test data - second", () => {
  const answers = [19, 23, 23, 29, 26];

  testData.forEach((record, i) => {
    assertEquals(second(record), answers[i]);
  });
});

const [input] = readTextFile("./input.txt");

Deno.test("Actual data - first", () => {
  const ANSWER = 1175;

  assertEquals(first(input), ANSWER);
});

Deno.test("Actual data - second", () => {
  const ANSWER = 3217;
  assertEquals(second(input), ANSWER);
});
