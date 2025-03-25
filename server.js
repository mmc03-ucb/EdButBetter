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
    const prompt = `Analyze these discussion threads

Threads data:
${JSON.stringify(threads, null, 2)}
if there are no threads, return "No Active Threads, start a new thread!"
Start directly with the important announcements if any or with Summary of solutions to common problems.

Format the response in markdown with the following structure:
# Important Announcements
- List announcements with bullet points, using the thread title as a link to the thread ID like this: [Title](thread_id)
- Do not show the thread ID in the text, only use it in the link
- Example: [Lab 3 Assignment Updates](thread_Yo6sMzwOFrNtOOujb0aK)
- Use nested bullet points for important details only

# What your peers are discussing
- List solutions with bullet points, using the thread title as a link to the thread ID like this: [Title](thread_id)
- Do not show the thread ID in the text, only use it in the link
- Example: [TCP vs UDP Comparison](thread_abc123)
- Use nested bullet points for important details only

Use proper markdown formatting for headers, lists, and emphasis.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Process the markdown to ensure thread IDs are included
    const processedText = text.replace(/\[(.*?)\]\((.*?)\)/g, (match, title, id) => {
      const thread = threads.find(t => t.title === title);
      if (thread) {
        return `[${title}](thread/${thread.id})`;
      }
      return match;
    });

    return res.status(200).json({ 
      summary: processedText,
      threads: threads.map(t => ({ id: t.id, title: t.title }))
    });
  } catch (error) {
    console.error('Error processing request:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// API endpoint for AI Q/A
app.post('/api/ai-qa', async (req, res) => {
  try {
    const { query, threads, conversationHistory } = req.body;

    if (!query || !threads || !Array.isArray(threads)) {
      return res.status(400).json({ error: 'Invalid request data' });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });

    // Format the prompt for Gemini
    const prompt = `You are a helpful AI assistant for a discussion forum about computer science and programming. 
Answer the following question using ONLY the information available in the provided threads.
If the answer cannot be found in the threads, explicitly state "I don't have enough information to answer that question based on the forum threads. Please ask in the thread."

${conversationHistory ? `Recent conversation history:
${conversationHistory}

` : ''}User question: ${query}

Threads data:
${JSON.stringify(threads, null, 2)}

Explain your answer so that it is easy to understand. Be thorough and detailed where appropriate and concise otherwise.
 Format your response in a conversational way. Use markdown formatting where appropriate for code snippets, lists, or emphasis.
 If you're answering a follow-up question, take into account the previous conversation.
 When referencing a thread, mention it only once as follows: "According to [Thread Title]" or "As mentioned in [Thread Title]" Hyperlink [Thread Title].`

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Process the text to create links to threads - match [Thread Title] pattern
    const processedText = text.replace(/\[(.*?)\]/g, (match, title) => {
      const thread = threads.find(t => t.title.toLowerCase() === title.toLowerCase());
      if (thread) {
        return `[${title}](thread/${thread.id})`;
      }
      return match;
    });

    return res.status(200).json({ 
      answer: processedText
    });
  } catch (error) {
    console.error('Error processing AI Q/A request:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// API endpoint for converting text to emoji
app.post('/api/convert-to-emoji', async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });

    const prompt = `Convert every word in the following text into gibberish english that does not contain any profanities. None of the words should be recognizable.

Text to convert: "${text}"

Return only the converted text, no additional text or explanation.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const emojiText = response.text().trim();

    return res.status(200).json({ emojiText });
  } catch (error) {
    console.error('Error converting text to emoji:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 