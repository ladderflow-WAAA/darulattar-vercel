import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  role: 'user' | 'bot';
  text: string;
}

const SYSTEM_PROMPT = `You are Attar AI, an AI assistant specialized exclusively in attar, oud, and premium perfume oils. Your expertise covers:
- Types of attars and oud oils
- Scent profiles, notes, and fragrance families
- How to choose perfumes based on personal preferences
- The history and tradition of attar and oud making
- Product recommendations from Darul Attar's collection
- Differences between oil-based and alcohol-based perfumes
- How to apply and store attars and oud oils
- Fragrance layering and combinations

You must ONLY answer questions related to attar, oud, perfumes, fragrances, and scent-related topics. If a user asks about anything outside this scope, politely decline with: "I specialize in attar and oud fragrances. Please ask me about scents, perfumes, or fragrance-related topics."

Keep responses concise, informative, and helpful. Reference Darul Attar's collection when relevant.

You can also respond in Tanglish (Tamil + English mix) if the user messages in Tamil or Tanglish. Adapt naturally to the user's language.

Do not use markdown formatting. Keep responses to 3-4 sentences maximum.`;

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', text: "Welcome to Darul Attar. I'm Attar AI. Ask me about our fragrances, attars, or oud oils." },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const apiKey = (typeof process !== 'undefined' && process.env?.OPENROUTER_API_KEY) || '';
      if (!apiKey) {
        setMessages((prev) => [...prev, { role: 'bot', text: 'AI service is not configured. Set OPENROUTER_API_KEY in your environment.' }]);
        setLoading(false);
        return;
      }

      const chatHistory = messages.map((m) => ({
        role: m.role === 'user' ? 'user' : 'assistant',
        content: m.text,
      }));

      const res = await fetch(
        'https://openrouter.ai/api/v1/chat/completions',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
            'HTTP-Referer': 'https://darulattar.com',
            'X-Title': 'Darul Attar',
          },
          body: JSON.stringify({
            model: 'openai/gpt-4o-mini',
            messages: [
              { role: 'system', content: SYSTEM_PROMPT },
              ...chatHistory,
              { role: 'user', content: userMsg },
            ],
            temperature: 0.7,
            max_tokens: 200,
          }),
        }
      );

      if (!res.ok) throw new Error('API request failed');

      const data = await res.json();
      const botText = data?.choices?.[0]?.message?.content || 'Unable to respond.';

      setMessages((prev) => [...prev, { role: 'bot', text: botText }]);
    } catch {
      setMessages((prev) => [...prev, { role: 'bot', text: 'Service unavailable. Please try again later.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-brand-gold text-brand-dark rounded-full flex items-center justify-center shadow-xl hover:bg-white transition z-50"
      >
        {isOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 h-[500px] bg-brand-charcoal border border-gray-700 rounded-lg shadow-2xl flex flex-col overflow-hidden"
          >
            <div className="bg-brand-gold/10 border-b border-gray-700 px-4 py-3 flex items-center space-x-2">
              <div className="w-8 h-8 bg-brand-gold flex items-center justify-center text-brand-dark">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div>
                <p className="text-white text-sm font-semibold">Attar AI</p>
                <p className="text-gray-400 text-xs">Attar & Oud Specialist</p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[80%] px-3 py-2 rounded-lg text-sm ${
                      msg.role === 'user'
                        ? 'bg-brand-gold text-brand-dark'
                        : 'bg-gray-800 text-gray-200'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-gray-800 text-gray-200 px-3 py-2 rounded-lg text-sm">
                    <span className="inline-flex space-x-1">
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            <form onSubmit={handleSend} className="border-t border-gray-700 p-3 flex space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about fragrances..."
                className="flex-1 bg-black border border-gray-600 text-white text-sm rounded-sm px-3 py-2 focus:outline-none focus:border-brand-gold transition"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="bg-brand-gold text-brand-dark px-3 py-2 rounded-sm text-sm font-semibold hover:bg-white transition disabled:opacity-50"
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
