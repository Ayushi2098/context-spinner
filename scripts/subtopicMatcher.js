/**
 * Subtopic matching utility
 * Matches subtopic names from the data to existing subtopic IDs
 */

// Common prefixes and suffixes to remove for matching
const PREFIXES = [
  'introduction to',
  'introduction',
  'basics of',
  'basics',
  'advanced',
  'foundations',
  'fundamentals of',
  'fundamentals',
  'applications of',
  'applications',
  'calculations',
  'formulae',
  'formulaic',
  'understanding',
  'working with',
  'representing',
  'classifying',
  'identifying',
  'naming',
  'solving',
  'applying',
  'modelling',
  'interpreting',
  'analysis of',
  'analysis',
  'measures of',
  'rules of',
  'elements of',
  'characteristics of',
  'transformations of',
  'transformations'
];

const SUFFIXES = [
  'basics',
  'foundations',
  'fundamentals',
  'advanced',
  'calculations',
  'applications',
  'formulae',
  'laws',
  'theorems',
  'rules',
  'features',
  'graphs',
  'plots',
  'tables',
  'diagrams',
  'problems',
  'measurements',
  'conversion',
  'operations',
  'relationships',
  'sequences',
  'functions',
  'equations',
  'inequalities',
  'polynomials',
  'cubics',
  'quartics',
  'transformations',
  'representations',
  'data',
  'analysis',
  'spread',
  'centre',
  'space',
  'shapes',
  'angles',
  'lines',
  'planes',
  'grids',
  'events',
  'probability',
  'statistics',
  'methods',
  'proof',
  'reasoning'
];

/**
 * Normalize a subtopic name for matching
 */
function normalizeSubtopicName(name) {
  if (!name) return '';
  
  let normalized = name.toLowerCase().trim();
  
  // Remove common prefixes
  for (const prefix of PREFIXES) {
    if (normalized.startsWith(prefix + ' ')) {
      normalized = normalized.substring(prefix.length + 1).trim();
      break;
    }
  }
  
  // Remove common suffixes
  for (const suffix of SUFFIXES) {
    if (normalized.endsWith(' ' + suffix)) {
      normalized = normalized.substring(0, normalized.length - suffix.length - 1).trim();
      break;
    }
  }
  
  // Handle special cases
  normalized = normalized
    .replace(/&/g, 'and')
    .replace(/\s+/g, ' ')
    .trim();
  
  return normalized;
}

/**
 * Extract core subtopic names from compound strings
 * e.g., "Fractions, Decimals & Percentages Foundations" -> ["fractions", "decimals", "percentages"]
 */
function extractCoreSubtopics(subtopicString) {
  if (!subtopicString) return [];
  
  // Split by comma, &, and "and"
  const parts = subtopicString
    .split(/[,&]| and /i)
    .map(p => p.trim())
    .filter(p => p.length > 0);
  
  const cores = [];
  
  for (const part of parts) {
    const normalized = normalizeSubtopicName(part);
    if (normalized) {
      cores.push(normalized);
    }
  }
  
  return cores;
}

/**
 * Match a subtopic name to an existing subtopic ID
 * @param {string} subtopicName - The subtopic name from the data
 * @param {Array} existingSubtopics - Array of existing subtopic objects with id and name
 * @returns {string|null} - The matched subtopic ID or null
 */
function matchSubtopic(subtopicName, existingSubtopics) {
  if (!subtopicName || !existingSubtopics) return null;
  
  const normalized = normalizeSubtopicName(subtopicName);
  if (!normalized) return null;
  
  // Create a map of normalized names to IDs
  const nameMap = new Map();
  for (const st of existingSubtopics) {
    const key = normalizeSubtopicName(st.name);
    if (key) {
      nameMap.set(key, st.id);
    }
    // Also map the ID itself
    nameMap.set(st.id.toLowerCase(), st.id);
  }
  
  // Try exact match
  if (nameMap.has(normalized)) {
    return nameMap.get(normalized);
  }
  
  // Try partial match (contains)
  for (const [key, id] of nameMap.entries()) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return id;
    }
  }
  
  // Try matching core words
  const normalizedWords = normalized.split(/\s+/);
  for (const word of normalizedWords) {
    if (word.length > 3 && nameMap.has(word)) {
      return nameMap.get(word);
    }
  }
  
  return null;
}

/**
 * Match multiple subtopics from a comma-separated string
 * @param {string} subtopicString - Comma-separated subtopic names
 * @param {Array} existingSubtopics - Array of existing subtopic objects
 * @returns {Array} - Array of matched subtopic IDs
 */
function matchSubtopics(subtopicString, existingSubtopics) {
  if (!subtopicString || !existingSubtopics) return [];
  
  const matchedIds = new Set();
  
  // First, try to match the whole string
  const wholeMatch = matchSubtopic(subtopicString, existingSubtopics);
  if (wholeMatch) {
    matchedIds.add(wholeMatch);
  }
  
  // Then try splitting and matching individual parts
  const parts = subtopicString.split(',').map(p => p.trim());
  
  for (const part of parts) {
    // Try direct match
    const directMatch = matchSubtopic(part, existingSubtopics);
    if (directMatch) {
      matchedIds.add(directMatch);
      continue;
    }
    
    // Try extracting core subtopics from compound strings
    const cores = extractCoreSubtopics(part);
    for (const core of cores) {
      const coreMatch = matchSubtopic(core, existingSubtopics);
      if (coreMatch) {
        matchedIds.add(coreMatch);
      }
    }
  }
  
  return Array.from(matchedIds);
}

export {
  normalizeSubtopicName,
  extractCoreSubtopics,
  matchSubtopic,
  matchSubtopics
};
