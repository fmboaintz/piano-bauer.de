import fs from 'fs';
import path from 'path';
import postcss from 'postcss';
import tailwindcss from '@tailwindcss/postcss';
import autoprefixer from 'autoprefixer'; // Empfohlen für Browser-Kompatibilität

export default function (eleventyConfig) {
    // Filter für das Datum
    eleventyConfig.addFilter("date", (dateObj, format) => {
        const d = dateObj === "now" ? new Date() : new Date(dateObj);
        if (format === "Y" || format === "yyyy") return d.getFullYear();
        return d.toLocaleDateString("de-DE");
    });

    eleventyConfig.addPassthroughCopy("src/assets");
    eleventyConfig.addWatchTarget("./src/styles/**/*.css");

    // Der CSS Prozess
    eleventyConfig.on('eleventy.after', async () => {
        const inputPath = './src/styles/index.css';
        const outputPath = './dist/styles/index.css';

        if (!fs.existsSync(inputPath)) return;

        const cssContent = fs.readFileSync(inputPath, 'utf8');
        
        // Wir fügen autoprefixer hinzu, damit Flexbox/Grid in allen Browsern läuft
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