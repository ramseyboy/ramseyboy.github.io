const plantuml = require('node-plantuml');
const fs = require('fs');

async function build(path) {
  const dir = await fs.promises.opendir(path)
  for await (const file of dir) {
    if (!file.name.endsWith('.plantuml')) {
      continue;
    }

    await generate(file.name, file.name.replace('.plantuml', '.png'), 'png');
  }
}

async function generate(inputFileName, outputFileName, outputFileType) {
  const genSvg = plantuml.generate(inputFileName, { format: outputFileType });

  const outDir = `./images/${outputFileType}`
  await createDirIfNotExists('./images');
  await createDirIfNotExists(outDir);
  genSvg.out.pipe(fs.createWriteStream(`${outDir}/${outputFileName}`));
}

async function createDirIfNotExists(dirPath) {
  try {
    await fs.promises.opendir(dirPath);
  } catch (e) {
    console.warn(`${dirPath} does not exist, creating..`)
    await fs.promises.mkdir(dirPath);
  }
}

build('.').catch((e) => console.error(e));