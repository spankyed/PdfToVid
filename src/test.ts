import sharp from 'sharp';
import { createCanvas, loadImage } from 'canvas';
import fs from 'fs';
import path from 'path';

const root = '/Users/spankyed/Develop/Projects/PdfToVid/src/files';

async function createCircularImage(imagePath: string, size: number): Promise<Buffer> {
  console.log('createCircularImage: ');

  const circleSvg = `<svg><circle cx="${size/2}" cy="${size/2}" r="${size/2}"/></svg>`;
  const compositeOptions = [{ input: Buffer.from(circleSvg), blend: 'dest-in' }];

  return await sharp(imagePath)
    .resize(size, size)
    .composite(compositeOptions)
    .toBuffer();
}

async function createThumbnail(backgroundPath: string, themePath: string, decorationPath: string, outputPath: string, width: number, height: number): Promise<void> {
  console.log('createThumbnail: ');

  const size = height * 1.3; // Increase the size of the theme image by 3/10ths
  const themePosition = width * .45; // Move the theme image to the right such that 55% is visible

  try {
    const circularThemeBuffer = await createCircularImage(themePath, size);

    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // Load images
    const background = await loadImage(backgroundPath);
    const theme = await loadImage(circularThemeBuffer);
    const decoration = await loadImage(decorationPath);

    // Calculate positions
    const themeVerticalPosition = (height - theme.height) / 2;
    const decorationVerticalPosition = height - (decoration.height / 5);
    const decorationHorizontalPosition = (width - decoration.width) / 2;

    // Draw images on canvas
    ctx.drawImage(background, 0, 0, width, height);
    ctx.drawImage(theme, themePosition, themeVerticalPosition, theme.width, theme.height);
    ctx.drawImage(decoration, decorationHorizontalPosition, decorationVerticalPosition, decoration.width, decoration.height);

    // Write the result to a file
    const out = fs.createWriteStream(outputPath);
    const stream = canvas.createJPEGStream();
    stream.pipe(out);

    console.log('Thumbnail created successfully');
  } catch (error) {
    console.error(`Error creating thumbnail: ${error}`);
  }
}

const bgPath = path.join(root, 'input', 'background.png');
const themePath = path.join(root, 'input', 'theme.png');
const decorationPath = path.join(root, 'input', 'decoration.png');
const outPath = path.join(root, 'output', 'thumbnail.jpg');

createThumbnail(bgPath, themePath, decorationPath, outPath, 1280, 720);
