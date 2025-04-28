import { useState, useEffect } from 'react';
import { X, Users, Loader2 } from 'lucide-react';
import { UserAttr } from '../types';
import { fetchUsers } from '../services/usersService';
import { UserAvatar } from './UserAvatar';

interface ModalUsersListProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ModalUsersList({ isOpen, onClose }: ModalUsersListProps) {
  const [users, setUsers] = useState<UserAttr[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUsers = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const fetchedUsers = await fetchUsers();
        setUsers(fetchedUsers);
      } catch (err) {
        setError('Falha ao carregar usuários. Por favor, tente novamente mais tarde.');
        console.error('Error fetching users:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen) {
      loadUsers();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0A0A0B] rounded-xl w-full max-w-md text-[#E4E4E7] shadow-2xl border border-[#1F1F23]">
        <div className="flex justify-between items-center p-4 border-b border-[#1F1F23]">
          <div className="flex items-center gap-2">
            <Users size={20} className="text-[#9D9DA7]" />
            <h2 className="text-xl font-semibold">Lista de Usuários</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-[#9D9DA7] hover:text-[#E4E4E7] hover:bg-[#1F1F23] rounded-lg transition-all duration-200"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-8 gap-2 text-[#9D9DA7]">
              <Loader2 size={24} className="animate-spin" />
              <span>Carregando usuários...</span>
            </div>
          ) : error ? (
            <div className="text-center py-4 text-[#FF4B4B]">{error}</div>
          ) : users.length === 0 ? (
            <div className="text-center py-4 text-[#9D9DA7]">Nenhum usuário encontrado</div>
          ) : (
            <div className="space-y-2 max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-[#2A2A2F] scrollbar-track-transparent">
              {users.map(user => (
                <div
                  key={user.id}
                  className="flex items-center gap-3 p-3 hover:bg-[#1F1F23] rounded-lg cursor-pointer transition-all duration-200"
                >
                  <UserAvatar name={user.attributes.name} color={user.attributes.color} />
                  <div>
                    <div className="font-medium text-[#E4E4E7]">{user.attributes.name}</div>
                    <div className="text-[#9D9DA7] text-sm">{user.attributes.email}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}