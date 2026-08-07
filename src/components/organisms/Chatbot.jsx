import { useState, useRef, useEffect } from 'react';
import toast from 'react-hot-toast';
import { MessageCircle, X, Send, Mic, Square } from 'lucide-react';
import Button from '../atoms/Button';
import { useEnvoyerMessageChatbot, useTranscrireAudioChatbot } from '../../hooks/useChatbot';

const CLE_BULLE_VUE = 'sos_pharma_chatbot_bulle_vue';

const QUESTIONS_SUGGEREES = [
  'Comment comparer les prix d\'un médicament ?',
  'Comment fonctionne la livraison ?',
  'Comment trouver une pharmacie proche de moi ?',
  'Comment passer une commande ?',
];

function formatReponse(texte) {
  return texte.split('\n').map((ligne, i) => {
    // Le modèle utilise indifféremment "- " ou "* " pour les puces markdown.
    const ligneTrim = ligne.trim();
    const estListe = ligneTrim.startsWith('- ') || ligneTrim.startsWith('* ');
    const contenu = estListe ? ligneTrim.slice(2) : ligne;
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
  const [bulleVisible, setBulleVisible] = useState(false);
  const [enregistrement, setEnregistrement] = useState(false);
  const envoyer = useEnvoyerMessageChatbot();
  const transcrire = useTranscrireAudioChatbot();
  const scrollRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [historique, envoyer.isPending]);

  // Bulle de bienvenue : une seule fois par session, pour signaler la présence du chatbot.
  useEffect(() => {
    if (sessionStorage.getItem(CLE_BULLE_VUE)) return;

    const apparition = setTimeout(() => setBulleVisible(true), 2000);
    return () => clearTimeout(apparition);
  }, []);

  const masquerBulle = () => {
    setBulleVisible(false);
    sessionStorage.setItem(CLE_BULLE_VUE, '1');
  };

  const ouvrirDepuisBulle = () => {
    masquerBulle();
    setOuvert(true);
  };

  const envoyerMessage = (texte) => {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    envoyerMessage(message.trim());
  };

  // Message vocal : enregistre au format webm puis envoie à Whisper (Groq) pour
  // transcription. Le texte obtenu remplit le champ de saisie — l'utilisateur
  // garde la main pour corriger avant d'envoyer, plutôt qu'un envoi automatique.
  const demarrerEnregistrement = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      toast.error("L'enregistrement vocal n'est pas supporté par ce navigateur.");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        stream.getTracks().forEach((track) => track.stop());
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        if (blob.size === 0) return;

        transcrire.mutate(blob, {
          onSuccess: (res) => {
            const texte = res?.data?.texte;
            if (texte) setMessage((m) => (m ? `${m} ${texte}` : texte));
            else toast.error("Je n'ai rien entendu, réessayez.");
          },
          onError: () => toast.error("Erreur lors de la transcription. Réessayez."),
        });
      };

      mediaRecorderRef.current = recorder;
      recorder.start();
      setEnregistrement(true);
    } catch {
      toast.error("Impossible d'accéder au micro. Vérifiez les autorisations.");
    }
  };

  const arreterEnregistrement = () => {
    mediaRecorderRef.current?.stop();
    setEnregistrement(false);
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
              <>
                <p className="text-gris-doux text-xs">
                  Bonjour ! Je peux vous aider à trouver un médicament ou à utiliser la plateforme. Que cherchez-vous ?
                </p>
                <div className="flex flex-col gap-1.5 pt-1">
                  {QUESTIONS_SUGGEREES.map((question) => (
                    <button
                      key={question}
                      type="button"
                      onClick={() => envoyerMessage(question)}
                      disabled={envoyer.isPending}
                      className="text-left text-xs text-vert-profond bg-white border border-vert-menthe hover:bg-vert-menthe rounded-[8px] px-3 py-2 transition-colors duration-200 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </>
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
              placeholder={enregistrement ? 'Enregistrement en cours…' : transcrire.isPending ? 'Transcription…' : 'Votre question…'}
              disabled={enregistrement || transcrire.isPending}
              className="flex-1 px-3 py-2 text-sm rounded-[6px] border border-gris-bordure outline-none focus:border-vert-medical focus:ring-2 focus:ring-vert-medical/20 transition-colors duration-200 disabled:bg-blanc-casse"
            />
            <button
              type="button"
              onClick={enregistrement ? arreterEnregistrement : demarrerEnregistrement}
              disabled={transcrire.isPending}
              title={enregistrement ? "Arrêter l'enregistrement" : 'Message vocal'}
              className={`shrink-0 w-9 h-9 rounded-[6px] flex items-center justify-center transition-colors duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed ${
                enregistrement ? 'bg-danger text-white animate-pulse' : 'border border-gris-bordure text-gris-doux hover:bg-vert-menthe hover:text-vert-profond'
              }`}
            >
              {enregistrement ? <Square className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
            <Button type="submit" size="sm" disabled={!message.trim() || enregistrement} loading={envoyer.isPending}>
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      )}

      <div className="relative inline-block">
        {bulleVisible && !ouvert && (
          <div className="absolute right-full bottom-1 mr-3 w-56 animate-[scale-in_0.2s_ease-out]">
            <div
              onClick={ouvrirDepuisBulle}
              className="relative bg-white text-bleu-nuit text-sm rounded-[8px] shadow-[0_4px_16px_rgba(0,0,0,0.15)] border border-gris-bordure px-3 py-2.5 cursor-pointer"
            >
              <button
                onClick={(e) => { e.stopPropagation(); masquerBulle(); }}
                aria-label="Fermer"
                className="absolute -top-2 -right-2 w-5 h-5 bg-white border border-gris-bordure rounded-full flex items-center justify-center text-gris-doux hover:text-bleu-nuit cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
              👋 Besoin d'aide ? Je suis l'assistant SOS-Pharma, posez-moi une question !
              <div className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-3 h-3 bg-white border-r border-b border-gris-bordure rotate-[-45deg]" />
            </div>
          </div>
        )}

        <button
          onClick={() => { masquerBulle(); setOuvert((v) => !v); }}
          title="Assistant SOS-Pharma"
          className="w-14 h-14 bg-vert-medical hover:bg-vert-profond text-white rounded-full shadow-[0_4px_16px_rgba(0,0,0,0.2)] flex items-center justify-center transition-colors duration-200 cursor-pointer"
        >
          {ouvert ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
        </button>
      </div>
    </div>
  );
}
