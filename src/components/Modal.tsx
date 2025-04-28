import React from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[#0A0A0B] rounded-xl shadow-2xl w-full max-w-md mx-4 border border-[#1F1F23]">
        <div className="flex items-center justify-between p-4 border-b border-[#1F1F23]">
          <h3 className="text-lg font-semibold text-[#E4E4E7]">{title}</h3>
          <button
            onClick={onClose}
            className="p-2 text-[#9D9DA7] hover:text-[#E4E4E7] hover:bg-[#1F1F23] rounded-lg transition-all duration-200"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};