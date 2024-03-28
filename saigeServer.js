require('dotenv').config(); // Loads environment variables from a .env file into process.env
const express = require('express'); // Imports the express module to set up the server
const { Configuration, OpenAIApi } = require("openai"); // Imports Configuration and OpenAIApi classes from the openai package

const app = express(); // Initializes a new express application
const port = 3000; // Defines the port on which the server will listen for requests

app.use(express.json()); // Middleware to parse JSON bodies in incoming requests

// Sets up the configuration for the OpenAI API client, including the API key from environment variables
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY, // Retrieves the OpenAI API key from your environment variables
});
const openai = new OpenAIApi(configuration); // Initializes the OpenAI API client with the specified configuration

// Defines a POST endpoint at /chat to handle chat requests
app.post('/chat', async (req, res) => {
    try {
      const { message } = req.body; // Extracts the message from the request body
      // Makes an asynchronous call to the OpenAI API's createCompletion method to generate a response
      const response = await openai.createCompletion({
        model: "gpt-3.5-turbo", // Specifies the GPT-3.5 Turbo model for the response
        prompt: message, // Uses the user's message as the prompt for the AI
        max_tokens: 150, // Limits the response to a maximum of 150 tokens
        temperature: 0.4, // Adjusts the creativity of the response (0.4 is more deterministic)
      });
    res.json({ reply: response.data.choices[0].text.trim() }); // Sends the trimmed response text back to the client
  } catch (error) {
    console.error(error); // Logs any errors to the console
    res.status(500).json({ message: "An error occurred." }); // Sends an error response back to the client
  }
});

app.listen(port, () => {
  console.log(`Chatbot server listening at http://localhost:${port}`); // Starts the server and logs the listening port
});
