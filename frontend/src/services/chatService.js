import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/chat/";

export async function sendMessage(question, chatHistory) {
  const response = await axios.post(API_URL, {
    question: question,
    chat_history: chatHistory,
  });

  return response.data;
}
