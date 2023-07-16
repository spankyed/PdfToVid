import gm from 'gm';
import { promisify } from 'util';

const gmWrite = promisify(gm.prototype.write);
const gmIn = promisify(gm.prototype.in);
const gmMosaic = promisify(gm.prototype.mosaic);
const root = '/Users/spankyed/Develop/Projects/PdfToVid/src/files';

async function createCircularMask(outputPath: string, size: number): Promise<void> {
  console.log('createCircularMask: ');
  const mask = gm(size, size, 'white')
    .drawCircle(size / 2, size / 2, size / 2, 0);
  await gmWrite.call(mask, outputPath);
}

async function applyMask(imagePath: string, maskPath: string, outputPath: string, size: number): Promise<void> {
  console.log('applyMask: ');
  const image = gm(imagePath)
    .resize(size, size)
    .mask(maskPath);
  await gmWrite.call(image, outputPath);
}

async function combineImages(backgroundPath: string, themePath: string, outputPath: string, width: number, height: number, themePosition: number): Promise<void> {
  console.log('combineImages: ');
  const image = gm('')
    .in('-page', '+0+0')
    .in(backgroundPath)
    .in('-page', `+${themePosition}+0`)
    .in(themePath)
    .mosaic()
    .resize(width, height);
  await gmWrite.call(image, outputPath);
}

async function createThumbnail(backgroundPath: string, themePath: string, outputPath: string, width: number, height: number): Promise<void> {
  console.log('createThumbnail: ');
  const maskPath = root + '/temp/mask.png';
  const circularThemePath = root + '/temp/theme.png';
  const size = height; // Assuming the theme image should be a square of height x height
  const themePosition = width * 3 / 5; // Move the theme image to the right such that 2/5 is cut off

  try {
    await createCircularMask(maskPath, size);
    await applyMask(themePath, maskPath, circularThemePath, size);
    await combineImages(backgroundPath, circularThemePath, outputPath, width, height, themePosition);
    console.log('Thumbnail created successfully');
  } catch (error) {
    console.error(`Error creating thumbnail: ${error}`);
  }
}

const bgPath = root + '/input/background.png';
const themePath = root + '/input/theme.png';
const outPath = root + '/output/thumbnail.jpg';

createThumbnail(bgPath, themePath, outPath, 1280, 720);
