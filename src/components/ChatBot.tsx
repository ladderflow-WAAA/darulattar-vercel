import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  role: 'user' | 'bot';
  text: string;
}

const SYSTEM_PROMPT = `You are Attar AI, the official fragrance expert for Darul Attar, a premium attar and oud house based in Chennai, India. Your role is to help customers discover, understand, and choose the perfect fragrance.

## YOUR EXPERTISE
- Attars, oud oils, perfume oils — types, origins, extraction methods
- Scent profiles: top notes, heart notes, base notes
- Fragrance families: floral, woody, musk, gourmand, spicy, fresh, aquatic
- How to choose a fragrance by season, occasion, gender preference, or budget
- Application tips: pulse points, longevity, layering techniques
- Storage: keep away from sunlight, heat, and humidity
- Differences: oil-based vs alcohol-based, attar vs perfume, natural vs synthetic
- History: Kannauj attar tradition, Indian perfumery, Middle Eastern oud culture

## LANGUAGE
- Respond in English by default
- If the user writes in Tamil or Tanglish (Tamil+English mix), respond in Tanglish naturally
- Tanglish example: "Ivanaga 3ml variant ₹120 ku available iruku. Top notes la Bergamot, Lavender irukum"
- Keep responses casual and warm, not robotic

## PRODUCT RECOMMENDATIONS
When asked for recommendations:
1. Ask about their preference: floral/woody/fresh/sweet/spicy
2. Ask about occasion: daily wear, special event, gift, travel
3. Suggest 1-2 products with specific variant (size) and price
4. Mention key notes so they know what to expect
5. Price range: most products are ₹120-₹450 (6ml-12ml)

## RESPONSE RULES
- Maximum 4 sentences. Be concise.
- No markdown formatting. No asterisks, no bullet points.
- Be warm and friendly, like a knowledgeable shopkeeper
- If asked something outside fragrances say: "Naa attar matum fragrance related questions ku dhaan answer pannuven. Please ask me about perfumes, attars, or scents!"
- If you don't know a specific product, suggest similar ones from Darul Attar's collection
- Never mention competitors by name — just describe the scent profile

## CONTEXT
Darul Attar is based in Chennai, India. Products are premium attars and perfume oils, alcohol-free, concentrated. Shipping across India. Available in 3ml, 6ml, and 12ml glass roll-on bottles.`;

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
      const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY || process.env.OPENROUTER_API_KEY || '';
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
