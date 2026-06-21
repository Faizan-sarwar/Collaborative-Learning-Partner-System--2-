import express from 'express';
import cors from 'cors';
import 'dotenv/config';

const app = express();

// Enable CORS for React frontend
app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        // Allow localhost on any port for development
        if (origin.includes('localhost')) {
            return callback(null, true);
        }

        callback(new Error('Not allowed by CORS'));
    },
    credentials: true
}));

app.use(express.json());


// Chatbot API configuration — Groq (fast LPU inference, generous free tier).
// Get a free key at https://console.groq.com/keys and put it in chatserver/.env:
//     GROQ_API_KEY=gsk_your_key_here

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';

// 'llama-3.3-70b-versatile' = best quality | 'llama-3.1-8b-instant' = fastest
const MODEL = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';

const SYSTEM_PROMPT = `You are a helpful AI study assistant for a student learning platform.
You help students improve academic performance: explaining concepts clearly, suggesting
study techniques, breaking down hard topics, and motivating them. Keep answers concise
and well-structured. Use markdown (headings, bold, lists, code blocks) when it aids clarity.`;

// Only keep the last few turns so we never blow the per-minute token budget.
const MAX_HISTORY_MESSAGES = 12;

// Function to call the Groq chat API. Returns the assistant's reply as a string.
async function callChatbot(messages) {
    if (!GROQ_API_KEY) {
        throw new Error('Missing GROQ_API_KEY — add it to chatserver/.env');
    }

    // Keep only valid user/assistant turns, trimmed to the most recent ones.
    const history = (Array.isArray(messages) ? messages : [])
        .filter(m => m && m.content && (m.role === 'user' || m.role === 'assistant'))
        .slice(-MAX_HISTORY_MESSAGES);

    const payload = {
        model: MODEL,
        messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...history],
        temperature: 0.6,
        max_tokens: 1024
    };

    const response = await fetch(GROQ_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${GROQ_API_KEY}`
        },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        const errText = await response.text();
        const err = new Error(`Groq API error ${response.status}: ${errText}`);
        err.status = response.status;
        throw err;
    }

    const data = await response.json();
    const text = data?.choices?.[0]?.message?.content?.trim();
    if (!text) throw new Error('Empty response from Groq');
    return text;
}

// Test endpoint to debug API response
app.get('/api/test', async (req, res) => {
    try {
        const testMessages = [{ role: 'user', content: 'Hello, how are you?' }];
        const reply = await callChatbot(testMessages);

        res.json({
            success: true,
            model: MODEL,
            extractedMessage: reply
        });
    } catch (error) {
        res.json({
            success: false,
            error: error.message
        });
    }
});

// Chat endpoint
app.post('/api/chat', async (req, res) => {
    try {
        const { message, conversation = [] } = req.body;

        if (!message || !message.trim()) {
            return res.status(400).json({ success: false, error: 'Message is required.' });
        }

        // The frontend already appends the latest user message to `conversation`,
        // but we add it defensively in case it didn't.
        const last = conversation[conversation.length - 1];
        const messages = (last && last.role === 'user' && last.content === message)
            ? conversation
            : [...conversation, { role: 'user', content: message }];

        const reply = await callChatbot(messages);

        // Returned as a plain string in `response` — ChatBot.jsx already handles
        // the `typeof data.response === 'string'` case.
        res.json({
            success: true,
            response: reply,
            conversation: [...messages, { role: 'assistant', content: reply }]
        });
    } catch (error) {
        console.error('Chatbot API error:', error.message);
        if (error.status === 429) {
            return res.status(429).json({
                success: false,
                error: 'Busy right now — please try again in a few seconds.'
            });
        }
        res.status(500).json({
            success: false,
            error: 'Failed to get chatbot response'
        });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Chatbot API is running', model: MODEL });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Chatbot API server running on port ${PORT} (model: ${MODEL})`);
});

export default app;