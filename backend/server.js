require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: '*' })); // In production, replace '*' with your frontend domain
app.use(express.json());

// API credentials from .env
const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;
const RAPIDAPI_HOST = 'bhagavad-gita3.p.rapidapi.com';

// Check if key is missing
if (!RAPIDAPI_KEY) {
  console.error('❌ RAPIDAPI_KEY is missing. Please define it in the .env file.');
  process.exit(1);
}

// Route: Fetch Gita chapter details
app.post('/api/chapter', async (req, res) => {
  const { chapter } = req.body;

  // Input validation
  if (!chapter || isNaN(chapter) || chapter < 1 || chapter > 18) {
    return res.status(400).json({ error: 'Chapter number (1–18) is required and must be valid.' });
  }

  try {
    const response = await axios.get(`https://${RAPIDAPI_HOST}/v2/chapters/${chapter}/`, {
      headers: {
        'x-rapidapi-key': RAPIDAPI_KEY,
        'x-rapidapi-host': RAPIDAPI_HOST,
      },
    });

    res.status(200).json(response.data);
  } catch (error) {
    console.error('❌ Error fetching chapter details:', error.message);
    if (error.response) {
      res.status(error.response.status).json({
        error: error.response.data?.message || 'API Error',
      });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

// Default route
app.get('/', (req, res) => {
  res.send('🕉️ Bhagavad Gita Chapter API is running.');
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server is running at http://localhost:${PORT}`);
});
