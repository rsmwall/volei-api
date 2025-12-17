'use client';

import { useState } from 'react';
import { api } from '@/services/api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Calendar, Lock, Mail, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('user_token', res.data.token);
      localStorage.setItem('user_data', JSON.stringify(res.data.user));
      router.push('/');
    } catch (err) { setError('Credenciais inválidas. Tente novamente.'); }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 to-blue-500 p-4">
      <div className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-md animate-in fade-in zoom-in duration-300">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4 text-purple-600">
            <Calendar size={32} />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Bem-vindo de volta!</h1>
          <p className="text-gray-500 mt-2">Acesse sua conta no EventSync</p>
        </div>
        
        {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-6 text-center border border-red-100">{error}</div>}
        
        <form onSubmit={handleLogin} className="space-y-5">
          <div className="relative">
            <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
            <input type="email" placeholder="Seu Email" required className="w-full pl-10 p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none transition"
              value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          
          <div className="relative">
            <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
            <input type="password" placeholder="Sua Senha" required className="w-full pl-10 p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none transition"
              value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>

          <button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white py-3 rounded-lg font-bold shadow-lg shadow-purple-200 hover:shadow-xl hover:scale-[1.02] transition flex items-center justify-center gap-2">
            Entrar <ArrowRight size={18} />
          </button>
        </form>
        
        <p className="mt-8 text-center text-sm text-gray-500">
          Não tem uma conta? <Link href="/register" className="text-purple-600 font-bold hover:underline">Cadastre-se grátis</Link>
        </p>
      </div>
    </div>
  );
}