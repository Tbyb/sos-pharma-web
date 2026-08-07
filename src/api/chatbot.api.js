import axiosInstance from './axiosInstance';

export function envoyerMessageChatbotAPI(message, historique = []) {
  return axiosInstance.post('/chatbot/message', { message, historique });
}

export function transcrireAudioChatbotAPI(blobAudio) {
  const formData = new FormData();
  formData.append('audio', blobAudio, 'message.webm');
  return axiosInstance.post('/chatbot/transcription', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
}
