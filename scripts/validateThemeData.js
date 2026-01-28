/**
 * Validation script for theme data
 * Checks data integrity and reports issues
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import generated data
const themesPath = path.join(__dirname, '../src/data/themes.js');
const themeTopicsPath = path.join(__dirname, '../src/data/themeTopics.js');
const mappingPath = path.join(__dirname, '../src/data/themeSubtopicMapping.js');
const subtopicsPath = path.join(__dirname, '../src/data/subtopics.js');

function validateData() {
  console.log('Validating theme data...\n');
  
  const issues = [];
  const warnings = [];
  
  // Read and parse files
  const themesContent = fs.readFileSync(themesPath, 'utf-8');
  const themeTopicsContent = fs.readFileSync(themeTopicsPath, 'utf-8');
  const mappingContent = fs.readFileSync(mappingPath, 'utf-8');
  const subtopicsContent = fs.readFileSync(subtopicsPath, 'utf-8');
  
  // Extract data (simplified parsing)
  const themeIds = new Set();
  const topicIds = new Set();
  const subtopicIds = new Set();
  
  // Extract subtopic IDs
  const subtopicMatches = subtopicsContent.matchAll(/id:\s*['"]([^'"]+)['"]/g);
  for (const match of subtopicMatches) {
    subtopicIds.add(match[1]);
  }
  
  // Extract topic IDs
  const topicMatches = themeTopicsContent.matchAll(/id:\s*['"]([^'"]+)['"]/g);
  for (const match of topicMatches) {
    topicIds.add(match[1]);
  }
  
  // Extract theme IDs and validate
  const themeMatches = themesContent.matchAll(/id:\s*['"]([^'"]+)['"]/g);
  for (const match of themeMatches) {
    const themeId = match[1];
    if (themeIds.has(themeId)) {
      issues.push(`Duplicate theme ID: ${themeId}`);
    }
    themeIds.add(themeId);
  }
  
  // Validate theme topicIds
  const themeTopicMatches = themesContent.matchAll(/topicId:\s*['"]([^'"]+)['"]/g);
  for (const match of themeTopicMatches) {
    const topicId = match[1];
    if (!topicIds.has(topicId)) {
      issues.push(`Theme references invalid topicId: ${topicId}`);
    }
  }
  
  // Validate subtopic IDs in themes
  const subtopicIdMatches = themesContent.matchAll(/subtopicIds:\s*\[([^\]]+)\]/g);
  for (const match of subtopicIdMatches) {
    const idsString = match[1];
    const ids = idsString.match(/'([^']+)'/g) || [];
    for (const idMatch of ids) {
      const id = idMatch.replace(/'/g, '');
      if (id && !subtopicIds.has(id)) {
        warnings.push(`Theme references unknown subtopic ID: ${id}`);
      }
    }
  }
  
  // Validate mapping file
  const mappingMatches = mappingContent.matchAll(/'([^']+)':\s*\[([^\]]+)\]/g);
  for (const match of mappingMatches) {
    const themeId = match[1];
    const idsString = match[2];
    const ids = idsString.match(/'([^']+)'/g) || [];
    
    if (!themeIds.has(themeId)) {
      issues.push(`Mapping references unknown theme ID: ${themeId}`);
    }
    
    for (const idMatch of ids) {
      const id = idMatch.replace(/'/g, '');
      if (id && !subtopicIds.has(id)) {
        warnings.push(`Mapping references unknown subtopic ID: ${id}`);
      }
    }
  }
  
  // Report results
  console.log(`Found ${themeIds.size} themes`);
  console.log(`Found ${topicIds.size} topic themes`);
  console.log(`Found ${subtopicIds.size} existing subtopics\n`);
  
  if (issues.length > 0) {
    console.log(`❌ Found ${issues.length} issues:`);
    issues.forEach(issue => console.log(`  - ${issue}`));
    console.log('');
  } else {
    console.log('✓ No critical issues found\n');
  }
  
  if (warnings.length > 0) {
    console.log(`⚠ Found ${warnings.length} warnings (unknown subtopic references):`);
    const uniqueWarnings = [...new Set(warnings)];
    uniqueWarnings.slice(0, 10).forEach(warning => console.log(`  - ${warning}`));
    if (uniqueWarnings.length > 10) {
      console.log(`  ... and ${uniqueWarnings.length - 10} more`);
    }
    console.log('\nNote: Many subtopics from the data may not exist in subtopics.js yet.');
    console.log('This is expected if you plan to add more subtopics later.\n');
  } else {
    console.log('✓ No warnings\n');
  }
  
  return {
    issues,
    warnings,
    themeCount: themeIds.size,
    topicCount: topicIds.size,
    subtopicCount: subtopicIds.size
  };
}

// Run validation
const result = validateData();

if (result.issues.length === 0) {
  console.log('✓ Validation passed!');
  process.exit(0);
} else {
  console.log('❌ Validation failed!');
  process.exit(1);
}
