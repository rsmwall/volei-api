'use client';

import { useState, useEffect } from 'react';
import { api } from '@/services/api';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Calendar, MapPin, DollarSign, Type, AlignLeft, CheckCircle, Clock } from 'lucide-react';
import Link from 'next/link';

export default function NewEventPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  
  // Mudamos o estado para ter data e hora separados
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    datePart: '', // Data separada (YYYY-MM-DD)
    timePart: '', // Hora separada (HH:MM)
    description: '',
    price: '0',
    category: 'Esporte'
  });

  useEffect(() => {
    const userData = localStorage.getItem('user_data');
    if (!userData) {
      router.push('/login');
    } else {
      setUser(JSON.parse(userData));
    }
  }, []);

  async function handleCreateEvent(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      // AQUI ESTÁ A MÁGICA: Juntamos Data e Hora no formato ISO (YYYY-MM-DDTHH:MM)
      const fullDateTime = `${formData.datePart}T${formData.timePart}`;

      await api.post('/events', {
        title: formData.title,
        location: formData.location,
        date: fullDateTime, // Manda o campo combinado
        description: formData.description,
        price: formData.price,
        category: formData.category,
        user_id: user.id
      });

      alert('Evento criado com sucesso! 🎉');
      router.push('/'); 
    } catch (error) {
      alert('Erro ao criar evento. Verifique se preencheu data e hora corretamente.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header com Voltar */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Novo Evento</h1>
          <p className="text-gray-500">Preencha os dados para publicar seu evento.</p>
        </div>
        <Link href="/" className="text-gray-500 hover:text-purple-600 font-bold flex items-center gap-2 transition">
          <ArrowLeft size={20} /> Cancelar
        </Link>
      </div>

      {/* Card do Formulário */}
      <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 max-w-3xl mx-auto">
        <form onSubmit={handleCreateEvent} className="space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Título */}
            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-bold text-gray-700 flex items-center gap-1"><Type size={16}/> Nome do Evento</label>
              <input 
                type="text" required placeholder="Ex: Torneio de Vôlei" 
                className="w-full bg-gray-50 p-3 rounded-xl outline-none focus:ring-2 focus:ring-purple-400 transition border border-transparent focus:bg-white"
                value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}
              />
            </div>

            {/* Local */}
            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-bold text-gray-700 flex items-center gap-1"><MapPin size={16}/> Localização</label>
              <input 
                type="text" required placeholder="Ex: Quadra Central" 
                className="w-full bg-gray-50 p-3 rounded-xl outline-none focus:ring-2 focus:ring-purple-400 transition border border-transparent focus:bg-white"
                value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})}
              />
            </div>

            {/* SEPARAÇÃO: Data e Hora agora são campos distintos */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 flex items-center gap-1"><Calendar size={16}/> Data do Evento</label>
              <input 
                type="date" required 
                className="w-full bg-gray-50 p-3 rounded-xl outline-none focus:ring-2 focus:ring-purple-400 transition border border-transparent focus:bg-white text-gray-600"
                value={formData.datePart} onChange={e => setFormData({...formData, datePart: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 flex items-center gap-1"><Clock size={16}/> Horário</label>
              <input 
                type="time" required 
                className="w-full bg-gray-50 p-3 rounded-xl outline-none focus:ring-2 focus:ring-purple-400 transition border border-transparent focus:bg-white text-gray-600"
                value={formData.timePart} onChange={e => setFormData({...formData, timePart: e.target.value})}
              />
            </div>

            {/* Categoria e Preço */}
            <div className="flex gap-4">
              <div className="w-full space-y-2">
                 <label className="text-sm font-bold text-gray-700">Categoria</label>
                 <select 
                    className="w-full bg-gray-50 p-3 rounded-xl outline-none focus:ring-2 focus:ring-purple-400 transition cursor-pointer"
                    value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}
                 >
                   <option>Esporte</option>
                   <option>Festa</option>
                   <option>Show</option>
                   <option>Reunião</option>
                   <option>Outro</option>
                 </select>
              </div>
              
              <div className="w-full space-y-2">
                 <label className="text-sm font-bold text-gray-700 flex items-center gap-1"><DollarSign size={16}/> Preço (R$)</label>
                 <input 
                   type="number" min="0" step="0.01" placeholder="0.00" 
                   className="w-full bg-gray-50 p-3 rounded-xl outline-none focus:ring-2 focus:ring-purple-400 transition border border-transparent focus:bg-white"
                   value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} 
                 />
              </div>
            </div>
          </div>

          {/* Descrição */}
          <div className="space-y-2">
             <label className="text-sm font-bold text-gray-700 flex items-center gap-1"><AlignLeft size={16}/> Descrição Detalhada</label>
             <textarea 
               placeholder="Conte mais sobre o evento..." 
               className="w-full bg-gray-50 p-3 rounded-xl outline-none focus:ring-2 focus:ring-purple-400 transition h-32 resize-none border border-transparent focus:bg-white"
               value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} 
             />
          </div>

          {/* Botão Salvar */}
          <div className="pt-4 flex justify-end">
            <button 
              type="submit" 
              disabled={loading}
              className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-purple-200 hover:shadow-xl hover:scale-[1.02] transition flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? 'Salvando...' : <><CheckCircle size={20}/> Publicar Evento</>}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}