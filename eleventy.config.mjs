import fs from 'fs';
import path from 'path';
import postcss from 'postcss';
import tailwindcss from '@tailwindcss/postcss';
import autoprefixer from 'autoprefixer';

export default function (eleventyConfig) {
    // Filter für das Datum
    eleventyConfig.addFilter("date", (dateObj, format) => {
        const d = dateObj === "now" ? new Date() : new Date(dateObj);
        if (format === "Y" || format === "yyyy") return d.getFullYear();
        return d.toLocaleDateString("de-DE");
    });

    // WICHTIG: Hier kopieren wir die Google-Datei und die Assets ins Zielverzeichnis
    eleventyConfig.addPassthroughCopy("src/assets");
    eleventyConfig.addPassthroughCopy("src/google699c274e08195c77.html");

    eleventyConfig.addWatchTarget("./src/styles/**/*.css");

    // Der CSS Prozess
    eleventyConfig.on('eleventy.after', async () => {
        const inputPath = './src/styles/index.css';
        const outputPath = './dist/styles/index.css';

        if (!fs.existsSync(inputPath)) return;

        const cssContent = fs.readFileSync(inputPath, 'utf8');

        const result = await postcss([
            tailwindcss(),
            autoprefixer()
        ]).process(cssContent, {
            from: inputPath,
            to: outputPath,
        });

        const outputDir = path.dirname(outputPath);
        if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

        fs.writeFileSync(outputPath, result.css);
        console.log('CSS erfolgreich generiert.');
    });

    return {
        dir: { input: 'src', output: 'dist' },
    };
}