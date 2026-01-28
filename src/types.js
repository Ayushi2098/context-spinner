/**
 * Data models for Context Spinner
 */

export const DIFFICULTY_LEVELS = {
  easy: 'Easy',
  medium: 'Medium',
  hard: 'Hard'
};

export const ASSESSMENT_TYPES = {
  practice: 'Practice',
  formative: 'Formative',
  summative: 'Summative',
  project: 'Project'
};

/**
 * @typedef {Object} Context
 * @property {string} id
 * @property {string} name
 * @property {string} description
 * @property {string[]} tags
 * @property {string[]} sports
 */

/**
 * @typedef {Object} Subtopic
 * @property {string} id
 * @property {string} name
 * @property {string} strand
 * @property {string[]} yearLevels
 */

/**
 * @typedef {Object} SubtopicRef
 * @property {string} id
 * @property {string} name
 */

/**
 * @typedef {Object} IdeaCard
 * @property {string} id
 * @property {string} contextId
 * @property {string} contextName
 * @property {SubtopicRef[]} subtopicsUsed
 * @property {string} title
 * @property {string} scenario
 * @property {string} taskPrompt
 * @property {string} [supportPrompt]
 * @property {string} [extensionPrompt]
 * @property {string} [imagePrompt]
 * @property {string} [imageUrl]
 */

/**
 * @typedef {Object} Filters
 * @property {string} [yearLevel]
 * @property {'easy'|'medium'|'hard'} [difficulty]
 * @property {number} [timeLimit]
 * @property {'practice'|'formative'|'summative'|'project'} [assessmentType]
 * @property {string} [sportFilter]
 */

/**
 * @typedef {Object} IdeaSet
 * @property {string} id
 * @property {string} contextId
 * @property {string} contextName
 * @property {SubtopicRef[]} subtopicsTriple
 * @property {Filters} filters
 * @property {IdeaCard[]} ideas
 */
