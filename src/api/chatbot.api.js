import axiosInstance from './axiosInstance';

export function envoyerMessageChatbotAPI(message, historique = []) {
  return axiosInstance.post('/chatbot/message', { message, historique });
}
