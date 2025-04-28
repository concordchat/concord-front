import React, { useState } from "react";
import { X, Plus, Hash, Bell } from "lucide-react";
import { SidebarState, UserAttr } from "../types";
import { ModalUsers } from "./ModalUsers";
import { ModalCreateChat } from "./ModalCreateChat";
import { createChatroom } from "../services/chatRoomService";
import { Channel } from "../types";
import { useGeneral } from "../hooks/useGeneral";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: SidebarState["activeTab"];
  setActiveTab: (tab: SidebarState["activeTab"]) => void;
  onChannelSelect: (position: number) => void;
  currentChannel: Channel | null;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  onChannelSelect,
  currentChannel
}) => {
  const { chatRooms, unreadMessages  } = useGeneral();
  const [isModalUsersOpen, setIsModalUsersOpen] = useState(false);
  const [isModalChatOpen, setIsModalChatOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<UserAttr[]>([]);

  const handleConfirmUsers = (users: UserAttr[]) => {
    setSelectedUsers(users);
    setIsModalUsersOpen(false);
    setIsModalChatOpen(true);
  };

  const handleConfirmChat = async (name: string) => {
    const chatroomPromise = createChatroom(name, selectedUsers.map((u) => u.id));

    try {
      await chatroomPromise;
    } catch (error) {
      console.error("error creating chatroom:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="w-80 bg-[#0A0A0B] border-r border-[#1F1F23] shadow-lg">
        <div className="h-16 flex items-center justify-between px-6 border-b border-[#1F1F23]">
          <h2 className="font-bold text-[#E4E4E7] text-xl">Concord</h2>
          <button 
            onClick={onClose} 
            className="p-2 text-[#9D9DA7] hover:text-[#E4E4E7] hover:bg-[#1F1F23] rounded-lg transition-all duration-200"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4">
          <div className="space-y-1">
            <h3 className="text-xs font-semibold text-[#9D9DA7] uppercase tracking-wider mb-3 px-2">
              Canais
            </h3>
            {chatRooms.map((room, index) => (
              <button
                key={room.id}
                onClick={() => {
                  onChannelSelect(index);
                }}
                className={`cursor-pointer w-full text-left px-3 py-2 rounded-lg transition-all duration-200 flex items-center justify-between ${
                  room.id === currentChannel?.id 
                    ? "bg-[#1F1F23] text-[#E4E4E7]"
                    : "hover:bg-[#1F1F23]/50 text-[#9D9DA7] hover:text-[#E4E4E7]"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Hash size={16} className="text-[#9D9DA7]" />
                  <span>{room.attributes.name}</span>
                </div>
                {unreadMessages[room.id] > 0 && (
                  <span className="bg-[#FF4B4B] text-white text-xs rounded-full px-2 py-1 flex items-center gap-1">
                    <Bell size={12} />
                    {unreadMessages[room.id]}
                  </span>
                )}
              </button>
            ))}
          </div>
          <div className="mt-4">
            <button
              onClick={() => setIsModalUsersOpen(true)}
              className="cursor-pointer flex items-center gap-2 bg-[#34AB70] hover:bg-[#34AB70]/90 px-4 py-2.5 rounded-lg transition-all duration-200 w-full"
            >
              <Plus size={20} className="text-white" />
              <span className="text-white font-medium">Novo Canal</span>
            </button>
          </div>
        </div>
      </div>
      <div className="flex-1 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <ModalUsers isOpen={isModalUsersOpen} onClose={() => setIsModalUsersOpen(false)} onConfirm={handleConfirmUsers} maxUsers={7} />
      <ModalCreateChat isOpen={isModalChatOpen} onClose={() => setIsModalChatOpen(false)} onConfirm={handleConfirmChat} />
    </div>
  );
};
