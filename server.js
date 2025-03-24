const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();
const port = 3001;

// Enable CORS
app.use(cors());
app.use(express.json());

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);

// API endpoint for Gemini summary
app.post('/api/gemini-summary', async (req, res) => {
  try {
    const { threads } = req.body;

    if (!threads || !Array.isArray(threads)) {
      return res.status(400).json({ error: 'Invalid request data' });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });

    // Format the prompt for Gemini
    const prompt = `Analyze these discussion threads and provide a comprehensive but brief summary. Focus on:
    Important Announcements
    Summary of solutions to common problems

Threads data:
${JSON.stringify(threads, null, 2)}

Start directly with the important announcements if any or with Summary of solutions to common problems.

Format the response in markdown with the following structure:
# Important Announcements
- List announcements with bullet points

# Common Problems and Discussions
- List solutions with bullet points
- Use nested bullet points for details

Use proper markdown formatting for headers, lists, and emphasis.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return res.status(200).json({ summary: text });
  } catch (error) {
    console.error('Error processing request:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 