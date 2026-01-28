/**
 * Idea generation logic
 * Generates real-world application ideas using LLM with quality fallbacks
 * Content adapts to both theme AND topic
 */

import { generateRealWorldApplication } from './llmService';

/**
 * Topic-specific math examples
 * Each topic has 2 unique application templates (sliced from templates)
 */
const TOPIC_TEMPLATES = {
  'division': [
    {
      title: (theme) => `Splitting Resources in ${theme}`,
      situation: (theme) => `Professionals divide materials equally across team members in ${theme}.`,
      example: () => `A team has $120$ meters of rope for $4$ courses. Each course gets $120 \\div 4 = 30$ meters.`
    },
    {
      title: (theme) => `Fair Distribution in ${theme}`,
      situation: (theme) => `Instructors divide session time evenly among different ${theme.toLowerCase()} activities.`,
      example: () => `A $90$-minute session split into $3$ activities: $90 \\div 3 = 30$ minutes each.`
    },
    {
      title: (theme) => `${theme} Budget Allocation`,
      situation: (theme) => `Managers divide budgets across various ${theme.toLowerCase()} projects to ensure funding.`,
      example: () => `A $\\$2{,}400$ budget for $6$ projects: $2400 \\div 6 = \\$400$ per project.`
    },
    {
      title: (theme) => `Equipment Sharing in ${theme}`,
      situation: (theme) => `Coordinators calculate how to share limited ${theme.toLowerCase()} equipment among groups.`,
      example: () => `$15$ pieces of equipment for $5$ groups: $15 \\div 5 = 3$ pieces per group.`
    }
  ],

  'multiplication': [
    {
      title: (theme) => `Scaling Up in ${theme}`,
      situation: (theme) => `Experts calculate total units when ordering ${theme.toLowerCase()} supplies in bulk.`,
      example: () => `Ordering $8$ boxes with $12$ items each: $8 \\times 12 = 96$ items total.`
    },
    {
      title: (theme) => `${theme} Revenue Calculations`,
      situation: (theme) => `Owners calculate total earnings from multiple ${theme.toLowerCase()} sessions.`,
      example: () => `$5$ classes with $15$ students at $\\$20$ each: $5 \\times 15 \\times 20 = \\$1{,}500$.`
    },
    {
      title: (theme) => `Material Requirements for ${theme}`,
      situation: (theme) => `Planners calculate the total materials needed for large ${theme.toLowerCase()} events.`,
      example: () => `Each station needs $4$ items, $7$ stations total: $7 \\times 4 = 28$ items needed.`
    },
    {
      title: (theme) => `Time Estimates in ${theme}`,
      situation: (theme) => `Project managers estimate combined hours for repeated ${theme.toLowerCase()} tasks.`,
      example: () => `$6$ tasks taking $45$ minutes each: $6 \\times 45 = 270$ minutes = $4.5$ hours.`
    }
  ],

  'fractions': [
    {
      title: (theme) => `Proportions in ${theme}`,
      situation: (theme) => `Experts measure precise proportions to ensure high quality in ${theme.toLowerCase()} projects.`,
      example: () => `A recipe needs $\\frac{3}{4}$ cup per serving. For $4$ servings: $\\frac{3}{4} \\times 4 = 3$ cups.`
    },
    {
      title: (theme) => `Partial Quantities in ${theme}`,
      situation: (theme) => `Specialists work with partial amounts of ${theme.toLowerCase()} resources when supply is limited.`,
      example: () => `Using $\\frac{2}{3}$ of a $12$-meter piece: $\\frac{2}{3} \\times 12 = 8$ meters used.`
    },
    {
      title: (theme) => `${theme} Completion Tracking`,
      situation: (theme) => `Teams track ${theme.toLowerCase()} project progress using fractions of work completed.`,
      example: () => `Team completed $\\frac{5}{8}$ of $40$ tasks: $\\frac{5}{8} \\times 40 = 25$ tasks done.`
    },
    {
      title: (theme) => `Mixing Ratios in ${theme}`,
      situation: (theme) => `Professionals mix ${theme.toLowerCase()} materials using precise fractional ratios.`,
      example: () => `Mix $\\frac{1}{4}$ blue with $\\frac{3}{4}$ white. For $200$ml: $50$ml blue + $150$ml white.`
    }
  ],

  'percentages': [
    {
      title: (theme) => `Discounts in ${theme}`,
      situation: (theme) => `${theme} businesses calculate final prices after applying promotional discounts.`,
      example: () => `A $\\$80$ item with $25\\%$ off: $80 \\times 0.25 = \\$20$ discount. Final: $\\$60$.`
    },
    {
      title: (theme) => `${theme} Performance Metrics`,
      situation: (theme) => `Coaches track improvement as a percentage of previous ${theme.toLowerCase()} results.`,
      example: () => `Score improved from $60$ to $75$. Increase: $\\frac{75-60}{60} \\times 100 = 25\\%$.`
    },
    {
      title: (theme) => `Capacity Planning in ${theme}`,
      situation: (theme) => `Managers calculate ${theme.toLowerCase()} attendance as a percentage of total capacity.`,
      example: () => `$180$ out of $200$ spots filled: $\\frac{180}{200} \\times 100 = 90\\%$ capacity.`
    },
    {
      title: (theme) => `${theme} Growth Analysis`,
      situation: (theme) => `Analysts track year-over-year growth across the ${theme.toLowerCase()} industry.`,
      example: () => `Revenue grew from $\\$10{,}000$ to $\\$12{,}500$. Growth: $25\\%$ increase.`
    }
  ],

  'addition': [
    {
      title: (theme) => `Total Costs in ${theme}`,
      situation: (theme) => `Professionals sum various expenses to determine the total budget for ${theme.toLowerCase()} tasks.`,
      example: () => `Equipment $\\$450$ + Materials $\\$230$ + Labor $\\$320$ = $\\$1{,}000$ total.`
    },
    {
      title: (theme) => `Combining Quantities in ${theme}`,
      situation: (theme) => `Workers add up ${theme.toLowerCase()} resources gathered from multiple sources.`,
      example: () => `Supplies from $3$ orders: $45 + 62 + 38 = 145$ items received.`
    },
    {
      title: (theme) => `${theme} Score Totals`,
      situation: (theme) => `Judges combine ${theme.toLowerCase()} scores from different rounds or categories.`,
      example: () => `Scores: Technical $8.5$ + Creativity $9.2$ + Style $8.8$ = $26.5$ points.`
    },
    {
      title: (theme) => `Distance Tracking in ${theme}`,
      situation: (theme) => `Athletes track total distances covered across several ${theme.toLowerCase()} sessions.`,
      example: () => `Week's sessions: $3.2 + 4.5 + 2.8 + 5.1 = 15.6$ km total.`
    },
    {
      title: (theme) => `Inventory Totals in ${theme}`,
      situation: (theme) => `Managers combine inventory from different storage areas in ${theme.toLowerCase()}.`,
      example: () => `Warehouse $A$ ($150$) + Warehouse $B$ ($275$) = $425$ total units.`
    },
    {
      title: (theme) => `${theme} Attendance Tracking`,
      situation: (theme) => `Organizers add attendance from multiple ${theme.toLowerCase()} sessions to report total reach.`,
      example: () => `Morning $85$ + Afternoon $120$ + Evening $95$ = $300$ participants.`
    },
    {
      title: (theme) => `Resource Aggregation for ${theme}`,
      situation: (theme) => `Teams pool resources together to meet large ${theme.toLowerCase()} project requirements.`,
      example: () => `Team $1$ ($12$ units) + Team $2$ ($15$ units) + Team $3$ ($8$ units) = $35$ units total.`
    },
    {
      title: (theme) => `${theme} Duration Sums`,
      situation: (theme) => `Coordinators sum the duration of individual tasks to plan the ${theme.toLowerCase()} schedule.`,
      example: () => `Setup $30$ min + Activity $60$ min + Cleanup $30$ min = $120$ minutes total.`
    }
  ],

  'subtraction': [
    {
      title: (theme) => `Remaining Stock in ${theme}`,
      situation: (theme) => `Managers track remaining inventory in ${theme.toLowerCase()} after items are used or sold.`,
      example: () => `Started with $500$ items, sold $347$. Remaining: $500 - 347 = 153$ items.`
    },
    {
      title: (theme) => `${theme} Time Remaining`,
      situation: (theme) => `Coordinators calculate time left before ${theme.toLowerCase()} deadlines.`,
      example: () => `Deadline in $14$ days, $9$ days passed. Time left: $14 - 9 = 5$ days.`
    },
    {
      title: (theme) => `Budget Tracking for ${theme}`,
      situation: (theme) => `Accountants monitor spending against allocated ${theme.toLowerCase()} budgets.`,
      example: () => `Budget $\\$5{,}000$, spent $\\$3{,}275$. Remaining: $5000 - 3275 = \\$1{,}725$.`
    },
    {
      title: (theme) => `Difference Analysis in ${theme}`,
      situation: (theme) => `Analysts compare ${theme.toLowerCase()} results between different time periods.`,
      example: () => `This month: $1{,}240$ customers. Last month: $980$. Difference: $+260$ customers.`
    }
  ],

  'time elapsed': [
    {
      title: (theme) => `Session Duration in ${theme}`,
      situation: (theme) => `Instructors track the exact duration of each activity scheduled in ${theme.toLowerCase()} sessions.`,
      example: () => `Started at $9{:}15$ AM, ended at $11{:}45$ AM. Duration: $2$ hours $30$ minutes.`
    },
    {
      title: (theme) => `${theme} Schedule Planning`,
      situation: (theme) => `Event planners calculate gaps between various ${theme.toLowerCase()} activities.`,
      example: () => `Activity A ends at $2{:}30$ PM, B starts at $3{:}15$ PM. Gap: $45$ minutes.`
    },
    {
      title: (theme) => `Production Time in ${theme}`,
      situation: (theme) => `Manufacturers track ${theme.toLowerCase()} production time from start to completion.`,
      example: () => `Process started Monday $8$ AM, finished Wednesday $4$ PM. Total: $56$ hours.`
    },
    {
      title: (theme) => `${theme} Training Schedules`,
      situation: (theme) => `Coaches plan ${theme.toLowerCase()} training blocks with rest intervals.`,
      example: () => `$4$ training blocks of $25$ min with $5$ min breaks. Total: $4 \\times 30 = 120$ min.`
    }
  ],

  'ratio': [
    {
      title: (theme) => `Mixing Ratios in ${theme}`,
      situation: (theme) => `Specialists mix materials in precise ratios to achieve consistent results in ${theme.toLowerCase()}.`,
      example: () => `A $2{:}3$ ratio needs $10$ parts A. Part B: $\\frac{10 \\times 3}{2} = 15$ parts.`
    },
    {
      title: (theme) => `Scaling in ${theme}`,
      situation: (theme) => `Designers scale ${theme.toLowerCase()} projects while maintaining proportions.`,
      example: () => `Original $4{:}3$ aspect. Width $120$cm means height: $\\frac{120 \\times 3}{4} = 90$cm.`
    },
    {
      title: (theme) => `${theme} Team Distribution`,
      situation: (theme) => `Managers divide ${theme.toLowerCase()} teams using specific staffing ratios.`,
      example: () => `Senior to junior ratio $1{:}4$. With $3$ seniors, need $3 \\times 4 = 12$ juniors.`
    },
    {
      title: (theme) => `Ingredient Ratios for ${theme}`,
      situation: (theme) => `Professionals maintain consistent ratios across all ${theme.toLowerCase()} batches.`,
      example: () => `Recipe ratio $5{:}2{:}1$. For $40$ units total: $25 + 10 + 5 = 40$ units.`
    }
  ]
};

