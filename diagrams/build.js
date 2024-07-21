const plantuml = require('node-plantuml');
const fs = require('fs');

async function build(path) {
  const dir = await fs.promises.opendir(path, {recursive: true})
  for await (const file of dir) {
    if (!file.name.endsWith('.plantuml')) {
      continue;
    }

    await generate(file.parentPath, file.name, file.name.replace('.plantuml', '.png'), 'png');
  }
}

async function generate(inputFilePath, inputFileName, outputFileName, outputFileType) {
  const genSvg = plantuml.generate(`${inputFilePath}/${inputFileName}`, { format: outputFileType });

  const outDir = `../content/${inputFilePath}/images`
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