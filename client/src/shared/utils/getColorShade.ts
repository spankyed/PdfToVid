export const getColorShade = (value: number): string => {
  const greenRGB = [0, 255, 0];
  const yellowRGB = [255, 255, 0];
  const redRGB = [255, 0, 0];

  const interpolateRGB = (start: number[], end: number[], t: number): number[] =>
    start.map((channel, i) => Math.round(channel + t * (end[i] - channel)));

  const colorRGB = value <= 0.5
    ? interpolateRGB(redRGB, yellowRGB, value * 2) // Flip start and end colors
    : interpolateRGB(yellowRGB, greenRGB, (value - 0.5) * 2); // Flip start and end colors

  return `rgb(${colorRGB.join(', ')})`;
}