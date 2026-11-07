import React, { useState } from 'react';
import { motion, type Variants } from 'motion/react';
import { WhatsappIcon } from './icons/WhatsappIcon';

const Contact = React.forwardRef<HTMLElement, {}>((props, ref) => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { name, email, message } = formData;
    
    if (!name.trim() || !message.trim()) {
      alert('Please fill in your name and message.');
      return;
    }

    const whatsappMessage = `Salam Darul Attar,\n\nMy name is *${name}*.\nMy email is ${email || 'not provided'}.\n\nMy inquiry is:\n_"${message}"_`;
    const encodedMessage = encodeURIComponent(whatsappMessage);
    const whatsappUrl = `https://wa.me/919578994377?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
    setFormData({ name: '', email: '', message: '' }); 
  };
  
  const containerVariants: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
  };

  return (
    <section ref={ref} className="bg-brand-cream py-24 sm:py-32 border-t border-gray-200/80">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 lg:px-12">
        <motion.div 
          className="max-w-3xl mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-serif text-brand-charcoal">
            Visit the Boutique in <span className="font-editorial italic font-normal text-brand-gold-dark">Thousand Lights</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-gray-600 font-sans leading-relaxed">
            Experience olfactory consultation in person or coordinate private gifting and bulk bridal orders with our master blenders.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Boutique Coordinates */}
          <motion.div 
            className="lg:col-span-5 space-y-10"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div variants={itemVariants} className="p-8 bg-white rounded-2xl border border-gray-200/80 shadow-xs">
              <h3 className="text-xl font-serif text-brand-charcoal mb-4">Storefront &amp; Atelier</h3>
              <address className="text-gray-700 not-italic space-y-1.5 text-base font-sans leading-relaxed">
                <p className="text-black font-semibold text-lg">Darul Attar</p>
                <p>#144 Aziz Mulk, 1st Street,</p>
                <p>Greams Road, Thousand Lights,</p>
                <p>Chennai - 600006, Tamil Nadu, India.</p>
              </address>
              <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                <span className="text-xs font-mono text-gray-500">Mon - Sun: 10:00 AM – 9:00 PM</span>
                <a 
                  href="https://maps.google.com/?q=144+Aziz+Mulk+1st+Street+Greams+Road+Thousand+Lights+Chennai+600006"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-brand-gold-dark hover:underline tracking-wider uppercase"
                >
                  Map Coordinates ↗
                </a>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="p-8 bg-white rounded-2xl border border-gray-200/80 shadow-xs space-y-6">
              <h3 className="text-xl font-serif text-brand-charcoal mb-2">Direct Concierge</h3>
              
              <div>
                <span className="block text-[11px] font-mono text-gray-400 uppercase tracking-widest mb-1 font-semibold">Phone / WhatsApp</span>
                <a href="tel:+919578994377" className="text-gray-900 font-mono text-base hover:text-brand-gold-dark transition font-medium">
                  +91 95789 94377
                </a>
              </div>

              <div>
                <span className="block text-[11px] font-mono text-gray-400 uppercase tracking-widest mb-1 font-semibold">Email Desk</span>
                <a href="mailto:contact@darulattar.com" className="text-gray-900 font-sans text-base hover:text-brand-gold-dark transition font-medium">
                  contact@darulattar.com
                </a>
              </div>

              <div className="pt-2">
                <a 
                  href="https://wa.me/919578994377" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center justify-center space-x-3 w-full text-brand-charcoal bg-brand-gold-subtle border border-brand-gold/60 py-3.5 px-6 rounded-full hover:bg-brand-charcoal hover:text-white transition-all duration-300 font-semibold text-xs tracking-[0.16em] uppercase shadow-2xs"
                >
                  <WhatsappIcon />
                  <span>Start WhatsApp Consultation</span>
                </a>
              </div>
            </motion.div>
          </motion.div>

          {/* Quick Message Form */}
          <motion.div 
            className="lg:col-span-7 bg-white p-8 sm:p-12 rounded-2xl border border-gray-200/90 shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <h3 className="text-2xl font-serif text-brand-charcoal mb-2">Send an Inquiry</h3>
            <p className="text-sm text-gray-600 mb-8 font-sans">
              Connect directly with our perfumers regarding fragrance recommendations, custom bottles, or bridal samplers.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-xs font-mono uppercase tracking-widest text-gray-700 font-semibold mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g. Tariq Ahmed"
                  className="w-full px-4 py-3 bg-brand-ivory border border-gray-200 rounded-xl text-gray-900 text-sm focus:outline-none focus:border-brand-gold-dark focus:ring-1 focus:ring-brand-gold-dark transition-all"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-xs font-mono uppercase tracking-widest text-gray-700 font-semibold mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="e.g. name@example.com"
                  className="w-full px-4 py-3 bg-brand-ivory border border-gray-200 rounded-xl text-gray-900 text-sm focus:outline-none focus:border-brand-gold-dark focus:ring-1 focus:ring-brand-gold-dark transition-all"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-xs font-mono uppercase tracking-widest text-gray-700 font-semibold mb-2">
                  Message / Fragrance Notes Requested *
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  required
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Inquire about specific attars, oud provenance, or bulk orders..."
                  className="w-full px-4 py-3 bg-brand-ivory border border-gray-200 rounded-xl text-gray-900 text-sm focus:outline-none focus:border-brand-gold-dark focus:ring-1 focus:ring-brand-gold-dark transition-all resize-none"
                />
              </div>

              <motion.button
                type="submit"
                className="w-full py-4 px-8 bg-brand-charcoal text-white hover:bg-brand-gold-dark rounded-full text-xs tracking-[0.18em] uppercase font-semibold transition-all duration-300 shadow-elevation-1 hover:shadow-luxury"
                whileTap={{ scale: 0.98 }}
              >
                Forward Message to WhatsApp Desk
              </motion.button>
            </form>
          </motion.div>

        </div>
      </div>
    </section>
  );
});

export default Contact;
