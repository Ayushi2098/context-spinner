
const fs = require('fs');
const { themes_by_topic, theme_subtopic_mapping } = JSON.parse(fs.readFileSync('themes_data.json', 'utf8'));

const themesJsContent = `
export const THEMES_BY_TOPIC = ${JSON.stringify(themes_by_topic, null, 2)};

/**
 * Get all themes for a specific topic
 */
export function getThemesForTopic(topicId) {
  return THEMES_BY_TOPIC[topicId] || [];
}

/**
 * Get all themes across all topics
 */
export function getAllThemes() {
  return Object.values(THEMES_BY_TOPIC).flat();
}
`;

const mappingJsContent = `/**
 * Theme to Subtopic Mapping
 * Maps theme IDs to an array of subtopic IDs
 */
export const THEME_SUBTOPIC_MAPPING = ${JSON.stringify(theme_subtopic_mapping, null, 2)};
`;

fs.writeFileSync('src/data/themes.js', themesJsContent);
fs.writeFileSync('src/data/themeSubtopicMapping.js', mappingJsContent);
console.log('Successfully updated themes.js and themeSubtopicMapping.js');
