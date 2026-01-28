# Context Spinner

Generate real-world math applications by combining contexts with math subtopics.

## Features

- **Context Wheel**: Spin to randomly select a context (Aquatics Centre, Stadium, Velodrome, etc.)
- **Subtopic Selection**: Choose math subtopics (Ratio, Graphs, Measurement, etc.) - the generator randomly picks 3 to combine
- **Filter Options**: Optional filters for year level, difficulty, time limit, assessment type, and sport
- **Idea Generation**: Generate 3-6 math application ideas that combine the context with the selected subtopics

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build

```bash
npm run build
```

## How It Works

1. **Spin the wheel** to select a context (or it will be selected automatically when spinning stops)
2. **Select at least 3 subtopics** from the available math strands
3. (Optional) **Set filters** for year level, difficulty, time limit, etc.
4. Click **"Show Ideas"** to generate math application ideas
5. The generator randomly picks 3 subtopics from your selection and creates ideas that combine them with the context
6. Each idea card shows:
   - Title and scenario
   - Math links (which subtopics are used and how)
   - Task prompt for students
   - Optional support and extension prompts
   - Button to generate an image

## Gemini Image Generation Setup

To enable image generation, you'll need to:

1. Set up a backend API endpoint at `/api/gemini-image` that:
   - Accepts POST requests with `{ prompt: string }`
   - Calls the Gemini API to generate an image
   - Returns `{ imageUrl: string }`

2. Update `src/utils/imagePromptBuilder.js`:
   - Modify the `generateIdeaImage` function to call your actual API endpoint
   - Currently it uses a placeholder that simulates the API call

Example backend implementation (Node.js/Express):

```javascript
app.post('/api/gemini-image', async (req, res) => {
  const { prompt } = req.body;
  
  // Call Gemini API here
  // const imageUrl = await callGeminiImageAPI(prompt);
  
  res.json({ imageUrl });
});
```

## Project Structure

```
src/
├── components/          # React components
│   ├── ContextWheel.jsx
│   ├── SubtopicSelector.jsx
│   ├── FiltersPanel.jsx
│   ├── IdeaCard.jsx
│   └── IdeasPane.jsx
├── data/               # Static data
│   ├── contexts.js     # Olympic contexts
│   └── subtopics.js    # Math subtopics
├── utils/              # Utility functions
│   ├── ideaGenerator.js
│   └── imagePromptBuilder.js
├── App.jsx             # Main app component
└── main.jsx            # Entry point
```

## Customization

### Adding New Contexts

Edit `src/data/contexts.js` and add new context objects:

```javascript
{
  id: 'your-context-id',
  name: 'Your Context Name',
  description: 'Description...',
  tags: ['tag1', 'tag2'],
  sports: ['sport1', 'sport2']
}
```

### Adding New Subtopics

Edit `src/data/subtopics.js` and add new subtopic objects:

```javascript
{
  id: 'your-subtopic-id',
  name: 'Your Subtopic',
  strand: 'Number', // or 'Algebra', 'Geometry', etc.
  yearLevels: ['Y5', 'Y6', 'Y7']
}
```

### Customizing Idea Generation

The idea generation logic is in `src/utils/ideaGenerator.js`. You can:
- Add more idea templates for specific contexts
- Integrate with an LLM API for dynamic generation
- Customize the number of ideas generated

## License

MIT
