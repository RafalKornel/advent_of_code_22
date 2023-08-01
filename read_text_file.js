/**
 * Description
 * @param {string} path
 * @returns {Promise<string[]>} array of lines
 */
export async function readTextFile(path) {
  const data = await Deno.readFile(path);
  const decoder = new TextDecoder();

  const textContents = decoder.decode(data);

  const lines = textContents.split("\n");

  return lines;
}
