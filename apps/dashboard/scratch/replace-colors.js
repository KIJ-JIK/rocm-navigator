const fs = require('fs');
const path = require('path');

// Replacement map
const replacements = [
  // Hex color replacements (case-insensitive)
  { regex: /#cc4155/gi, replacement: '#4f46e5' }, // Wine red primary -> Indigo primary
  { regex: /#e35b6e/gi, replacement: '#6366f1' }, // Wine pink secondary -> Light Indigo
  { regex: /#871717/gi, replacement: '#312e81' }, // Crimson -> Dark Indigo
  { regex: /#150507/gi, replacement: '#0b0d19' }, // Reddish black -> Midnight Indigo black
  { regex: /#4e1c22/gi, replacement: '#1c2242' }, // Wine border -> Indigo border
  { regex: /#310e14/gi, replacement: '#090b16' }, // Deep wine -> Deep Midnight Indigo
  { regex: /#2d1115/gi, replacement: '#1c203b' }, // Wine hover -> Indigo hover
  { regex: /#1b080b/gi, replacement: '#12162b' }, // Wine card -> Deep Indigo card
  { regex: /#fbd6cb/gi, replacement: '#F0E7D5' }, // Rose cream text -> Vanilla Cream
  { regex: /#9d7d82/gi, replacement: '#8fa0dd' }, // Muted rose text -> Muted lavender
  { regex: /#1a080a/gi, replacement: '#090b16' }, // Red black -> Midnight black
  { regex: /#120406/gi, replacement: '#06070d' }, // Deepest wine console bg -> Deepest indigo black
  { regex: /#1e0a0d/gi, replacement: '#0f1225' }, // Additional wine bg -> Indigo drawer bg
  { regex: /#240c0f/gi, replacement: '#151930' }, // Additional wine bg
  { regex: /#ff5f56/gi, replacement: '#3b82f6' }, // Traffic close red -> Blue
  
  // RGBA replacements
  { regex: /rgba\(30,\s*8,\s*11,/gi, replacement: 'rgba(18, 22, 43,' },
  { regex: /rgba\(43,\s*13,\s*17,/gi, replacement: 'rgba(18, 22, 43,' },
  { regex: /rgba\(227,\s*91,\s*110,/gi, replacement: 'rgba(99, 102, 241,' },
  { regex: /rgba\(26,\s*7,\s*9,/gi, replacement: 'rgba(18, 22, 43,' },
  { regex: /rgba\(21,\s*5,\s*7,/gi, replacement: 'rgba(9, 11, 22,' },
  { regex: /rgba\(204,\s*65,\s*85,/gi, replacement: 'rgba(79, 70, 229,' },
  
  // Class name semantic updates
  { regex: /wine-dashboard-root/g, replacement: 'indigo-dashboard-root' },
  { regex: /wine-sidebar/g, replacement: 'indigo-sidebar' },
  { regex: /wine-glass-card/g, replacement: 'indigo-glass-card' },
  { regex: /wine-aura/g, replacement: 'indigo-aura' },
  { regex: /wine-console/g, replacement: 'indigo-console' }
];

function processFile(filePath) {
  console.log(`Processing file: ${filePath}`);
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  for (const item of replacements) {
    content = content.replace(item.regex, item.replacement);
  }

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Successfully updated ${filePath}`);
  } else {
    console.log(`No changes made to ${filePath}`);
  }
}

// Process files
processFile(path.join(__dirname, '../src/app/page.tsx'));
processFile(path.join(__dirname, '../src/app/hero.css'));

console.log("Color replacements completed!");
