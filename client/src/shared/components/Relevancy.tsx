import { Paper } from '~/shared/store/types';
import { Tooltip } from "@mui/material";

function Relevancy ({ paper, margin }: { paper: Paper, margin?: string }): React.ReactElement {
  const getColorShade = (value: number): string => {
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

  return (
    <Tooltip title={`${paper.relevancy * 100}%`}>
      <div
        style={{
          verticalAlign: 'middle',
          width: '20px',
          height: '20px',
          borderRadius: '50%',
          border: '1px solid black',
          backgroundColor: getColorShade(paper.relevancy),
          display: 'inline-block',
          margin: margin || '0 .65em 0 0',
        }}
      />
    </Tooltip>
  )
}

export default Relevancy;
