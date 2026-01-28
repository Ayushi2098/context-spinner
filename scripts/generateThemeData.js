/**
 * Complete script to generate theme data files from the provided mapping data
 * This script processes the raw data and generates:
 * - Updated themeTopics.js
 * - Updated themes.js
 * - New themeSubtopicMapping.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { matchSubtopics } from './subtopicMatcher.js';
import { normalizeTopicId, slugify } from './processThemeData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import existing subtopics
const subtopicsPath = path.join(__dirname, '../src/data/subtopics.js');
const subtopicsContent = fs.readFileSync(subtopicsPath, 'utf-8');
// Extract SUBTOPICS array (simple regex match for now)
const subtopicsMatch = subtopicsContent.match(/export const SUBTOPICS = \[([\s\S]*?)\];/);
let existingSubtopics = [];
if (subtopicsMatch) {
  // Parse the subtopics - this is a simplified parser
  const subtopicEntries = subtopicsMatch[1].match(/\{[^}]+\}/g) || [];
  for (const entry of subtopicEntries) {
    const idMatch = entry.match(/id:\s*['"]([^'"]+)['"]/);
    const nameMatch = entry.match(/name:\s*['"]([^'"]+)['"]/);
    if (idMatch && nameMatch) {
      existingSubtopics.push({
        id: idMatch[1],
        name: nameMatch[1]
      });
    }
  }
}

// Read the raw data from processThemeData.js
// For now, we'll process it inline - in production this would come from a file
const rawDataPath = path.join(__dirname, 'processThemeData.js');
let rawDataContent = fs.readFileSync(rawDataPath, 'utf-8');
// Extract the rawData string
const rawDataMatch = rawDataContent.match(/const rawData = `([\s\S]*?)`;/);
if (!rawDataMatch) {
  console.error('Could not find rawData in processThemeData.js');
  process.exit(1);
}
const rawData = rawDataMatch[1];

/**
 * Parse the raw data into structured format
 */
function parseRawData() {
  const lines = rawData.split('\n').filter(line => line.trim());
  const themes = [];
  const topicThemesSet = new Set();
  
  for (const line of lines) {
    const parts = line.split('\t');
    if (parts.length < 3) continue;
    
    const themeName = parts[0].trim();
    const subtopicList = parts[1].trim();
    const topicTheme = parts[2].trim();
    
    if (!themeName) continue;
    
    const themeId = slugify(themeName);
    const topicId = topicTheme ? normalizeTopicId(topicTheme) : null;
    
    if (topicTheme) {
      topicThemesSet.add(topicTheme);
    }
    
    themes.push({
      id: themeId,
      name: themeName,
      subtopicList: subtopicList,
      topicTheme: topicTheme,
      topicId: topicId
    });
  }
  
  return {
    themes,
    topicThemes: Array.from(topicThemesSet).sort()
  };
}

/**
 * Generate theme topics data
 */
function generateThemeTopics(parsedData) {
  const { topicThemes } = parsedData;
  
  // Map topic themes to their normalized IDs and names
  const topicMap = new Map();
  
  for (const topicTheme of topicThemes) {
    const topicId = normalizeTopicId(topicTheme);
    if (!topicMap.has(topicId)) {
      topicMap.set(topicId, {
        id: topicId,
        name: topicTheme,
        description: `Themes related to ${topicTheme.toLowerCase()}`
      });
    }
  }
  
  return Array.from(topicMap.values());
}

/**
 * Generate themes data organized by topic
 */
function generateThemes(parsedData) {
  const { themes } = parsedData;
  const themesByTopic = {};
  const themeSubtopicMapping = {};
  const unmatchedSubtopics = new Set();
  
  for (const theme of themes) {
    if (!theme.topicId) continue;
    
    // Match subtopics
    const matchedSubtopicIds = matchSubtopics(theme.subtopicList, existingSubtopics);
    
    // Track unmatched subtopics for reporting
    if (theme.subtopicList) {
      const subtopicParts = theme.subtopicList.split(',').map(s => s.trim());
      for (const part of subtopicParts) {
        const matched = matchSubtopics(part, existingSubtopics);
        if (matched.length === 0 && part.length > 0) {
          unmatchedSubtopics.add(part);
        }
      }
    }
    
    // Create theme object
    const themeObj = {
      id: theme.id,
      name: theme.name,
      description: `Real-world applications of mathematics in the context of ${theme.name.toLowerCase()}.`,
      tags: generateTags(theme.name),
      topicId: theme.topicId,
      subtopicIds: matchedSubtopicIds
    };
    
    // Add to themes by topic
    if (!themesByTopic[theme.topicId]) {
      themesByTopic[theme.topicId] = [];
    }
    themesByTopic[theme.topicId].push(themeObj);
    
    // Store mapping
    themeSubtopicMapping[theme.id] = matchedSubtopicIds;
  }
  
  return {
    themesByTopic,
    themeSubtopicMapping,
    unmatchedSubtopics: Array.from(unmatchedSubtopics).sort()
  };
}

/**
 * Generate tags from theme name
 */
function generateTags(themeName) {
  const tags = [];
  const lower = themeName.toLowerCase();
  
  // Add category-based tags
  if (lower.includes('sport') || lower.includes('ball') || lower.includes('game')) {
    tags.push('sports');
  }
  if (lower.includes('tech') || lower.includes('digital') || lower.includes('computer')) {
    tags.push('technology');
  }
  if (lower.includes('science') || lower.includes('space') || lower.includes('planet')) {
    tags.push('science');
  }
  if (lower.includes('art') || lower.includes('design') || lower.includes('music')) {
    tags.push('art');
  }
  
  return tags.length > 0 ? tags : ['general'];
}

/**
 * Write themeTopics.js
 */
