import fs from 'fs';
import path from 'path';
import postcss from 'postcss';
import tailwindcss from '@tailwindcss/postcss';

export default function (eleventyConfig) {
    // NEU: Diese Zeile sagt Eleventy: "Kopiere den assets-Ordner so wie er ist rüber"
    eleventyConfig.addPassthroughCopy("src/assets");

    eleventyConfig.on('eleventy.before', async () => {
        const tailwindInputPath = path.resolve('./src/styles/index.css');
        const tailwindOutputPath = './dist/styles/index.css';

        // Sicherstellen, dass die Datei existiert, bevor wir lesen
        if (!fs.existsSync(tailwindInputPath)) return;

        const cssContent = fs.readFileSync(tailwindInputPath, 'utf8');
        const outputDir = path.dirname(tailwindOutputPath);

        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        const result = await postcss([tailwindcss()]).process(cssContent, {
            from: tailwindInputPath,
            to: tailwindOutputPath,
        });

        fs.writeFileSync(tailwindOutputPath, result.css);
    });

    return {
        dir: { input: 'src', output: 'dist' },
    };
}