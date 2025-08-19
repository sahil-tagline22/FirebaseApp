const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
const Papa = require('papaparse');

const CSV_URL = `https://docs.google.com/spreadsheets/d/e/2PACX-1vTHtPfZzREO7yTM1hjtVUQD6TZisTw5GhJjt8CSJYhyKZoblK6a2v9Bg-sEWCNt6HXRRrAaZgSH8HHn/pub?output=csv&t=${Date.now()}`;

async function fetchSheetData() {
  try {
    const response = await fetch(CSV_URL);
    if (!response.ok)
      throw new Error(`Failed to fetch CSV: ${response.status}`);

    // Remove BOM if present
    let csv = await response.text();
    csv = csv.replace(/^\uFEFF/, '');

    const parsed = Papa.parse(csv, { header: true });
    console.log('✅ CSV Headers:', parsed.meta.fields);

    return parsed.data;
  } catch (err) {
    console.error('❌ Error fetching or parsing CSV:', err);
    throw err;
  }
}

// Preserve quotes but avoid over-escaping
function cleanValue(value) {
  return value
    .replace(/\r?\n/g, '\\n') // Convert actual newlines to \n
    .trim();
}

async function generateLocales() {
  const data = await fetchSheetData();
  const locales = {};

  console.log('✅ Sample row:', data[0]); // Debug first row

  for (const row of data) {
    const key = row.key?.trim();
    if (!key) continue;

    for (const lang of Object.keys(row)) {
      if (lang === 'key') continue;

      let value = row[lang];
      if (!value) continue;

      value = cleanValue(value);

      if (!locales[lang]) locales[lang] = {};

      const keys = key.split('.');
      let ref = locales[lang];

      for (let i = 0; i < keys.length - 1; i++) {
        if (!ref[keys[i]]) ref[keys[i]] = {};
        ref = ref[keys[i]];
      }

      ref[keys[keys.length - 1]] = value;
    }
  }

  const outputDir = path.join(__dirname, 'src', 'i18n', 'locales');
  fs.mkdirSync(outputDir, { recursive: true });

  for (const [lang, content] of Object.entries(locales)) {
    const filePath = path.join(outputDir, `${lang}.json`);
    fs.writeFileSync(filePath, JSON.stringify(content, null, 2));
    console.log(`✅ Generated: ${lang}.json`);
  }
}

generateLocales().catch(err => {
  console.error('❌ Locale generation failed:', err.message);
});
