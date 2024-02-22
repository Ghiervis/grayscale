const yauzl = require('yauzl-promise'),
  fs = require('fs'),
  {pipeline} = require('stream/promises');

const zip = await yauzl.open('myfile.zip');
try {
  for await (const entry of zip) {
    if (entry.filename.endsWith('/')) {
      await fs.promises.mkdir(`${entry.filename}`);
    } else {
      const readStream = await entry.openReadStream();
      const writeStream = fs.createWriteStream(
        `${entry.filename}`
      );
      await pipeline(readStream, writeStream);
    }
  }
} finally {
  await zip.close();
}