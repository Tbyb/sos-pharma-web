import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import Button from '../atoms/Button';
import { useEnvoyerMessageChatbot } from '../../hooks/useChatbot';

function formatReponse(texte) {
  return texte.split('\n').map((ligne, i) => {
    const estListe = ligne.trim().startsWith('- ');
    const contenu = estListe ? ligne.trim().slice(2) : ligne;
    const parts = contenu.split(/(\*\*[^*]+\*\*)/g).map((part, j) =>
      part.startsWith('**') && part.endsWith('**')
        ? <strong key={j}>{part.slice(2, -2)}</strong>
        : <span key={j}>{part}</span>
    );
    return (
      <p key={i} className={estListe ? 'pl-3' : ''}>
        {estListe && '• '}{parts}
      </p>
    );
  });
}

export default function Chatbot() {
  const [ouvert, setOuvert] = useState(false);
  const [message, setMessage] = useState('');
  const [historique, setHistorique] = useState([]);
  const envoyer = useEnvoyerMessageChatbot();
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [historique, envoyer.isPending]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const texte = message.trim();
    if (!texte || envoyer.isPending) return;

    const historiquePrecedent = historique;
    setHistorique((h) => [...h, { role: 'user', content: texte }]);
    setMessage('');

    envoyer.mutate(
      { message: texte, historique: historiquePrecedent },
      {
        onSuccess: (res) => {
          setHistorique((h) => [...h, { role: 'assistant', content: res?.data?.reponse || '' }]);
        },
        onError: () => {
          setHistorique((h) => [...h, {
            role: 'assistant',
            content: "Désolé, je ne suis pas disponible pour le moment. Réessayez dans un instant.",
          }]);
        },
      }
    );
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {ouvert && (
        <div className="mb-3 w-80 sm:w-96 h-[28rem] bg-white rounded-xl shadow-xl border border-gray-200 flex flex-col overflow-hidden">
          <div className="bg-vert text-white px-4 py-3 flex items-center justify-between shrink-0">
            <span className="font-medium text-sm">Assistant SOS-Pharma</span>
            <button onClick={() => setOuvert(false)} className="cursor-pointer hover:bg-white/10 rounded p-1">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-2 text-sm">
            {!historique.length && (
              <p className="text-gris text-xs">
                Bonjour ! Je peux vous aider à trouver un médicament ou à utiliser la plateforme. Que cherchez-vous ?
              </p>
            )}
            {historique.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-lg px-3 py-2 ${m.role === 'user' ? 'bg-bleu text-white' : 'bg-gris-clair text-noir'}`}>
                  {m.role === 'assistant' ? formatReponse(m.content) : m.content}
                </div>
              </div>
            ))}
            {envoyer.isPending && (
              <div className="flex justify-start">
                <div className="bg-gris-clair rounded-lg px-3 py-2 text-gris text-xs">En train d'écrire…</div>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="border-t border-gray-200 p-2 flex gap-2 shrink-0">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Votre question…"
              className="flex-1 px-3 py-2 text-sm rounded-lg border border-gray-300 outline-none focus:border-bleu focus:ring-2 focus:ring-bleu/20"
            />
            <Button type="submit" size="sm" disabled={!message.trim()} loading={envoyer.isPending}>
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      )}

      <button
        onClick={() => setOuvert((v) => !v)}
        className="w-14 h-14 bg-vert text-white rounded-full shadow-lg flex items-center justify-center hover:bg-vert-fonce transition-colors cursor-pointer"
      >
        {ouvert ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>
    </div>
  );
}
