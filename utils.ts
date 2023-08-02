export function readTextFile(path: string): string[] {
  const data = Deno.readFileSync(path);
  const decoder = new TextDecoder();

  const textContents = decoder.decode(data);

  const lines = textContents.split("\n");

  return lines;
}

export function isCapital(str: string): boolean {
  return str === str.toUpperCase();
}

const LOWER_BASE = "a".charCodeAt(0);
const UPPER_BASE = "A".charCodeAt(0);

export function getCharCode(char: string): number {
  const absoluteCode = char.charCodeAt(0);

  const base = isCapital(char) ? UPPER_BASE : LOWER_BASE;

  const code = absoluteCode - base;

  return code;
}
