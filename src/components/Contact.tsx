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
    setFormData({ name: '', email: '', message: '' }); // Clear form
  };
  
  const formContainerVariants: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
  };

  const formItemVariants: Variants = {
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };
  
  const infoContainerVariants: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.2, delayChildren: 0.4 } },
  };

  const infoItemVariants: Variants = {
    hidden: { opacity: 0, x: 30 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  return (
    <section ref={ref} className="bg-gray-900/50 py-24 sm:py-32">
      <div className="max-w-screen-2xl mx-auto px-8 sm:px-12 lg:px-16">
        <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.8 }}
        >
          <h2 className="text-5xl md:text-6xl font-thin text-white font-serif">
            Connect With <span className="italic text-brand-gold">Us</span>
          </h2>
          <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto font-light">
            We're here to assist with questions about our scents, your order, or our traditions. Reach out, and we'll be delighted to help.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Contact Form */}
          <motion.form 
            onSubmit={handleSubmit}
            className="w-full"
            variants={formContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <motion.div variants={formItemVariants}>
                <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-2">Name</label>
                <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} className="block w-full px-4 py-3 bg-brand-dark border-gray-700 rounded-sm focus:ring-brand-gold focus:border-brand-gold transition" required />
              </motion.div>
              <motion.div variants={formItemVariants}>
                <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-2">Email</label>
                <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} className="block w-full px-4 py-3 bg-brand-dark border-gray-700 rounded-sm focus:ring-brand-gold focus:border-brand-gold transition" />
              </motion.div>
            </div>
            <motion.div variants={formItemVariants} className="mt-6">
              <label htmlFor="message" className="block text-sm font-medium text-gray-400 mb-2">Message</label>
              <textarea id="message" name="message" rows={5} value={formData.message} onChange={handleInputChange} className="block w-full px-4 py-3 bg-brand-dark border-gray-700 rounded-sm focus:ring-brand-gold focus:border-brand-gold transition" required></textarea>
            </motion.div>
            <motion.div variants={formItemVariants} className="mt-8">
              <motion.button 
                type="submit" 
                className="bg-brand-gold text-brand-dark py-4 px-10 tracking-widest text-sm font-bold uppercase"
                whileHover={{ scale: 1.05, backgroundColor: '#FFFFFF' }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                SEND MESSAGE
              </motion.button>
            </motion.div>
          </motion.form>

          {/* Contact Information */}
          <motion.div 
            className="space-y-8 lg:mt-2"
            variants={infoContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <motion.div variants={infoItemVariants}>
              <h3 className="text-lg font-semibold text-white flex items-center space-x-3">
                <WhatsappIcon />
                <span>WhatsApp</span>
              </h3>
              <a href="https://wa.me/919578994377" target="_blank" rel="noopener noreferrer" className="text-lg text-brand-gold hover:underline">9578994377</a>
              <p className="mt-1 text-gray-400 font-light">Message us for a quick response.</p>
            </motion.div>
            <motion.div variants={infoItemVariants}>
              <h3 className="text-lg font-semibold text-white flex items-center space-x-3">
                <InstagramIcon />
                <span>Instagram</span>
              </h3>
              <a href="https://instagram.com/darulattar" target="_blank" rel="noopener noreferrer" className="text-lg text-brand-gold hover:underline">@darulattar</a>
              <p className="mt-1 text-gray-400 font-light">Follow our journey and new arrivals.</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
});

export default Contact;
