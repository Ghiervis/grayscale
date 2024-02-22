const fs = require('fs');
const unzipper = require('unzipper');
const PNG = require('pngjs').PNG;

function unzip(zipFilePath, destinationPath) {
    return new Promise((resolve, reject) => {
        fs.createReadStream(zipFilePath)
            .pipe(unzipper.Extract({ path: destinationPath }))
            .on('finish', () => {
                console.log("Extraction operation complete");
                resolve();
            })
            .on('error', reject);
    });
}

function readDir(directoryPath) {
    return new Promise((resolve, reject) => {
        fs.readdir(directoryPath, (err, files) => {
            if (err) {
                reject(err);
                return;
            }
            const pngFiles = files.filter(file => file.endsWith('.png'));
            resolve(pngFiles.map(file => `${directoryPath}/${file}`));
        });
    });
}

function grayScale(pathIn, pathOut) {
    return new Promise((resolve, reject) => {
        fs.createReadStream(pathIn)
            .pipe(new PNG())
            .on('parsed', function () {
                for (let y = 0; y < this.height; y++) {
                    for (let x = 0; x < this.width; x++) {
                        const idx = (this.width * y + x) << 2;
                        const avg = (this.data[idx] + this.data[idx + 1] + this.data[idx + 2]) / 3;
                        this.data[idx] = avg; // Red
                        this.data[idx + 1] = avg; // Green
                        this.data[idx + 2] = avg; // Blue
                    }
                }
                this.pack().pipe(fs.createWriteStream(pathOut))
                    .on('finish', resolve)
                    .on('error', reject);
            })
            .on('error', reject);
    });
}

module.exports = { unzip, readDir, grayScale };
