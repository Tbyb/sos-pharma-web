import { useMutation } from '@tanstack/react-query';
import { envoyerMessageChatbotAPI } from '../api/chatbot.api';

export function useEnvoyerMessageChatbot() {
  return useMutation({
    mutationFn: ({ message, historique }) =>
      envoyerMessageChatbotAPI(message, historique).then((res) => res.data),
  });
}
