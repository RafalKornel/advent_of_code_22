export function readTextFile(path: string): string[] {
  const data = Deno.readFileSync(path);
  const decoder = new TextDecoder();

  const textContents = decoder.decode(data);

  const lines = textContents.split("\n");

  return lines;
}
