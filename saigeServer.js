require('dotenv').config();
const express = require('express');
const { Configuration, OpenAIApi } = require("openai");

const app = express();
const port = 3000;

app.use(express.json());

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.post('/chat', async (req, res) => {
    try {
      const { message } = req.body;
      const response = await openai.createCompletion({
        model: "gpt-3.5-turbo", // Updated to use GPT-3.5 Turbo
        prompt: message,
        max_tokens: 150,
        temperature: 0.4, // You can adjust this value to change the creativity of the response
      });
    res.json({ reply: response.data.choices[0].text.trim() });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred." });
  }
});

app.listen(port, () => {
  console.log(`Chatbot server listening at http://localhost:${port}`);
});
