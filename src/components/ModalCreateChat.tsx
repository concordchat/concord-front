import { useState } from "react";
import { X, Hash } from "lucide-react";

interface ModalCreateChatProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (name: string) => void;
}

export function ModalCreateChat({ isOpen, onClose, onConfirm }: ModalCreateChatProps) {
  const [chatName, setChatName] = useState("");

  const isValid = chatName.trim().length > 3;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0A0A0B] rounded-xl w-full max-w-md text-[#E4E4E7] shadow-2xl border border-[#1F1F23]">
        <div className="flex justify-between items-center p-4 border-b border-[#1F1F23]">
          <h2 className="text-xl font-semibold">Nome do Canal</h2>
          <button 
            onClick={onClose} 
            className="p-2 text-[#9D9DA7] hover:text-[#E4E4E7] hover:bg-[#1F1F23] rounded-lg transition-all duration-200"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Hash size={16} className="text-[#9D9DA7]" />
            </div>
            <input
              type="text"
              placeholder="Digite o nome do canal..."
              value={chatName}
              onChange={(e) => setChatName(e.target.value)}
              className="w-full bg-[#1F1F23] rounded-lg pl-9 pr-4 py-2.5 text-[#E4E4E7] placeholder-[#9D9DA7] focus:outline-none focus:ring-2 focus:ring-[#2A2A2F] transition-all duration-200"
            />
          </div>
          {!isValid && chatName.length > 0 && (
            <p className="text-[#FF4B4B] text-sm mt-2">O nome do canal deve ter pelo menos 4 caracteres.</p>
          )}
        </div>

        <div className="p-4 border-t border-[#1F1F23]">
          <button
            onClick={() => {
              if (isValid) {
                onConfirm(chatName);
                onClose();
              }
            }}
            disabled={!isValid}
            className={`w-full rounded-lg py-2.5 font-medium transition-all duration-200
              ${isValid 
                ? "bg-[#34AB70] hover:bg-[#34AB70]/90 cursor-pointer" 
                : "bg-[#1F1F23] text-[#9D9DA7] cursor-not-allowed"}`}
          >
            Criar Canal
          </button>
        </div>
      </div>
    </div>
  );
}
