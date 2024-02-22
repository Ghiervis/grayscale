const { unzip, readDir, grayScale } = require('./ioHandler');

async function main() {
    try {
        await unzip('myfile.zip', 'unzipped');
        const pngFiles = await readDir('unzipped');
        for (const file of pngFiles) {
            const outputFile = file.replace('unzipped', 'grayScaled');
            console.log(`Processing file: ${file}`);
            await grayScale(file, outputFile);
            console.log(`Grayscale filter applied to ${file}`);
        }
    } catch (error) {
        console.error(error);
    }
}

main();