function writeThemeTopics(themeTopics) {
  const content = `/**
 * Theme Topics - Categories that group themes
 * Auto-generated from theme-subtopic mapping data
 */
export const THEME_TOPICS = [
${themeTopics.map(t => `  {
    id: '${t.id}',
    name: '${t.name}',
    description: '${t.description}'
  }`).join(',\n')}
];
`;
  
  const outputPath = path.join(__dirname, '../src/data/themeTopics.js');
  fs.writeFileSync(outputPath, content);
  console.log(`✓ Written ${themeTopics.length} theme topics to themeTopics.js`);
}

/**
 * Write themes.js
 */
function writeThemes(themesByTopic) {
  const topicIds = Object.keys(themesByTopic).sort();
  
  let content = `/**
 * Themes - The actual items that appear in the spinner
 * Organized by theme topic
 * Auto-generated from theme-subtopic mapping data
 */
export const THEMES_BY_TOPIC = {
`;
  
  for (const topicId of topicIds) {
    const themes = themesByTopic[topicId];
    content += `  '${topicId}': [\n`;
    for (const theme of themes) {
      content += `    {\n`;
      content += `      id: '${theme.id}',\n`;
      content += `      name: '${theme.name.replace(/'/g, "\\'")}',\n`;
      content += `      description: '${theme.description.replace(/'/g, "\\'")}',\n`;
      content += `      tags: [${theme.tags.map(t => `'${t}'`).join(', ')}],\n`;
      content += `      topicId: '${theme.topicId}',\n`;
      content += `      subtopicIds: [${theme.subtopicIds.map(id => `'${id}'`).join(', ')}]\n`;
      content += `    },\n`;
    }
    content += `  ],\n`;
  }
  
  content += `};

/**
 * Get themes for a specific topic
 */
export function getThemesForTopic(topicId) {
  return THEMES_BY_TOPIC[topicId] || [];
}

/**
 * Get all themes (flattened)
 */
export function getAllThemes() {
  return Object.values(THEMES_BY_TOPIC).flat();
}
`;
  
  const outputPath = path.join(__dirname, '../src/data/themes.js');
  fs.writeFileSync(outputPath, content);
  
  const totalThemes = Object.values(themesByTopic).reduce((sum, themes) => sum + themes.length, 0);
  console.log(`✓ Written ${totalThemes} themes to themes.js`);
}

/**
 * Write themeSubtopicMapping.js
 */
function writeThemeSubtopicMapping(themeSubtopicMapping) {
  let content = `/**
 * Theme-Subtopic Mapping
 * Maps theme IDs to their associated subtopic IDs
 * Auto-generated from theme-subtopic mapping data
 */
export const THEME_SUBTOPIC_MAPPING = {
`;
  
  const themeIds = Object.keys(themeSubtopicMapping).sort();
  for (const themeId of themeIds) {
    const subtopicIds = themeSubtopicMapping[themeId];
    content += `  '${themeId}': [${subtopicIds.map(id => `'${id}'`).join(', ')}],\n`;
  }
  
  content += `};

/**
 * Get subtopic IDs for a specific theme
 */
export function getSubtopicsForTheme(themeId) {
  return THEME_SUBTOPIC_MAPPING[themeId] || [];
}

/**
 * Get all themes that use a specific subtopic
 */
export function getThemesForSubtopic(subtopicId) {
  const themes = [];
  for (const [themeId, subtopicIds] of Object.entries(THEME_SUBTOPIC_MAPPING)) {
    if (subtopicIds.includes(subtopicId)) {
      themes.push(themeId);
    }
  }
  return themes;
}

/**
 * Get themes that use any of the provided subtopics
 */
export function getThemesForSubtopics(subtopicIds) {
  const themeSet = new Set();
  for (const subtopicId of subtopicIds) {
    const themes = getThemesForSubtopic(subtopicId);
    themes.forEach(themeId => themeSet.add(themeId));
  }
  return Array.from(themeSet);
}
`;
  
  const outputPath = path.join(__dirname, '../src/data/themeSubtopicMapping.js');
  fs.writeFileSync(outputPath, content);
  console.log(`✓ Written theme-subtopic mapping to themeSubtopicMapping.js`);
}

/**
 * Main execution
 */
function main() {
  console.log('Processing theme-subtopic mapping data...\n');
  
  console.log(`Found ${existingSubtopics.length} existing subtopics\n`);
  
  // Parse raw data
  console.log('Parsing raw data...');
  const parsedData = parseRawData();
  console.log(`  - Found ${parsedData.themes.length} themes`);
  console.log(`  - Found ${parsedData.topicThemes.length} unique topic themes\n`);
  
  // Generate theme topics
  console.log('Generating theme topics...');
  const themeTopics = generateThemeTopics(parsedData);
  writeThemeTopics(themeTopics);
  console.log('');
  
  // Generate themes
  console.log('Generating themes...');
  const { themesByTopic, themeSubtopicMapping, unmatchedSubtopics } = generateThemes(parsedData);
  writeThemes(themesByTopic);
  console.log('');
  
  // Write mapping
  console.log('Generating theme-subtopic mapping...');
  writeThemeSubtopicMapping(themeSubtopicMapping);
  console.log('');
  
  // Report unmatched subtopics
  if (unmatchedSubtopics.length > 0) {
    console.log(`⚠ Warning: ${unmatchedSubtopics.length} unmatched subtopics found:`);
    unmatchedSubtopics.slice(0, 20).forEach(st => console.log(`  - ${st}`));
    if (unmatchedSubtopics.length > 20) {
      console.log(`  ... and ${unmatchedSubtopics.length - 20} more`);
    }
    console.log('');
  }
  
  console.log('✓ Data processing complete!');
}

main();
