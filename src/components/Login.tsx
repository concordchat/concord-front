import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginFormData } from '../schemas/auth';

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      await login(data.email, data.password);
      navigate('/chat', { replace: true });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A0A0B] px-4">
      <div className="max-w-xl w-full space-y-8 md:bg-[#0A0A0B] bg-transparent p-4 md:p-24 rounded-xl shadow-2xl border border-[#1F1F23]">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-[#E4E4E7]">Bem-vindo de volta!</h2>
          <p className="text-sm text-[#9D9DA7] mt-2">Por favor, faça login na sua conta</p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail size={16} className="text-[#9D9DA7]" />
              </div>
              <input
                {...register('email')}
                type="email"
                className={`w-full pl-9 pr-4 py-3 bg-[#1F1F23] border-none rounded-lg text-[#E4E4E7] placeholder-[#9D9DA7] focus:outline-none focus:ring-2 focus:ring-[#2A2A2F] transition-all duration-200 ${
                  errors.email ? 'ring-2 ring-red-500' : ''
                }`}
                placeholder="Email"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock size={16} className="text-[#9D9DA7]" />
              </div>
              <input
                {...register('password')}
                type="password"
                className={`w-full pl-9 pr-4 py-3 bg-[#1F1F23] border-none rounded-lg text-[#E4E4E7] placeholder-[#9D9DA7] focus:outline-none focus:ring-2 focus:ring-[#2A2A2F] transition-all duration-200 ${
                  errors.password ? 'ring-2 ring-red-500' : ''
                }`}
                placeholder="Senha"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-sm font-medium text-white bg-[#34AB70] hover:bg-[#34AB70]/90 focus:outline-none focus:ring-2 focus:ring-[#34AB70] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Entrando...
                </>
              ) : (
                <>
                  Entrar
                  <ArrowRight size={16} />
                </>
              )}
            </button>
            <Link
              to="/register"
              className="mt-4 block text-center text-sm text-[#34AB70] hover:text-[#34AB70]/90 transition-all duration-200"
            >
              Não tem uma conta? Crie uma
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
