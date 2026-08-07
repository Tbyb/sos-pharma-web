import { useMutation } from '@tanstack/react-query';
import { envoyerMessageChatbotAPI, transcrireAudioChatbotAPI } from '../api/chatbot.api';

export function useEnvoyerMessageChatbot() {
  return useMutation({
    mutationFn: ({ message, historique }) =>
      envoyerMessageChatbotAPI(message, historique).then((res) => res.data),
  });
}

export function useTranscrireAudioChatbot() {
  return useMutation({
    mutationFn: (blobAudio) => transcrireAudioChatbotAPI(blobAudio).then((res) => res.data),
  });
}
