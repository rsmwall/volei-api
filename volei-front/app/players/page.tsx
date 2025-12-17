'use client';

import { useState, useEffect } from 'react';
import { api, Player } from '@/services/api';
import Navbar from '@/components/Navbar';
import { UserPlus, Trash2 } from 'lucide-react';

export default function PlayersPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Estado do formulário
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    gender: 'M',
    category: 'C'
  });

  useEffect(() => {
    loadPlayers();
  }, []);

  async function loadPlayers() {
    try {
      const res = await api.get('/players');
      setPlayers(res.data);
    } catch (error) {
      console.error("Erro ao carregar jogadores", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await api.post('/players', formData);
      alert('Jogador cadastrado!');
      setFormData({ name: '', email: '', gender: 'M', category: 'C' }); // Limpa form
      loadPlayers(); // Recarrega lista
    } catch (error) {
      alert('Erro ao cadastrar. Verifique se o email é único.');
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto p-4">
        
        {/* Formulário de Cadastro */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <UserPlus className="text-blue-600" /> Novo Jogador
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <input 
              type="text" placeholder="Nome" required
              className="border p-2 rounded"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
            />
            <input 
              type="email" placeholder="Email" required
              className="border p-2 rounded"
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
            />
            <select 
              className="border p-2 rounded"
              value={formData.gender}
              onChange={e => setFormData({...formData, gender: e.target.value})}
            >
              <option value="M">Masculino</option>
              <option value="F">Feminino</option>
            </select>
            <select 
              className="border p-2 rounded"
              value={formData.category}
              onChange={e => setFormData({...formData, category: e.target.value})}
            >
              <option value="C">Iniciante (C)</option>
              <option value="B">Intermediário (B)</option>
              <option value="A">Avançado (A)</option>
            </select>
            <button type="submit" className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 font-bold">
              Cadastrar
            </button>
          </form>
        </div>

        {/* Lista de Jogadores */}
        <h2 className="text-xl font-bold mb-4">Jogadores Cadastrados ({players.length})</h2>
        {loading ? <p>Carregando...</p> : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {players.map(player => (
              <div key={player.id} className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
                <h3 className="font-bold text-lg">{player.name}</h3>
                <p className="text-gray-600 text-sm">{player.email}</p>
                <div className="flex justify-between mt-3 text-sm font-semibold">
                  <span className="bg-gray-100 px-2 py-1 rounded">Categ: {player.category}</span>
                  <span className="bg-gray-100 px-2 py-1 rounded">Sexo: {player.gender}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}