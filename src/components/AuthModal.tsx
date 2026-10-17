import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';
import { XIcon } from './icons/XIcon';
import { useToasts } from '../contexts/ToastContext';

declare global {
  interface Window {
    google: any;
  }
}

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
            
            window.google.accounts.id.renderButton(
                googleButtonRef.current,
                { theme: 'outline', size: 'large', type: 'standard', shape: 'rectangular', text: 'continue_with', logo_alignment: 'left' } 
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
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-[100] flex items-center justify-center p-4 font-sans text-gray-900"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          onClick={onClose}
        >
          <motion.div
            className="bg-white border border-gray-200 w-full max-w-sm relative shadow-2xl rounded-sm overflow-hidden"
            variants={modalVariants}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Gold Top Accent */}
            <div className="absolute top-0 left-0 w-full h-1 bg-[#C0A080]"></div>

            <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-black transition-colors p-2">
              <XIcon />
            </button>
            
            <div className="p-8 text-center">
                <div className="mb-6">
                    <span className="text-[#8C6D47] text-[10px] font-bold tracking-[0.2em] uppercase block mb-1">Customer Access</span>
                    <h2 className="text-2xl font-serif text-gray-900 font-bold">Darul Attar</h2>
                </div>
                
                <p className="text-gray-600 mb-8 text-xs leading-relaxed px-4">
                    Sign in to leave reviews and track your fragrance collection.
                </p>
                
                {isProcessing ? (
                     <div className="flex justify-center items-center h-[40px] bg-gray-50 rounded border border-gray-200">
                        <p className="text-gray-500 text-xs animate-pulse font-medium">Verifying credentials...</p>
                    </div>
                ) : (
                    <div ref={googleButtonRef} className="flex justify-center w-full min-h-[40px] overflow-hidden rounded-sm"></div>
                )}
                
                <p className="mt-6 text-[10px] text-gray-400 uppercase tracking-wider font-semibold">
                    Encrypted Authentication
                </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;