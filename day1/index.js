/**
 * Description
 * @param {string} filepath
 * @returns {Promise<number>}
 */
async function run(filepath) {
  const fileData = await Deno.readFile(filepath);

  const textContents = new TextDecoder().decode(fileData);

  let elvesCalories = [];
  let currentElfCalories = 0;

  for (const line of textContents.split("\n")) {
    if (line === "") {
      elvesCalories.push(currentElfCalories);

      currentElfCalories = 0;

      continue;
    }

    const calories = Number(line);

    if (!Number.isFinite(calories)) {
      throw new Error("Supplied something other than number or line break");
    }

    currentElfCalories += calories;
  }

  elvesCalories.sort((a, b) => b - a);

  const top3 = elvesCalories.slice(0, 3);

  const sum = top3.reduce((prev, curr) => prev + curr, 0);

  return sum;
}

const result = await run("./data.txt");

console.log(result);