const DEFAULT_TEMPLATES = [
  {
    title: (theme, topic) => `Exploring ${topic} with ${theme}`,
    situation: (theme, topic) => `We use ${topic.toLowerCase()} to organize and understand observations in ${theme.toLowerCase()}.`,
    example: (topic) => `Applying ${topic.toLowerCase()} clarifies measurements in this context.`
  },
  {
    title: (theme, topic) => `${topic} in ${theme}`,
    situation: (theme, topic) => `Applying ${topic.toLowerCase()} reveals detailed patterns within ${theme.toLowerCase()}.`,
    example: (topic) => `Using ${topic.toLowerCase()} tracks specific data points.`
  },
  {
    title: (theme, topic) => `Analyzing ${theme} with ${topic}`,
    situation: (theme, topic) => `${topic.toLowerCase()} offers a structured approach to managing data about ${theme.toLowerCase()}.`,
    example: (topic) => `${topic} calculations allow for accurate planning.`
  },
  {
    title: (theme, topic) => `Discovering ${theme}: ${topic} at Work`,
    situation: (theme, topic) => `Applying ${topic.toLowerCase()} to ${theme.toLowerCase()} handles complex scenarios effectively.`,
    example: (topic) => `Using ${topic.toLowerCase()} interprets relationships and quantities.`
  },
  {
    title: (theme, topic) => `Strategic ${theme} with ${topic}`,
    situation: (theme, topic) => `Decisions in ${theme.toLowerCase()} are driven by ${topic.toLowerCase()} analysis of current performance.`,
    example: (topic) => `Applying ${topic.toLowerCase()} provides a basis for effective choices.`
  },
  {
    title: (theme, topic) => `Advanced ${theme} Insights: ${topic}`,
    situation: (theme, topic) => `Understanding ${theme.toLowerCase()} requires the precision that ${topic.toLowerCase()} brings to observations.`,
    example: (topic) => `Using ${topic.toLowerCase()} verifies results and maintains standards.`
  },
  {
    title: (theme, topic) => `Practical ${theme} Management`,
    situation: (theme, topic) => `Everyday tasks in ${theme.toLowerCase()} are more efficient when using ${topic.toLowerCase()} to process information.`,
    example: (topic) => `Applying ${topic.toLowerCase()} ensures projects are accounted for accurately.`
  },
  {
    title: (theme, topic) => `Future of ${theme}: ${topic} Analysis`,
    situation: (theme, topic) => `Predicting outcomes in ${theme.toLowerCase()} depends on using ${topic.toLowerCase()} to model scenarios.`,
    example: (topic) => `Using ${topic.toLowerCase()} tools helps plan ahead effectively.`
  }
];

