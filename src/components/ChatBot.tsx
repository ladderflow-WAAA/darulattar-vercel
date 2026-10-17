import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '../lib/supabase';

interface Message {
  role: 'user' | 'bot';
  text: string;
}

interface ProductInfo {
  name: string;
  description: string;
  scent_profile: { top: string; heart: string; base: string };
  variants: { size: string; price: number }[];
  categories: string[];
  slug: string;
}

const slugify = (text: string) =>
  text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '').replace(/\-\-+/g, '-').replace(/^-+/, '').replace(/-+$/, '');

const SITE_URL = 'https://darulattar.in';
const WHATSAPP_NUMBER = '919578994377';
const STORAGE_KEY = 'darulattar_chat_messages';

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [
        { role: 'bot', text: "Welcome to Darul Attar! I am Attar AI. Ask me about our fragrances, sizes, or get personalized recommendations." },
      ];
    } catch {
      return [
        { role: 'bot', text: "Welcome to Darul Attar! I am Attar AI. Ask me about our fragrances, sizes, or get personalized recommendations." },
      ];
    }
  });
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [catalog, setCatalog] = useState<ProductInfo[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(messages)); } catch {}
  }, [messages]);

  useEffect(() => {
    if (isOpen && catalog.length === 0) {
      (async () => {
        const { data } = await supabase.from('products').select('*');
        if (data) {
          const mapped: ProductInfo[] = data.map((p: any) => ({
            name: p.name,
            description: p.description,
            scent_profile: p.scent_profile || { top: '', heart: '', base: '' },
            variants: p.variants || [],
            categories: p.categories || [],
            slug: slugify(p.name),
          }));
          setCatalog(mapped);
        }
      })();
    }
  }, [isOpen, catalog.length]);

  const buildProductCatalogText = () => {
    if (catalog.length === 0) return '';
    return catalog.map((p) => {
      const prices = p.variants.map((v) => `₹${v.price} (${v.size})`).join(', ');
      const notes = [p.scent_profile.top, p.scent_profile.heart, p.scent_profile.base].filter(Boolean).join(' | ');
      return `- ${p.name}: ${p.description.split('.')[0]}. Prices: ${prices}. Notes: ${notes}. URL: ${SITE_URL}/product/${p.slug}`;
    }).join('\n');
  };

  const SYSTEM_PROMPT = `You are Attar AI, the fragrance advisor at Darul Attar (Thousand Lights, Chennai). You ONLY recommend products from the catalog below.

## CATALOG:
${buildProductCatalogText() || 'Loading catalog...'}

## RULES:
- English or Tanglish as appropriate.
- Direct, honest assistance.
- No emojis of humans or creatures.
- Simple, factual recommendations.`;

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    const updatedMessages: Message[] = [...messages, { role: 'user', text: userMessage }];
    setMessages(updatedMessages);
    setLoading(true);

    try {
      const formattedHistory = updatedMessages.map((m) => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.text }],
      }));

      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) {
        setMessages((prev) => [
          ...prev,
          { role: 'bot', text: 'You can explore our collection above or message us on WhatsApp: 919578994377.' },
        ]);
        setLoading(false);
        return;
      }

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: formattedHistory,
            systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
            generationConfig: { maxOutputTokens: 200, temperature: 0.5 },
          }),
        }
      );

      const data = await res.json();
      const botReply =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        'You can view our complete collection or contact us on WhatsApp at 919578994377.';

      setMessages((prev) => [...prev, { role: 'bot', text: botReply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'bot', text: 'Please browse our collection or contact us directly on WhatsApp at 919578994377.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    const initial: Message[] = [
      { role: 'bot', text: "Welcome to Darul Attar. Ask me about our pure oils, fragrance notes, or orders." },
    ];
    setMessages(initial);
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
  };

  const renderMessage = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);
    return parts.map((part, i) => {
      if (part.match(urlRegex)) {
        const isWhatsApp = part.includes('wa.me');
        return (
          <a
            key={i}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className={`font-semibold underline break-all ${
              isWhatsApp ? 'text-emerald-700 hover:text-emerald-800' : 'text-blue-700 hover:text-blue-800'
            }`}
          >
            {isWhatsApp ? 'Order via WhatsApp' : part}
          </a>
        );
      }
      return part;
    });
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Attar AI Chat"
        className="fixed bottom-6 right-6 z-50 w-12 h-12 bg-black hover:bg-gray-800 text-white rounded-full shadow-lg flex items-center justify-center transition border border-gray-300"
      >
        {isOpen ? (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-22 right-4 sm:right-6 z-50 w-80 sm:w-96 h-[480px] bg-white border border-gray-200 rounded-lg shadow-2xl flex flex-col overflow-hidden font-sans text-gray-900"
          >
            <div className="bg-[#FAF8F5] border-b border-gray-200 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-black text-[#C0A080] flex items-center justify-center rounded-sm text-xs font-bold font-serif">
                  DA
                </div>
                <div>
                  <p className="text-gray-900 text-xs font-bold uppercase tracking-wider">Attar AI</p>
                  <p className="text-gray-500 text-[10px]">Fragrance Specialist</p>
                </div>
              </div>
              <button onClick={clearChat} className="text-gray-400 hover:text-black text-xs transition" title="Clear chat">↺ Reset</button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-white">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[82%] px-3 py-2 rounded-sm text-xs leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-black text-white font-medium'
                        : 'bg-[#FAF8F5] text-gray-800 border border-gray-200 shadow-2xs'
                    }`}
                  >
                    {msg.role === 'bot' ? renderMessage(msg.text) : msg.text}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-[#FAF8F5] text-gray-500 border border-gray-200 px-3 py-1.5 rounded-sm text-xs">
                    Thinking...
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            <form onSubmit={handleSend} className="border-t border-gray-200 p-2.5 flex space-x-2 bg-[#FAF8F5]">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about scents or longevity..."
                className="flex-1 bg-white border border-gray-300 text-gray-900 text-xs rounded-sm px-3 py-2 focus:outline-none focus:border-[#C0A080] transition"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="bg-black hover:bg-gray-800 text-white px-3 py-2 rounded-sm text-xs font-bold uppercase tracking-wider transition disabled:opacity-50"
              >
                Send
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatBot;
