import React, { useState, useEffect, useRef } from "react";
import { GeneralContext } from "./GeneralContext";
import useUserChannel from "../hooks/useUserChannel";
import { useAuth } from "../hooks/useAuth";
import toast from "react-hot-toast";
import { UserAvatar } from "../components/UserAvatar";
import { formatDistanceToNow } from "../utils";
import { X, ChevronDown } from "lucide-react";

export const GeneralProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [chatRooms, setChatRooms] = useState<any[]>([]);
  const [unreadMessages, setUnreadMessages] = useState<{ [key: number]: number }>({});
  const { userID, token } = useAuth();
  const [cable, setCable] = useState<any | null>(null);
  const [currentChatRoomId, setCurrentChatRoomId] = useState<number | null>(null);
  const [currentChannelIndex, setCurrentChannelIndex] = useState<number | null>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const currentChannelIndexRef = useRef<number | null>(null);

  useEffect(() => {
    currentChannelIndexRef.current = currentChannelIndex;
  }, [currentChannelIndex]);

  useEffect(() => {
    console.log("channel atual: ",currentChannelIndex)
  })

  const addNewGroup = (newGroup: any) => {
    if (newGroup.attributes.members.find((member: any) => member.role === "admin").user.id === userID) {
      toast.success("Grupo criado com sucesso!")
    } else {
      toast.success("Você foi adicionado ao grupo: " + newGroup.attributes.name);
    }

    setChatRooms((prev) => [...prev, newGroup]);
  };

  const addNewMessage = (newMessage: any) => {
    setChatRooms((prev) => {
      const chatRoomIndex = prev.findIndex((room) => String(room.id) === String(newMessage.chat_room_id));
      const estaNaConversa = currentChannelIndexRef.current === chatRoomIndex + 1;

      if (
        newMessage.user.id !== userID &&
        !estaNaConversa // Só mostra o toast se NÃO estiver na conversa
      ) {
        toast.custom((t) => (
          <div
            className={`relative ${
              t.visible ? "animate-enter" : "animate-leave"
            } max-w-md w-full bg-[#36393f] shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-[#202225] max-h-[200px] overflow-y-auto`}
            onClick={() => {
              setChatRooms((prevRooms) => {
                const index = prevRooms.findIndex(room => String(room.id) === String(newMessage.chat_room_id));
                if (index !== -1) {
                  setCurrentChannelIndex(index + 1);
                  setCurrentChatRoomId(newMessage.chat_room_id);
                }
                return prevRooms;
              });
              toast.dismiss(t.id);
            }}
            style={{ cursor: "pointer" }}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                toast.dismiss(t.id);
              }}
              className="absolute top-4 right-4 text-white hover:text-gray-300 focus:outline-none"
            >
              <X size={20} />
            </button>
    
            <div className="flex-1 w-0 p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 pt-0.5">
                  <UserAvatar name={newMessage.user.name} color={newMessage.user.color} />
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-white">
                    {newMessage.user.name}{" "}
                    <span className="text-xs text-gray-400">
                      em {chatRooms.find((room) => room.id === newMessage.chat_room_id)?.attributes.name}
                    </span>
                  </p>
                  <p className="mt-1 text-sm text-[#b9bbbe]">{newMessage.content}</p>
                  <span className="text-xs text-gray-500">{formatDistanceToNow(newMessage.created_at)}</span>
                </div>
              </div>
            </div>
          </div>
        ), { position: "bottom-right", duration: 2000 });
      }

      if (newMessage.user.id !== userID && currentChatRoomId !== newMessage.chat_room_id) {
        setUnreadMessages((prev) => ({
          ...prev,
          [newMessage.chat_room_id]: (prev[newMessage.chat_room_id] || 0) + 1,
        }));
      }

      if (chatRoomIndex === -1) {
        console.warn("Sala de chat não encontrada para a mensagem recebida:", newMessage);
        return prev;
      }

      const chatRoom = prev[chatRoomIndex];
      const updatedMessages = [...(chatRoom.attributes.messages || []), newMessage];
      const updatedAttributes = { ...chatRoom.attributes, messages: updatedMessages };
      const updatedChatRoom = { ...chatRoom, attributes: updatedAttributes };

      return prev.map((room, index) => (index === chatRoomIndex ? updatedChatRoom : room));
    });
  };
  
  useEffect(() => {
    if (currentChatRoomId !== null) {
      setUnreadMessages((prev) => ({
        ...prev,
        [currentChatRoomId]: 0,
      }));
    }
  }, [currentChatRoomId]);

  useEffect(() => {
    if (currentChannelIndex !== null && chatRooms[currentChannelIndex - 1]) {
      const roomId = chatRooms[currentChannelIndex - 1].id;
      setUnreadMessages((prev) => ({
        ...prev,
        [roomId]: 0,
      }));
    }
  }, [currentChannelIndex, chatRooms]);

  useEffect(() => {
    if (!token) {
      setCable(null);
      return;
    };

    const { cable } = useUserChannel(token, setChatRooms, addNewGroup, addNewMessage);
    setCable(cable);
    if (cable) {
      cable.disconnect();
    }

    return () => {
      cable.disconnect();
    };
  }, [token]);

  const handleScroll = () => {
    const container = messagesContainerRef.current;
    if (container) {
      // Se está longe do final, mostra o botão
      const isAtBottom = container.scrollTop <= 100;
      setShowScrollButton(!isAtBottom);
    }
  };

  const value = { chatRooms, setChatRooms, cable, currentChatRoomId, setCurrentChatRoomId, currentChannelIndex, setCurrentChannelIndex, unreadMessages, };

  return <GeneralContext.Provider value={value}>{children}</GeneralContext.Provider>;
};