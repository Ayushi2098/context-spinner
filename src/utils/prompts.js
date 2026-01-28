/**
 * Real World Application Prompt Templates
 * Based on Tutero's educational math content generation system
 */

export const GRADE_LEVEL_GUIDELINES = `
# GRADE LEVEL GUIDELINES
- Use age-appropriate vocabulary and complexity
- Keep mathematical operations simple and accessible
- For younger grades (3-5): Focus on basic operations, simple numbers
- For middle grades (6-8): Can include ratios, percentages, basic algebra
- For older grades (9-10): Can include more complex relationships but keep calculations manageable
`;

export const CONCISENESS_GUIDELINE = `
# CONCISENESS
- Keep explanations extremely brief and focused.
- Use EXACTLY ONE succinct sentence per situation.
- Maximum 120 characters per situation.
- Use simple, direct language.
`;

export const KATEX_GUIDELINE = `
# KATEX FORMATTING
- Use inline KaTeX for ALL numbers and expressions
- Format: $number$ for standalone numbers, e.g., $8$, $1{,}000$
- Format: $expression$ for operations, e.g., $24 \\div 8 = 3$
- Use \\times for multiplication, \\div for division
- IMPORTANT: Use double backslashes for LaTeX commands (e.g., \\\\times, \\\\div, \\\\frac) because this is a JSON response.
- Use comma separators for large numbers: $1{,}000$
`;

/**
 * Build the system prompt for Real World Application generation
 */
export function buildSystemPrompt({ country, classYear }) {
  return `
# ROLE
You are an educational content generator that creates high-quality real-world math application cards.

# YOUR GOAL
Generate clear, practical, age-appropriate, and realistic examples that show how a specific math topic is used in a real-world theme.

# CORE RULES
- Be specific, not vague.
- Use realistic numbers.
- Clearly show why the math is needed.
- Be understandable to students and teachers.
- Avoid generic phrases like "used to calculate" or "helps with measurements".
- Match the style of a learning app explanation card.
- Use real-world language, not academic jargon.
- The math must be correct and relevant.
- The theme must be clearly visible in every card.
- Do NOT mention "students", "learning", or "teachers".
- Do NOT be vague or abstract.

# FORBIDDEN PHRASES (Never use these)
- "used to calculate"
- "helps with measurements"
- "professionals use"
- "experts apply"
- "solve real-world problems"
- "in their daily work"

${KATEX_GUIDELINE}

${CONCISENESS_GUIDELINE}
`;
}

/**
 * Build the user prompt with specific inputs
 */
export function buildUserPrompt({ context, strand, subtopic, skill, country, classYear }) {
  return `
# INPUTS
- Theme: ${context}
- Math Topic: ${skill}

# TASK
Generate exactly FOUR real-world application cards showing how ${skill} is used in ${context}.
Follow the exact structure and rules below.

# FORMAT RULES
Each card must follow this structure:

Card Title
(short, practical, scenario-based)

Situation:
(1 succinct sentence explaining a realistic scenario where this math skill is used)

# ADDITIONAL RULES
- Use different situations for each card.
- Do NOT repeat examples across cards.

## OUTPUT FORMAT (JSON only, no other text)
Return an array of 4 objects:
[
  {
    "title": "Card Title 1",
    "situation": "Situation description 1..."
  },
  {
    "title": "Card Title 2",
    "situation": "Situation description 2..."
  },
  {
    "title": "Card Title 3",
    "situation": "Situation description 3..."
  },
  {
    "title": "Card Title 4",
    "situation": "Situation description 4..."
  }
]
`;
}

/**
 * Parse the LLM response (expects JSON array of objects)
 */
export function parseApplicationResponse(responseText) {
  try {
    // Try to extract JSON from the response
    const jsonMatch = responseText.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      if (Array.isArray(parsed)) {
        return parsed.map((item, index) => ({
          title: item.title || `Application ${index + 1}`,
          situation: item.situation || ''
        }));
      }
    }
  } catch (error) {
    console.error('Failed to parse application response:', error);
  }

  // Fallback response
  return [];
}
