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
    <section ref={ref} className="bg-[#FDFBF7] py-24 border-t border-gray-200">
      <div className="max-w-screen-2xl mx-auto px-8 sm:px-12 lg:px-16">
        <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
        >
          <span className="text-brand-gold text-xs font-bold tracking-widest uppercase">Location</span>
          <h2 className="text-4xl md:text-5xl font-serif text-gray-950 mt-3 mb-4">
            Visit DarulAttar in <span className="italic text-brand-gold">Thousand Lights</span>
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
                <h3 className="text-xl font-serif text-gray-950 mb-6 border-l-2 border-brand-gold pl-4">Store Address</h3>
                <address className="text-gray-700 not-italic space-y-2 text-lg font-normal leading-relaxed pl-4">
                    <p className="text-black font-semibold">Darul Attar</p>
                    <p>#144 Aziz Mulk, 1st Street,</p>
                    <p>Greams Road, Thousand Lights,</p>
                    <p>Chennai - 600006, Tamil Nadu.</p>
                </address>
            </motion.div>

            <motion.div variants={itemVariants}>
                <h3 className="text-xl font-serif text-gray-950 mb-6 border-l-2 border-brand-gold pl-4">Direct Lines</h3>
                <div className="space-y-4 pl-4">
                    <div className="group">
                        <span className="block text-xs text-gray-500 uppercase tracking-wider mb-1 font-semibold">Phone / WhatsApp</span>
                        <a href="tel:+919578994377" className="text-gray-900 text-lg hover:text-brand-gold transition font-medium">+91 95789 94377</a>
                    </div>
                    <div className="group">
                        <span className="block text-xs text-gray-500 uppercase tracking-wider mb-1 font-semibold">Email</span>
                        <a href="mailto:contact@darulattar.com" className="text-gray-900 text-lg hover:text-brand-gold transition font-medium">contact@darulattar.com</a>
                    </div>
                </div>
            </motion.div>

            <motion.div variants={itemVariants} className="pl-4">
                <a 
                    href="https://wa.me/919578994377" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-flex items-center space-x-3 text-black border-2 border-black px-8 py-4 hover:bg-black hover:text-white transition-all duration-300 font-bold"
                >
                    <WhatsappIcon />
                    <span className="text-sm font-bold tracking-widest uppercase">Chat Now</span>
                </a>
            </motion.div>
          </motion.div>

          {/* Contact Form - Clean White Card */}
          <motion.div
             initial={{ opacity: 0, x: 20 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
             transition={{ duration: 0.6 }}
             className="bg-white p-8 lg:p-12 border border-gray-200 shadow-lg rounded-sm"
          >
            <h3 className="text-2xl font-serif text-gray-950 mb-8">Send a Message</h3>
            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="relative">
                    <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} className="block w-full bg-transparent border-b border-gray-300 text-gray-900 py-2 focus:border-black outline-none transition-colors rounded-none placeholder-transparent peer" placeholder="Name" required />
                    <label htmlFor="name" className="absolute left-0 -top-3.5 text-gray-500 text-xs transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-black peer-focus:text-xs">Name</label>
                </div>
                <div className="relative">
                    <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} className="block w-full bg-transparent border-b border-gray-300 text-gray-900 py-2 focus:border-black outline-none transition-colors rounded-none placeholder-transparent peer" placeholder="Email" />
                    <label htmlFor="email" className="absolute left-0 -top-3.5 text-gray-500 text-xs transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-black peer-focus:text-xs">Email (Optional)</label>
                </div>
                <div className="relative">
                    <textarea id="message" name="message" rows={4} value={formData.message} onChange={handleInputChange} className="block w-full bg-transparent border-b border-gray-300 text-gray-900 py-2 focus:border-black outline-none transition-colors rounded-none placeholder-transparent peer resize-none" placeholder="Message" required></textarea>
                    <label htmlFor="message" className="absolute left-0 -top-3.5 text-gray-500 text-xs transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-black peer-focus:text-xs">Inquiry</label>
                </div>
                <button 
                    type="submit" 
                    className="w-full bg-black text-white py-4 font-bold tracking-widest text-sm uppercase hover:bg-brand-gold hover:text-black transition-colors duration-300 mt-6 shadow-md"
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