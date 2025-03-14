import mongoose from "mongoose";

const chatbotDataSchema = new mongoose.Schema({
  userMessage: {
    type: String,
    required: true,
  },
  botResponse: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const ChatbotData = mongoose.model("ChatbotData", chatbotDataSchema);

export default ChatbotData;
