'use client';

import { useState, useEffect } from 'react';
import { api } from '@/services/api';
import Link from 'next/link';
import { Calendar, MapPin, Plus, Search, Ticket } from 'lucide-react';

export default function Dashboard() {
  const [events, setEvents] = useState<any[]>([]);
  const [myTickets, setMyTickets] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const userData = localStorage.getItem('user_data');
    if (!userData) {
      window.location.href = '/login';
    } else {
      setUser(JSON.parse(userData));
      loadData(JSON.parse(userData).id);
    }
  }, []);

  async function loadData(userId: number) {
    try {
      const res = await api.get('/events');
      setEvents(res.data);
      const resTickets = await api.get(`/registrations/my?user_id=${userId}`);
      setMyTickets(resTickets.data);
    } catch (error) { console.error(error); }
  }

  const filteredEvents = events.filter(event => 
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!user) return null;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-white p-4 rounded-xl shadow-sm gap-4">
        <div className="flex items-center gap-2 text-gray-400 bg-gray-100 px-4 py-2 rounded-lg w-full md:max-w-md transition focus-within:ring-2 focus-within:ring-purple-200 focus-within:bg-white">
          <Search size={18} />
          <input 
            type="text" placeholder="Buscar eventos..." 
            className="bg-transparent outline-none text-sm w-full" 
            value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3">
           <span className="text-sm font-bold text-gray-600">Olá, {user.name}</span>
           <div className="w-10 h-10 bg-gradient-to-tr from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold shadow-md">
             {user.name.charAt(0)}
           </div>
        </div>
      </div>

      {/* Meus Ingressos */}
      {myTickets.length > 0 && (
        <section>
          <h2 className="text-lg font-bold text-gray-700 mb-4">Meus Ingressos</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {myTickets.map((t: any) => (
              <Link href={`/tickets/${t.registration_id || t.id}`} key={t.id} className="group relative overflow-hidden rounded-2xl shadow-lg transition-transform hover:-translate-y-1">
                <div className="bg-gradient-to-br from-teal-400 to-emerald-500 p-6 text-white h-full">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-lg mb-1">{t.title}</p>
                      <p className="text-teal-100 text-sm flex items-center gap-1"><Calendar size={14}/> {new Date(t.date).toLocaleDateString()}</p>
                    </div>
                    <div className="bg-white/20 p-2 rounded-lg"><Ticket size={24} className="text-white" /></div>
                  </div>
                  <p className="mt-4 text-xs font-bold uppercase tracking-wider bg-white/20 w-max px-2 py-1 rounded">Ver QR Code</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Lista de Eventos */}
      <section>
        <div className="flex justify-between items-end mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {searchTerm ? `Resultados para "${searchTerm}"` : 'Próximos Eventos'}
          </h2>
          
          {/* BOTÃO NOVO: Agora é um Link para a página nova */}
          <Link href="/events/new" className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg shadow-md font-bold flex items-center gap-2 transition">
            <Plus size={18} /> Novo Evento
          </Link>
        </div>

        {filteredEvents.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-2xl border border-dashed border-gray-300">
            <p className="text-gray-500">Nenhum evento encontrado.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => {
              const isPaid = parseFloat(event.price) > 0;
              const gradientClass = isPaid ? 'from-orange-400 to-pink-500 shadow-orange-200' : 'from-blue-400 to-cyan-500 shadow-blue-200';
              return (
                <div key={event.id} className={`bg-gradient-to-br ${gradientClass} rounded-2xl p-6 text-white shadow-xl relative overflow-hidden group hover:-translate-y-1 transition duration-300`}>
                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-4">
                      <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm border border-white/10">{event.category}</span>
                      <span className="font-bold text-lg">{isPaid ? `R$ ${event.price}` : 'Free'}</span>
                    </div>
                    <h3 className="text-2xl font-bold mb-2 leading-tight">{event.title}</h3>
                    <p className="text-white/80 text-sm mb-6 line-clamp-2 h-10">{event.description || "Sem descrição."}</p>
                    <div className="flex items-center gap-4 text-sm font-medium text-white/90 mb-6">
                      <div className="flex items-center gap-1"><Calendar size={16}/> {new Date(event.date).toLocaleDateString()}</div>
                      <div className="flex items-center gap-1"><MapPin size={16}/> {event.location}</div>
                    </div>
                    <div className="flex items-center justify-between border-t border-white/20 pt-4">
                      <div className="flex items-center gap-2">
                         <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-xs font-bold">{event.organizer?.name?.charAt(0) || "O"}</div>
                         <span className="text-sm truncate max-w-[100px]">{event.organizer?.name}</span>
                      </div>
                      <Link href={`/events/${event.id}`} className="bg-white text-gray-800 px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-100 transition shadow-sm">Ver Detalhes</Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}