/**
 * Generates exactly 2 unique application ideas for a given theme and topic
 */
export async function generateIdeasForThemeAndTopic(theme, topic) {
  // Try API first
  try {
    const results = await generateRealWorldApplication({
      context: theme.name,
      strand: 'Number', // Default to Number as the new prompt focuses on topic name
      subtopic: topic,
      skill: topic,
      country: 'Australia',
      classYear: 'Grade 7'
    });

    if (Array.isArray(results) && results.length > 0) {
      return results.map((result, index) => ({
        id: `idea-${Date.now()}-${index}`,
        contextId: theme.id,
        contextName: theme.name,
        title: result.title,
        situation: result.situation,
        example: result.example,
        scenario: result.situation // for legacy support
      }));
    }
  } catch (error) {
    console.log('API unavailable, using topic-based fallback content');
  }

  return getTopicBasedFallbacks(theme, topic);
}

/**
 * Get fallbacks that match the specific topic
 */
function getTopicBasedFallbacks(theme, topic) {
  const topicLower = topic.toLowerCase();
  const templates = TOPIC_TEMPLATES[topicLower] || DEFAULT_TEMPLATES;
  const count = 4;

  return templates.slice(0, count).map((template, index) => ({
    id: `idea-fallback-${Date.now()}-${index}`,
    contextId: theme.id,
    contextName: theme.name,
    title: typeof template.title === 'function' ? template.title(theme.name, topic) : template.title,
    situation: typeof template.situation === 'function' ? template.situation(theme.name, topic) : template.situation,
    example: typeof template.example === 'function' ? template.example(topic) : template.example,
    scenario: typeof template.situation === 'function' ? template.situation(theme.name, topic) : template.situation
  }));
}
