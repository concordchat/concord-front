import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'react-hot-toast';
import { ChromePicker, ColorResult } from 'react-color';
import { getRandomColor } from '../hooks/getRandomColor';
import { colors } from '../utils';
import { User, Mail, Lock, Palette, ArrowRight } from 'lucide-react';

export function Register() {
  const userColor = getRandomColor;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password_confirmation, setpassword_confirmation] = useState('');
  const [color, setColor] = useState<string>(userColor);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [name, setName] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== password_confirmation) {
      toast.error("As senhas não coincidem!");
      return;
    }

    try {
      await register(name, email, password, password_confirmation, color);
      navigate('/chat');
    } catch (error) {
      console.error("Erro ao registrar:", error);
    }
  };

  const handleColorChange = (color: ColorResult) => {
    setColor(color.hex);
  };

  const handleCloseColorPicker = () => {
    setShowColorPicker(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A0A0B] px-4">
      <div className="max-w-xl w-full space-y-8 md:bg-[#0A0A0B] bg-transparent p-4 md:p-24 rounded-xl shadow-2xl border border-[#1F1F23]">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-[#E4E4E7]">Junte-se a nós!</h2>
          <p className="text-sm text-[#9D9DA7] mt-2">Crie uma conta para começar</p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User size={16} className="text-[#9D9DA7]" />
              </div>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-9 pr-4 py-3 bg-[#1F1F23] border-none rounded-lg text-[#E4E4E7] placeholder-[#9D9DA7] focus:outline-none focus:ring-2 focus:ring-[#2A2A2F] transition-all duration-200"
                placeholder="Nome completo"
              />
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail size={16} className="text-[#9D9DA7]" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-4 py-3 bg-[#1F1F23] border-none rounded-lg text-[#E4E4E7] placeholder-[#9D9DA7] focus:outline-none focus:ring-2 focus:ring-[#2A2A2F] transition-all duration-200"
                placeholder="Email"
              />
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock size={16} className="text-[#9D9DA7]" />
              </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-4 py-3 bg-[#1F1F23] border-none rounded-lg text-[#E4E4E7] placeholder-[#9D9DA7] focus:outline-none focus:ring-2 focus:ring-[#2A2A2F] transition-all duration-200"
                placeholder="Senha"
              />
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock size={16} className="text-[#9D9DA7]" />
              </div>
              <input
                id="confirm-password"
                name="confirm-password"
                type="password"
                required
                value={password_confirmation}
                onChange={(e) => setpassword_confirmation(e.target.value)}
                className="w-full pl-9 pr-4 py-3 bg-[#1F1F23] border-none rounded-lg text-[#E4E4E7] placeholder-[#9D9DA7] focus:outline-none focus:ring-2 focus:ring-[#2A2A2F] transition-all duration-200"
                placeholder="Confirmar senha"
              />
            </div>
            <div className="flex items-center gap-4 p-3 bg-[#1F1F23] rounded-lg">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer shadow-lg transition-all duration-200 hover:scale-105"
                style={{ 
                  backgroundColor: color,
                  boxShadow: `0 0 0 2px ${color}20`
                }}
                onClick={() => setShowColorPicker(!showColorPicker)}
              >
                <span className="text-white text-sm font-semibold">{name.charAt(0).toUpperCase()}</span>
              </div>
              <div className="flex items-center gap-2 text-[#9D9DA7]">
                <Palette size={16} />
                <span className="text-sm">Escolha sua cor favorita</span>
              </div>
              {showColorPicker && (
                <div className="absolute z-10 mt-2 p-4 bg-[#0A0A0B] rounded-xl shadow-2xl border border-[#1F1F23]">
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {colors.map((stdColor) => (
                      <div
                        key={stdColor}
                        className="w-8 h-8 rounded-full cursor-pointer transition-all duration-200 hover:scale-110"
                        style={{ backgroundColor: stdColor }}
                        onClick={() => setColor(stdColor)}
                      />
                    ))}
                  </div>
                  <ChromePicker
                    color={color}
                    onChange={handleColorChange}
                  />
                  <button
                    type="button"
                    onClick={handleCloseColorPicker}
                    className="mt-4 w-full py-2.5 px-4 text-sm font-medium text-white bg-[#34AB70] hover:bg-[#34AB70]/90 rounded-lg transition-all duration-200"
                  >
                    Concluído
                  </button>
                </div>
              )}
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-sm font-medium text-white bg-[#34AB70] hover:bg-[#34AB70]/90 focus:outline-none focus:ring-2 focus:ring-[#34AB70] transition-all duration-200"
            >
              Criar conta
              <ArrowRight size={16} />
            </button>
            <Link
              to="/login"
              className="mt-4 block text-center text-sm text-[#34AB70] hover:text-[#34AB70]/90 transition-all duration-200"
            >
              Já tem uma conta? Faça login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
