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
    error: <XIcon />, // Placeholder for error icon
  };

  const icon = icons[toast.type as keyof typeof icons] || <InfoIcon />;
  
  const colors = {
    success: 'border-green-500',
    info: 'border-blue-500',
    error: 'border-red-500'
  }
  const borderColor = colors[toast.type as keyof typeof colors] || 'border-gray-500';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 50, scale: 0.3 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.5 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      className={`relative flex items-start w-full max-w-sm p-4 bg-black/80 backdrop-blur-lg border-l-4 ${borderColor} shadow-2xl shadow-black/50`}
    >
      <div className="flex-shrink-0 mr-3 mt-0.5 text-white">
        {icon}
      </div>
      <div className="flex-grow text-gray-200">
        {toast.message}
      </div>
      <button onClick={() => onRemove(toast.id)} className="ml-4 flex-shrink-0 text-gray-500 hover:text-white transition">
        <XIcon />
      </button>
    </motion.div>
  );
};

const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToasts();

  return (
    <div className="fixed bottom-4 right-4 z-[9999] w-full max-w-sm">
      <AnimatePresence initial={false}>
        <div className="flex flex-col items-end space-y-3">
          {toasts.map((toast) => (
            <Toast key={toast.id} toast={toast} onRemove={removeToast} />
          ))}
        </div>
      </AnimatePresence>
    </div>
  );
};

export default ToastContainer;
