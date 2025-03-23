import { NlpManager } from "node-nlp";
import ChatbotData from "./models/chatbotData.js"; // Import the model to store data in MongoDB
import mongoose from "mongoose";

// Create a new instance of NlpManager
const manager = new NlpManager({ languages: ["en"] });

// Function to save user message and bot's response to MongoDB
const saveChatData = async (userMessage, botResponse) => {
  try {
    const newChat = new ChatbotData({
      userMessage,
      botResponse,
      timestamp: new Date(),
    });
    await newChat.save();
    console.log(`Chat saved to database: ${userMessage} - ${botResponse}`);
  } catch (error) {
    console.error("Error saving chat data to database:", error);
  }
};

// Function to process and get response for the user's message
async function getResponse(message) {
  const response = await manager.process("en", message);
  const botResponse = response.answer || "Sorry, I don't understand.";

  // Save the user's message and the bot's response to the database
  await saveChatData(message, botResponse);

  return botResponse;
}

// Function to train the bot with basic knowledge (can be called once)
async function trainBot() {
  manager.addDocument("en", "hello", "greeting");
  manager.addDocument("en", "hi", "greeting");
  manager.addDocument("en", "how are you", "greeting");
  manager.addDocument("en", "what is your name", "name");
  manager.addDocument("en", "bye", "goodbye");
  manager.addDocument("en", "thanks", "thanks");
  manager.addDocument("en", "how can I create react project", "question1");
  manager.addDocument(
    "en",
    "how create logo design using canva",
    "how to design a logo"
  );
  manager.addDocument(
    "en",
    "how create wireframes using figma",
    "how to create wireframes"
  );

  manager.addAnswer("en", "greeting", "Hello! How can I assist you?");
  manager.addAnswer("en", "name", "I am your system chatbot.");
  manager.addAnswer("en", "goodbye", "Goodbye! Have a great day!");
  manager.addAnswer("en", "thanks", "You are welcome!");
  manager.addAnswer(
    "en",
    "question1",
    'To create a React project, open your terminal and run the command "npx create-react-app my-app", where "my-app" is the name you want to give your project; this uses the "create-react-app" tool to quickly set up a basic React application with all the necessary configurations'
  );
  manager.addAnswer(
    "en",
    "how to design a logo",
    `To design a logo, you need to:
    1. Define your brand identity.
    2. Seek inspiration and brainstorm.
    3. Determine logo style.
    4. Choose a type.
    5. Decide on a color scheme.
    6. Pick a font.
    7. Outline a logo shape.
    8. Create a logo.
  
    To design a logo, you can follow these steps. Watch this tutorial below:
    [Design Logo Tutorial](https://youtu.be/H3S0dEbR8rU)`
  );
  manager.addAnswer(
    "en",
    "how to create wireframes",
    `To create wireframes in Figma, start by opening a 
    new design file, then use the "Frame" tool to create 
    artboards representing different screens of your design; 
    utilize basic shapes like rectangles and lines to represent UI elements, 
    add placeholder text, and focus on layout and functionality rather than visual details, 
    ensuring your wireframes clearly communicate the user flow by linking different 
    frames together using Figmas prototyping features.`
  );

  await manager.train();
  manager.save();
}

// Export the functions for external use
export { trainBot, getResponse };
