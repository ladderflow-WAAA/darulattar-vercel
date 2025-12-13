import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useToasts } from '../contexts/ToastContext';
import { SuccessIcon } from './icons/SuccessIcon';
import { XIcon } from './icons/XIcon';
import { InfoIcon } from './icons/InfoIcon';

const Toast: React.FC<{ toast: { id: number; message: string; type: string }, onRemove: (id: number) => void }> = ({ toast, onRemove }) => {
  const icons = {
    success: <SuccessIcon />,
    info: <InfoIcon />,
    error: <XIcon />, 
  };

  const icon = icons[toast.type as keyof typeof icons] || <InfoIcon />;
  
  // Minimalist borders - mostly using gold or error red
  const borders = {
    success: 'border-brand-gold', 
    info: 'border-gray-700',
    error: 'border-red-900'
  }
  const borderColor = borders[toast.type as keyof typeof borders] || 'border-gray-700';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={`relative flex items-center w-full max-w-sm p-4 bg-[#111] backdrop-blur-md border-l-2 ${borderColor} shadow-2xl rounded-sm`}
    >
      <div className={`flex-shrink-0 mr-4 ${toast.type === 'success' ? 'text-brand-gold' : toast.type === 'error' ? 'text-red-700' : 'text-gray-400'}`}>
        {icon}
      </div>
      <div className="flex-grow text-gray-200 text-sm font-medium tracking-wide">
        {toast.message}
      </div>
      <button onClick={() => onRemove(toast.id)} className="ml-4 flex-shrink-0 text-gray-600 hover:text-white transition">
        <XIcon />
      </button>
    </motion.div>
  );
};

const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToasts();

  return (
    <div className="fixed bottom-6 right-6 z-[9999] w-full max-w-sm flex flex-col gap-3 pointer-events-none">
      <AnimatePresence initial={false} mode="popLayout">
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
             <Toast toast={toast} onRemove={removeToast} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ToastContainer;