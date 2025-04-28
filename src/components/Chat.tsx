import { useState, useRef, useEffect } from 'react';
import { Menu, Users, Hash, Home, LogOut, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { Sidebar } from './Sidebar';
import { Modal } from './Modal';
import { useAuth } from '../hooks/useAuth';
import { useGeneral } from '../hooks/useGeneral';
import type { SidebarState, Message } from '../types';
import { UserAvatar } from './UserAvatar';
import { createMessage } from '../services/messageService';
import { ModalUsersList } from './ModalListUsers';
import ConcordLogo from "../assets/concord.png";

export function Chat() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarState, setSidebarState] = useState<SidebarState>({
    isOpen: false,
    activeTab: 'channels',
  });
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isUsersModalOpen, setIsUsersModalOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { chatRooms, setCurrentChatRoomId, currentChannelIndex, setCurrentChannelIndex, unreadMessages } = useGeneral();
  const messages = chatRooms[currentChannelIndex - 1]?.attributes.messages;

  const totalUnreadMessages = Object.values(unreadMessages as Record<string, number>).reduce((acc: number, count: number) => acc + count, 0) as number;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentChannelIndex, messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages])

  const homeReturn = () => {
    setCurrentChannelIndex(null);
    setCurrentChatRoomId(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSendMessage = async (content: string) => {
    if (!user || !currentChannelIndex) {
      console.error("User or current channel index is missing");
      return;
    }
    try {
      await createMessage(content, chatRooms[currentChannelIndex - 1].id);
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const handleChannelSelect = (position: number) => {
    setCurrentChannelIndex(position + 1);
    setSidebarState({ ...sidebarState, isOpen: false });
    setCurrentChatRoomId(chatRooms[position]?.id);
  };

  const userColor = user?.color;

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-[#E4E4E7] flex">
      <Sidebar
        isOpen={sidebarState.isOpen}
        onClose={() => setSidebarState({ ...sidebarState, isOpen: false })}
        activeTab={sidebarState.activeTab}
        setActiveTab={(tab) => setSidebarState({ ...sidebarState, activeTab: tab })}
        onChannelSelect={handleChannelSelect}
        currentChannel={currentChannelIndex !== null ? chatRooms[currentChannelIndex - 1] : null}
      />

      <div className="flex-1 flex flex-col">
        <header className="fixed z-10 w-full h-16 lg:px-24 px-4 bg-[#0A0A0B]/80 border-b border-[#1F1F23] flex items-center justify-between backdrop-blur-md">
          <div className="flex items-center gap-6">
            <button
              onClick={() => setSidebarState({ ...sidebarState, isOpen: true })}
              className="p-2 hover:bg-[#1F1F23] rounded-lg cursor-pointer transition-all duration-200"
            >
              <Menu size={20} className="text-[#E4E4E7] hover:text-white" />
            </button>
            <div className="flex flex-row items-center justify-center gap-2">
              {currentChannelIndex && <Hash size={20} className="text-[#E4E4E7]" />}
              <h1 className="font-semibold text-lg">{currentChannelIndex ? chatRooms[currentChannelIndex - 1].attributes.name : 'Concord'}</h1>
              {totalUnreadMessages > 0 && (
                <span className="bg-[#FF4B4B] text-white text-xs rounded-full px-2 py-1 flex items-center gap-1">
                  <Bell size={12} />
                  {totalUnreadMessages}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center bg-[#1F1F23] rounded-lg gap-1 p-1">
              <button 
                className="p-2 text-[#E4E4E7] rounded-md hover:bg-[#2A2A2F] hover:text-white transition-all duration-200" 
                onClick={homeReturn}
              >
                <Home size={20} />
              </button>
              <button
                onClick={() => setIsUsersModalOpen(true)} 
                className="p-2 text-[#E4E4E7] rounded-md hover:bg-[#2A2A2F] hover:text-white transition-all duration-200"
              >
                <Users size={20} />
              </button>
              <div className="mx-1 h-6 w-px bg-[#2A2A2F]"></div>
              <button
                onClick={() => setIsUserModalOpen(true)}
                className="p-2 text-[#E4E4E7] rounded-md hover:bg-[#2A2A2F] hover:text-white transition-all duration-200"
              >
                <UserAvatar name={user?.name} color={userColor} />
              </button>
            </div>
          </div>
        </header>

        {currentChannelIndex !== null && chatRooms[currentChannelIndex - 1] ? (
          <>
            <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-[#2A2A2F] scrollbar-track-transparent flex flex-col-reverse mb-24">
              <div ref={messagesEndRef} />
              <div className="py-4 flex flex-col gap-4 px-4">
                {chatRooms[currentChannelIndex - 1]?.attributes?.messages.map((message: Message) => (
                  <ChatMessage
                    key={message.id}
                    message={message}
                    isCurrentUser={message.user.id === String(user?.id)}
                  />
                ))}
              </div>
            </div>
            <ChatInput onSendMessage={handleSendMessage} groupName={chatRooms[currentChannelIndex - 1].attributes.name} />
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center bg-[#0A0A0B] gap-4">
            <img src={ConcordLogo} alt="Logo" className="w-64 h-64 opacity-20" />
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-semibold text-[#E4E4E7]">Bem-vindo ao Concord</h2>
              <p className="text-[#9D9DA7]">Selecione um canal ou crie um novo para começar a conversar</p>
            </div>
          </div>
        )}
      </div>

      <Modal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        title="Configurações do Usuário"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-3 bg-[#1F1F23] rounded-lg">
            <UserAvatar name={user?.name} color={userColor} />
            <div>
              <div className="font-medium text-white">{user?.name}</div>
              <div className="text-sm text-[#9D9DA7] flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Online
              </div>
            </div>
          </div>
          <hr className="border-[#1F1F23]" />
          <button
            onClick={handleLogout}
            className="cursor-pointer w-full flex items-center gap-2 text-left px-4 py-3 rounded-lg hover:bg-[#1F1F23] text-red-400 hover:text-red-300 transition-all duration-200"
          >
            <LogOut size={18} />
            <span>Sair</span>
          </button>
        </div>
      </Modal>
      <ModalUsersList
        isOpen={isUsersModalOpen}
        onClose={() => setIsUsersModalOpen(false)}
      />
    </div>
  );
}
