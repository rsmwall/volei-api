'use client';

import { useState } from 'react';
import { api } from '@/services/api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User, Mail, Lock, ArrowRight, CheckCircle } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError(''); 
    
    try {
      await api.post('/auth/register', formData);
      // Redireciona para login após sucesso
      router.push('/login'); 
    } catch (err: any) {
      if (err.response?.data?.errors) {
        setError(err.response.data.errors.join(', '));
      } else if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError('Erro ao criar conta. Tente novamente.');
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-500 to-purple-600 p-4">
      {/* Círculos decorativos no fundo */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl"></div>
      <div className="absolute bottom-10 right-10 w-48 h-48 bg-blue-400 opacity-20 rounded-full blur-3xl"></div>

      <div className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-md animate-in fade-in zoom-in duration-300 relative z-10">
        
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-pink-100 rounded-full mb-4 text-pink-600">
            <User size={32} />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Crie sua conta</h1>
          <p className="text-gray-500 mt-2">Junte-se à comunidade EventSync</p>
        </div>
        
        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 p-3 rounded-lg text-sm mb-6 text-center">
            {error}
          </div>
        )}
        
        <form onSubmit={handleRegister} className="space-y-5">
          <div className="relative">
            <User className="absolute left-3 top-3 text-gray-400" size={20} />
            <input 
              type="text" required placeholder="Nome Completo" 
              className="w-full pl-10 p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none transition"
              value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div className="relative">
            <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
            <input 
              type="email" required placeholder="Seu melhor Email" 
              className="w-full pl-10 p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none transition"
              value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
          
          <div className="relative">
            <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
            <input 
              type="password" required placeholder="Crie uma Senha segura" minLength={6}
              className="w-full pl-10 p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none transition"
              value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>

          <button type="submit" className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 rounded-lg font-bold shadow-lg shadow-pink-200 hover:shadow-xl hover:scale-[1.02] transition flex items-center justify-center gap-2">
            Cadastrar Grátis <CheckCircle size={18} />
          </button>
        </form>
        
        <div className="mt-8 text-center border-t border-gray-100 pt-6">
          <p className="text-sm text-gray-500">
            Já tem uma conta? <Link href="/login" className="text-pink-600 font-bold hover:underline flex items-center justify-center gap-1 mt-2">Fazer Login <ArrowRight size={14}/></Link>
          </p>
        </div>
      </div>
    </div>
  );
}