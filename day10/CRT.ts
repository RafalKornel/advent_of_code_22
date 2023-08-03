export function CRT() {
  const WIDTH = 40;
  const HEIGHT = 6;

  const screen: boolean[] = new Array(WIDTH * HEIGHT).fill(false);

  function drawPixel(pos: number, value: boolean) {
    screen[pos] = value;
  }

  function drawScreen() {
    for (let i = 0; i < HEIGHT; i++) {
      const row = screen.slice(i * WIDTH, (i + 1) * WIDTH);

      const rowFormatted = row.map((value) => (value ? "#" : ".")).join("");

      console.log(rowFormatted);
    }
  }

  return { drawPixel, drawScreen, WIDTH, HEIGHT };
}
