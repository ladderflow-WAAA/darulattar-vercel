import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { XIcon } from './icons/XIcon';
import { useToasts } from '../contexts/ToastContext';

declare global {
  interface Window {
    google: any;
  }
}

// Ensure this ID matches your Google Cloud Console project
const GOOGLE_CLIENT_ID = '15535130855-8qn4pgqaf206rihsrqneuki45kgn7ab6.apps.googleusercontent.com';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { handleGoogleCredentialResponse } = useAuth();
  const { addToast } = useToasts();
  const [isProcessing, setIsProcessing] = useState(false);
  const googleButtonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && googleButtonRef.current) {
        if (typeof window.google === 'undefined' || !window.google.accounts) {
            addToast("Google Sign-In is temporarily unavailable.", "error");
            return;
        }

        try {
            window.google.accounts.id.initialize({
                client_id: GOOGLE_CLIENT_ID,
                callback: async (response) => {
                    setIsProcessing(true);
                    try {
                        await handleGoogleCredentialResponse(response);
                        addToast('Welcome back to Darul Attar.', 'success');
                        onClose();
                    } catch (error: any) {
                        addToast(error.message || "Authentication failed.", "error");
                    } finally {
                        setIsProcessing(false);
                    }
                },
            });
            
            // Render the button with a dark theme to match the modal
            window.google.accounts.id.renderButton(
                googleButtonRef.current,
                { theme: 'filled_black', size: 'large', type: 'standard', shape: 'rectangular', text: 'continue_with', logo_alignment: 'left' } 
            );

        } catch(error) {
            console.error(error);
            addToast("Authentication error.", "error");
        }
    }
  }, [isOpen, handleGoogleCredentialResponse, addToast, onClose]);

  const backdropVariants = {
    visible: { opacity: 1 },
    hidden: { opacity: 0 },
  };

  const modalVariants = {
    visible: { opacity: 1, y: 0, scale: 1 },
    hidden: { opacity: 0, y: 30, scale: 0.95 },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          onClick={onClose}
        >
          <motion.div
            className="bg-[#0a0a0a] border border-gray-800 w-full max-w-sm relative shadow-2xl rounded-sm overflow-hidden ring-1 ring-white/10"
            variants={modalVariants}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Gold Top Border Accent */}
            <div className="absolute top-0 left-0 w-full h-0.5 bg-brand-gold"></div>

            <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors p-2">
              <XIcon />
            </button>
            
            <div className="p-8 text-center">
                <div className="mb-6">
                    <span className="text-brand-gold text-[10px] font-bold tracking-[0.2em] uppercase block mb-2">Member Access</span>
                    <h2 className="text-2xl font-serif text-white">Darul Attar</h2>
                </div>
                
                <p className="text-gray-400 mb-8 font-light text-sm leading-relaxed px-4">
                    Sign in to manage your collection and leave reviews for our Chennai store.
                </p>
                
                {isProcessing ? (
                     <div className="flex justify-center items-center h-[40px] bg-gray-900 rounded border border-gray-800">
                        <p className="text-gray-400 text-sm animate-pulse">Verifying...</p>
                    </div>
                ) : (
                    <div ref={googleButtonRef} className="flex justify-center w-full min-h-[40px] overflow-hidden rounded-sm"></div>
                )}
                
                <p className="mt-6 text-[10px] text-gray-600 uppercase tracking-wider">
                    Secure Login
                </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;