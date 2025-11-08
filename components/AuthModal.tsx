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

// FIXME: Replace with your actual Google Client ID from the Google Cloud Console.
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
            console.error("Google Identity Services script not loaded.");
            addToast("Could not load Google Sign-In.", "error");
            return;
        }

        try {
            window.google.accounts.id.initialize({
                client_id: GOOGLE_CLIENT_ID,
                callback: async (response) => {
                    setIsProcessing(true);
                    try {
                        await handleGoogleCredentialResponse(response);
                        addToast('Login successful!', 'success');
                        onClose();
                    } catch (error: any) {
                        addToast(error.message || "Login failed.", "error");
                    } finally {
                        setIsProcessing(false);
                    }
                },
            });
            
            window.google.accounts.id.renderButton(
                googleButtonRef.current,
                { theme: 'outline', size: 'large', type: 'standard', text: 'signin_with' } 
            );

        } catch(error) {
            console.error("Error initializing Google Sign-In:", error);
            addToast("Could not initialize Google Sign-In.", "error");
        }
    }
  }, [isOpen, handleGoogleCredentialResponse, addToast, onClose]);

  const backdropVariants = {
    visible: { opacity: 1 },
    hidden: { opacity: 0 },
  };

  const modalVariants = {
    visible: { opacity: 1, y: 0, scale: 1 },
    hidden: { opacity: 0, y: 50, scale: 0.9 },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          onClick={onClose}
        >
          <motion.div
            className="bg-brand-dark border border-gray-800 w-full max-w-sm relative"
            variants={modalVariants}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white">
              <XIcon />
            </button>
            <div className="p-8 sm:p-12 text-center">
                <h2 className="text-2xl font-serif text-white mb-2">Join or Sign In</h2>
                <p className="text-gray-400 mb-8">Continue with Google to post reviews and manage your account.</p>
                
                {isProcessing ? (
                     <div className="flex justify-center items-center h-10">
                        <p className="text-gray-300">Processing...</p>
                    </div>
                ) : (
                    <div ref={googleButtonRef} className="flex justify-center"></div>
                )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;
