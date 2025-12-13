import React, { useState } from 'react';
import { motion, Variants } from 'framer-motion';
import { InstagramIcon } from './icons/InstagramIcon';
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

    const whatsappMessage = `Hello Darul Attar,\n\nMy name is *${name}*.\nMy email is ${email || 'not provided'}.\n\nMy message is:\n_"${message}"_`;
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
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <section ref={ref} className="bg-black py-24 border-t border-gray-900">
      <div className="max-w-screen-2xl mx-auto px-8 sm:px-12 lg:px-16">
        <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
        >
          <span className="text-brand-gold text-xs font-bold tracking-widest uppercase">Location</span>
          <h2 className="text-4xl md:text-5xl font-thin text-white font-serif mt-3 mb-4">
            Visit DarulAttar in <span className="italic text-gray-500">Arumbakkam</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          
          {/* Address & Direct Contact - Minimalist Text Layout */}
          <motion.div 
            className="space-y-12 pt-4"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div variants={itemVariants}>
                <h3 className="text-xl font-serif text-white mb-6 border-l-2 border-brand-gold pl-4">Store Address</h3>
                <address className="text-gray-400 not-italic space-y-2 text-lg font-light leading-relaxed pl-4">
                    <p className="text-white font-medium">Darul Attar</p>
                    <p>8/26, Water Tank Road,</p>
                    <p>MMDA Colony, Arumbakkam,</p>
                    <p>Chennai - 600106, Tamil Nadu.</p>
                </address>
            </motion.div>

            <motion.div variants={itemVariants}>
                <h3 className="text-xl font-serif text-white mb-6 border-l-2 border-brand-gold pl-4">Direct Lines</h3>
                <div className="space-y-4 pl-4">
                    <div className="group">
                        <span className="block text-xs text-gray-600 uppercase tracking-wider mb-1">Phone / WhatsApp</span>
                        <a href="tel:+919578994377" className="text-white text-lg hover:text-brand-gold transition">+91 95789 94377</a>
                    </div>
                    <div className="group">
                        <span className="block text-xs text-gray-600 uppercase tracking-wider mb-1">Email</span>
                        <a href="mailto:contact@darulattar.com" className="text-white text-lg hover:text-brand-gold transition">contact@darulattar.com</a>
                    </div>
                </div>
            </motion.div>

            <motion.div variants={itemVariants} className="pl-4">
                <a 
                    href="https://wa.me/919578994377" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-flex items-center space-x-3 text-brand-gold border border-brand-gold/30 px-8 py-4 hover:bg-brand-gold hover:text-black transition-all duration-300"
                >
                    <WhatsappIcon />
                    <span className="text-sm font-bold tracking-widest uppercase">Chat Now</span>
                </a>
            </motion.div>
          </motion.div>

          {/* Contact Form - Clean & Dark */}
          <motion.div
             initial={{ opacity: 0, x: 20 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
             transition={{ duration: 0.6 }}
             className="bg-[#0a0a0a] p-8 lg:p-12 border border-gray-800"
          >
            <h3 className="text-2xl font-serif text-white mb-8">Send a Message</h3>
            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="relative">
                    <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} className="block w-full bg-transparent border-b border-gray-700 text-white py-2 focus:border-brand-gold outline-none transition-colors rounded-none placeholder-transparent peer" placeholder="Name" required />
                    <label htmlFor="name" className="absolute left-0 -top-3.5 text-gray-500 text-xs transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-gray-400 peer-focus:text-xs">Name</label>
                </div>
                <div className="relative">
                    <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} className="block w-full bg-transparent border-b border-gray-700 text-white py-2 focus:border-brand-gold outline-none transition-colors rounded-none placeholder-transparent peer" placeholder="Email" />
                    <label htmlFor="email" className="absolute left-0 -top-3.5 text-gray-500 text-xs transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-gray-400 peer-focus:text-xs">Email (Optional)</label>
                </div>
                <div className="relative">
                    <textarea id="message" name="message" rows={4} value={formData.message} onChange={handleInputChange} className="block w-full bg-transparent border-b border-gray-700 text-white py-2 focus:border-brand-gold outline-none transition-colors rounded-none placeholder-transparent peer resize-none" placeholder="Message" required></textarea>
                    <label htmlFor="message" className="absolute left-0 -top-3.5 text-gray-500 text-xs transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-gray-400 peer-focus:text-xs">Inquiry</label>
                </div>
                <button 
                    type="submit" 
                    className="w-full bg-white text-black py-4 font-bold tracking-widest text-sm uppercase hover:bg-brand-gold transition-colors duration-300 mt-6"
                >
                    Send Inquiry
                </button>
            </form>
          </motion.div>

        </div>
      </div>
    </section>
  );
});

export default Contact;