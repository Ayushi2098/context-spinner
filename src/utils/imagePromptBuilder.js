/**
 * Builds Gemini image generation prompts from idea cards
 */

/**
 * @param {Object} input
 * @param {string} input.contextName
 * @param {string} [input.sportVibe]
 * @param {string} input.scenarioShort
 * @param {string[]} input.subtopics
 * @param {string[]} input.keyObjects
 */
export function buildGeminiImagePrompt({ contextName, sportVibe, scenarioShort, subtopics, keyObjects }) {
  const parts = [
    `Create a clean, classroom-safe illustration of ${contextName}` +
      (sportVibe ? ` during ${sportVibe}` : '') + '.',
    `Show: ${keyObjects.join(', ')}.`,
    `The image should support a maths task about ${subtopics.join(', ')}.`,
    'Do NOT include any text, labels, or numbers in the image.',
    'Use a simple, high-contrast, diagram-friendly style.',
    'Avoid gore, violence, or anything unsafe.'
  ];
  
  return parts.join(' ');
}

/**
 * Generates an image prompt for an idea card
 */
export function addImagePromptToIdea(idea, context) {
  // Extract key objects from scenario
  const keyObjects = extractKeyObjects(idea, context);
  
  const prompt = buildGeminiImagePrompt({
    contextName: idea.contextName,
    sportVibe: context.sports?.[0] ? `${context.sports[0]} practice` : undefined,
    scenarioShort: idea.scenario,
    subtopics: idea.subtopicsUsed.map(s => s.name),
    keyObjects
  });
  
  return { ...idea, imagePrompt: prompt };
}

/**
 * Extracts key visual objects from an idea's scenario
 */
function extractKeyObjects(idea, context) {
  const contextId = context.id;
  const objects = [];
  
  // Context-specific objects
  if (contextId === 'aquatics-centre' || contextId === 'swimming-pool') {
    objects.push(
      'an indoor swimming pool with lanes',
      'swimmers in different lanes',
      'a poolside coach with a stopwatch',
      'a large timing board with abstract times (no readable text)'
    );
  } else if (contextId === 'stadium') {
    objects.push(
      'an athletics track with lanes',
      'athletes at starting positions',
      'field event equipment',
      'a scoreboard showing abstract numbers'
    );
  } else if (contextId === 'velodrome') {
    objects.push(
      'a banked cycling track',
      'cyclists on the track',
      'timing equipment',
      'the curved banking visible'
    );
  } else {
    objects.push(
      `the ${context.name.toLowerCase()} setting`,
      'relevant equipment or objects',
      'people or athletes in the scene'
    );
  }
  
  return objects;
}

/**
 * Creates a placeholder image as a data URL
 */
function createPlaceholderImage(title) {
  // Escape special characters for SVG
  const escapeXml = (str) => {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  };
  
  const escapedTitle = escapeXml(title);
  
  // Create a simple SVG placeholder
  const svg = `<svg width="600" height="400" xmlns="http://www.w3.org/2000/svg">
  <rect width="600" height="400" fill="#4A90E2"/>
  <text x="300" y="180" font-family="Arial, sans-serif" font-size="20" fill="white" text-anchor="middle" dominant-baseline="middle">${escapedTitle}</text>
  <text x="300" y="220" font-family="Arial, sans-serif" font-size="14" fill="rgba(255,255,255,0.8)" text-anchor="middle" dominant-baseline="middle">Image Placeholder</text>
</svg>`;
  
  // Use encodeURIComponent instead of base64 for better compatibility
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

/**
 * Calls Gemini API to generate an image
 * In production, this would be a backend API call
 */
export async function generateIdeaImage(idea) {
  if (!idea.imagePrompt) {
    throw new Error('Idea must have an imagePrompt before generating image');
  }
  
  // In production, this would call your backend API which calls Gemini
  // For now, we'll simulate it with a placeholder
  try {
    // This would be: const res = await fetch('/api/gemini-image', { ... })
    // For demo purposes, we'll return a placeholder
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
    
    // Return a data URL placeholder instead of external URL
    return createPlaceholderImage(idea.title);
  } catch (error) {
    console.error('Error generating image:', error);
    throw error;
  }
}
