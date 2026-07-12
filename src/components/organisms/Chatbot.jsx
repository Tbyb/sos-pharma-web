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
        <div className="mb-3 w-80 sm:w-96 h-[28rem] bg-white rounded-[8px] shadow-[0_8px_24px_rgba(0,0,0,0.15)] border border-gris-bordure flex flex-col overflow-hidden">
          <div className="bg-vert-profond text-white px-4 py-3 flex items-center justify-between shrink-0">
            <span className="font-medium text-sm">Assistant SOS-Pharma</span>
            <button onClick={() => setOuvert(false)} className="cursor-pointer hover:bg-white/10 rounded-[6px] p-1 transition-colors duration-200">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-2 text-sm bg-blanc-casse">
            {!historique.length && (
              <p className="text-gris-doux text-xs">
                Bonjour ! Je peux vous aider à trouver un médicament ou à utiliser la plateforme. Que cherchez-vous ?
              </p>
            )}
            {historique.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-[8px] px-3 py-2 ${m.role === 'user' ? 'bg-vert-medical text-white' : 'bg-white border border-gris-bordure text-bleu-nuit'}`}>
                  {m.role === 'assistant' ? formatReponse(m.content) : m.content}
                </div>
              </div>
            ))}
            {envoyer.isPending && (
              <div className="flex justify-start">
                <div className="bg-white border border-gris-bordure rounded-[8px] px-3 py-2 text-gris-doux text-xs">En train d'écrire…</div>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="border-t border-gris-bordure p-2 flex gap-2 shrink-0 bg-white">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Votre question…"
              className="flex-1 px-3 py-2 text-sm rounded-[6px] border border-gris-bordure outline-none focus:border-vert-medical focus:ring-2 focus:ring-vert-medical/20 transition-colors duration-200"
            />
            <Button type="submit" size="sm" disabled={!message.trim()} loading={envoyer.isPending}>
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      )}

      <button
        onClick={() => setOuvert((v) => !v)}
        title="Assistant SOS-Pharma"
        className="w-14 h-14 bg-vert-medical hover:bg-vert-profond text-white rounded-full shadow-[0_4px_16px_rgba(0,0,0,0.2)] flex items-center justify-center transition-colors duration-200 cursor-pointer"
      >
        {ouvert ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>
    </div>
  );
}
