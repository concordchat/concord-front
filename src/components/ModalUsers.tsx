import { useState, useEffect } from 'react';
import { X, Check, Search, Users } from 'lucide-react';
import { UserAttr } from '../types';
import { fetchUsers } from '../services/usersService';
import { UserAvatar } from './UserAvatar';

interface ModalUsersProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (selectedUsers: UserAttr[]) => void;
  maxUsers?: number;
}

export function ModalUsers({ isOpen, onClose, onConfirm }: ModalUsersProps) {
  const [selectedUsers, setSelectedUsers] = useState<UserAttr[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [usersGroup, setusersGroup] = useState<UserAttr[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isConfirmDisabled = selectedUsers.length === 0;

  useEffect(() => {
    const loadusersGroup = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const fetchedusersGroup = await fetchUsers();
        setusersGroup(fetchedusersGroup);
      } catch (err) {
        setError('Falha ao carregar usuários. Por favor, tente novamente mais tarde.');
        console.error('Error fetching usersGroup:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen) {
      loadusersGroup();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const toggleusersGroupelection = (user: UserAttr) => {
    setSelectedUsers(prev => {
      const isSelected = prev.some(f => f.id === user.id);
      if (isSelected) {
        return prev.filter(f => f.id !== user.id);
      }
      return [...prev, user];
    });
  };

  const filteredusersGroup = usersGroup.filter(user =>
    user.attributes.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.attributes.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selecteduserChips = selectedUsers.map(user => (
    <div
      key={user.id}
      className="flex items-center gap-1 bg-[#1F1F23] text-[#E4E4E7] px-3 py-1.5 rounded-lg text-sm transition-all duration-200 hover:bg-[#2A2A2F]"
    >
      {user.attributes.name}
      <button
        onClick={() => toggleusersGroupelection(user)}
        className="text-[#9D9DA7] hover:text-[#E4E4E7] transition-all duration-200"
      >
        <X size={14} />
      </button>
    </div>
  ));

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0A0A0B] rounded-xl w-full max-w-md text-[#E4E4E7] shadow-2xl border border-[#1F1F23]">
        <div className="flex justify-between items-center p-4 border-b border-[#1F1F23]">
          <div className="flex items-center gap-2">
            <Users size={20} className="text-[#9D9DA7]" />
            <h2 className="text-xl font-semibold">Selecionar Usuários</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-[#9D9DA7] hover:text-[#E4E4E7] hover:bg-[#1F1F23] rounded-lg transition-all duration-200"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4">
          <p className="text-[#9D9DA7] text-sm mb-4">
            Escolha os usuários que farão parte do seu canal.
          </p>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {selecteduserChips}
          </div>

          <div className="relative mb-4">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={16} className="text-[#9D9DA7]" />
            </div>
            <input
              type="text"
              placeholder="Encontre ou comece uma conversa"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#1F1F23] rounded-lg pl-9 pr-4 py-2.5 text-[#E4E4E7] placeholder-[#9D9DA7] focus:outline-none focus:ring-2 focus:ring-[#2A2A2F] transition-all duration-200"
            />
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-[#2A2A2F] scrollbar-track-transparent">
            {isLoading ? (
              <div className="text-center py-4 text-[#9D9DA7]">Carregando...</div>
            ) : error ? (
              <div className="text-center py-4 text-[#FF4B4B]">{error}</div>
            ) : filteredusersGroup.length === 0 ? (
              <div className="text-center py-4 text-[#9D9DA7]">Nenhum usuário encontrado</div>
            ) : (
              filteredusersGroup.map(user => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-3 hover:bg-[#1F1F23] rounded-lg cursor-pointer transition-all duration-200"
                  onClick={() => toggleusersGroupelection(user)}
                >
                  <div className="flex items-center gap-3">
                    <UserAvatar name={user.attributes.name} color={user.attributes.color} />
                    <div>
                      <div className="font-medium text-[#E4E4E7]">{user.attributes.name}</div>
                      <div className="text-[#9D9DA7] text-sm">{user.attributes.email}</div>
                    </div>
                  </div>
                  <div className={`w-6 h-6 rounded-lg border border-[#2A2A2F] flex items-center justify-center transition-all duration-200 ${
                    selectedUsers.some(f => f.id === user.id) ? 'bg-[#34AB70] border-[#34AB70]' : 'hover:border-[#E4E4E7]'
                  }`}>
                    {selectedUsers.some(f => f.id === user.id) && (
                      <Check size={16} className="text-white" />
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="p-4 border-t border-[#1F1F23]">
          <button
            disabled={isConfirmDisabled}
            onClick={() => {
              onConfirm(selectedUsers);
              onClose();
            }}
            className={`w-full rounded-lg py-2.5 font-medium transition-all duration-200 ${
              isConfirmDisabled 
                ? 'bg-[#1F1F23] text-[#9D9DA7] cursor-not-allowed' 
                : 'bg-[#34AB70] hover:bg-[#34AB70]/90 text-white cursor-pointer'
            }`}
          >
            Próximo
          </button>
        </div>
      </div>
    </div>
  );
}
