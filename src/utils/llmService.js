/**
 * LLM Service for generating Real World Applications
 * Uses OpenRouter API to access various LLM models
 */

import { buildSystemPrompt, buildUserPrompt, parseApplicationResponse } from './prompts';

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

const PREFERRED_MODELS = [
    'google/gemini-2.0-flash-exp:free',
    'mistralai/mistral-7b-instruct:free',
    'google/gemma-2-9b-it:free'
];

/**
 * Helper to fetch with timeout
 */
async function fetchWithTimeout(resource, options = {}) {
    const { timeout = 8000 } = options;

    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    try {
        const response = await fetch(resource, {
            ...options,
            signal: controller.signal
        });
        clearTimeout(id);
        return response;
    } catch (error) {
        clearTimeout(id);
        throw error;
    }
}

/**
 * Generate a Real World Application using the LLM
 */
export async function generateRealWorldApplication({
    context,
    strand,
    subtopic,
    skill,
    country = 'Australia',
    classYear = 'Grade 7'
}) {
    const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;

    if (!apiKey) {
        console.error('OpenRouter API key not found');
        return getFallbackApplication(context, subtopic, skill);
    }

    const systemPrompt = buildSystemPrompt({ country, classYear });
    const userPrompt = buildUserPrompt({ context, strand, subtopic, skill, country, classYear });

    // Try preferred models in sequence
    for (const model of PREFERRED_MODELS) {
        try {
            console.log(`Attempting generation with model: ${model}`);
            const response = await fetchWithTimeout(OPENROUTER_API_URL, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json',
                    'HTTP-Referer': window.location.origin,
                    'X-Title': 'Context Spinner - Real World Math Applications'
                },
                body: JSON.stringify({
                    model: model,
                    messages: [
                        { role: 'system', content: systemPrompt },
                        { role: 'user', content: userPrompt }
                    ],
                    temperature: 0.7, // Lower temperature for more focused (and often faster) responses
                    max_tokens: 1000   // Sufficient for 4 cards
                }),
                timeout: 12000 // 12 second timeout per model attempt
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.warn(`OpenRouter API error for model ${model}:`, response.status, errorData);
                continue; // Try next model
            }

            const data = await response.json();
            const content = data.choices?.[0]?.message?.content || '';

            if (!content) {
                console.warn(`Empty response for model ${model}`);
                continue; // Try next model
            }

            console.log(`Successful generation with model: ${model}`);
            const parsed = parseApplicationResponse(content);

            // If parsed result looks like fallback (empty), log it and potentially try next model if failed
            if (!parsed || parsed.length === 0) {
                console.warn(`Failed to parse content from ${model}`);
                continue;
            }

            return parsed;
        } catch (error) {
            console.error(`Failed to generate application with model ${model}:`, error);
            continue; // Try next model
        }
    }

    // Final fallback
    return getFallbackApplication(context, subtopic, skill);
}

/**
 * Fallback application when API fails - provides detailed examples
 */
function getFallbackApplication(context, subtopic, skill) {
    const skillName = skill || subtopic || 'mathematics';
    const contextName = context || 'real world';

    // Return 4 items to match requested count
    return [
        {
            title: `Organizing ${skillName} in ${contextName}`,
            situation: `We use ${skillName.toLowerCase()} to organize observations and ensure proper grouping within ${contextName.toLowerCase()}.`,
            example: `Recording $12$ different specimens and assigning them to $3$ categories: $12 \\div 3 = 4$ per group.`
        },
        {
            title: `Patterns of ${skillName} in ${contextName}`,
            situation: `Identifying patterns in ${contextName.toLowerCase()} requires ${skillName.toLowerCase()} to predict trends and future outcomes.`,
            example: `Observing $5$ new instances every hour: after $4$ hours, we expect $5 \\times 4 = 20$ total.`
        },
        {
            title: `Measuring ${contextName} with ${skillName}`,
            situation: `${skillName.toLowerCase()} helps us maintain precision when recording measurements for ${contextName.toLowerCase()} projects.`,
            example: `Measuring a length of $75$cm and needing to scale it by $2$: $75 \\times 2 = 150$cm.`
        },
        {
            title: `${contextName} Analysis using ${skillName}`,
            situation: `Analyzing ${contextName.toLowerCase()} data involves ${skillName.toLowerCase()} to draw clear conclusions about our findings.`,
            example: `Finding that $8$ out of $10$ samples show a specific trait: $8 \\div 10 = 0.8$ or $80\\%$.`
        }
    ];
}

/**
 * Generate multiple applications for variety
 */
export async function generateMultipleApplications({
    context,
    strand,
    subtopic,
    skill,
    count = 1,
    country = 'Australia',
    classYear = 'Grade 7'
}) {
    // Generate all applications in parallel for better performance
    const promises = [];

    for (let i = 0; i < count; i++) {
        promises.push(
            generateRealWorldApplication({
                context,
                strand,
                subtopic,
                skill,
                country,
                classYear
            })
        );
    }

    // Wait for all API calls to complete
    const applications = await Promise.all(promises);

    return applications;
}
