import { assertEquals } from "https://deno.land/std@0.196.0/assert/assert_equals.ts";
import { readTextFile } from "../utils.ts";
import { first, second } from "./index.ts";
import { TreeBuilder } from "./TreeBuilder.ts";

const test_data = readTextFile("./test_data.txt");

Deno.test("Test data - first", () => {
  const ANSWER = 95437;

  const tb = new TreeBuilder(test_data);

  const root = tb.build();

  assertEquals(first(root), ANSWER);
});

Deno.test("Test data - second", () => {
  const ANSWER = 24933642;

  const tb = new TreeBuilder(test_data);

  const root = tb.build();

  assertEquals(second(root), ANSWER);
});

const input = readTextFile("./input.txt");

Deno.test("Actual data - first", () => {
  const ANSWER = 1642503;

  const tb = new TreeBuilder(input);

  const root = tb.build();

  assertEquals(first(root), ANSWER);
});

Deno.test("Actual data - second", () => {
  const ANSWER = 6999588;

  const tb = new TreeBuilder(input);

  const root = tb.build();

  assertEquals(second(root), ANSWER);
});
