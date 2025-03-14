const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

// Serve static files from the React app in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'build')));
}

// Proxy endpoint for the Wordware API
app.post('/api/generate-story', async (req, res) => {
  try {
    const response = await axios.post(
      'https://app.wordware.ai/api/released-app/5f0bbd5b-d933-4fac-912f-aaa4e6772386/run',
      {
        inputs: req.body.inputs,
        version: "^3.0"
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ww-5916h52zF1qi3SxMASUJ1HScxn1LibbpYmewHyfrJBs56tixAjGvR1'
        }
      }
    );
    
    console.log(response.data);
    res.json(response.data);
  } catch (error) {
    console.error('Error calling Wordware API:', error.message);
    res.status(500).json({ 
      error: 'Failed to generate story',
      details: error.response ? error.response.data : error.message
    });
  }
});

// For any other GET request, serve React app in production
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 