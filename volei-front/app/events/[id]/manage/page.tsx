'use client';

import { useState, useEffect } from 'react';
import { api } from '@/services/api';
import { ArrowLeft, CheckCircle, User } from 'lucide-react';
import Link from 'next/link';

export default function ManageEventPage({ params }: { params: Promise<{ id: string }> }) {
  const [participants, setParticipants] = useState<any[]>([]);
  const [eventName, setEventName] = useState('');
  const [id, setId] = useState('');

  useEffect(() => {
    params.then(p => { setId(p.id); loadData(p.id); });
  }, [params]);

  async function loadData(eventId: string) {
    try {
      const resEvent = await api.get('/events'); // O ideal seria um endpoint GET /events/:id direto
      const evt = resEvent.data.find((e:any) => e.id == eventId);
      setEventName(evt?.title || 'Evento');

      const resPart = await api.get(`/events/${eventId}/participants`);
      setParticipants(resPart.data);
    } catch (e) { alert("Erro ao carregar lista."); }
  }

  async function handleCheckIn(registrationId: number) {
    try {
      await api.put(`/registrations/${registrationId}/checkin`);
      // Atualiza lista localmente para ser rápido
      setParticipants(prev => prev.map(p => 
        p.registration_id === registrationId 
          ? { ...p, checkins_count: (p.checkins_count || 0) + 1, status: 'attended' } 
          : p
      ));
    } catch (e) { alert("Erro no check-in."); }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="bg-purple-600 p-6 text-white flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold">Gerenciar Presença</h1>
            <p className="opacity-80 text-sm">{eventName}</p>
          </div>
          <Link href={`/events/${id}`} className="bg-white/20 p-2 rounded hover:bg-white/30 transition">
            <ArrowLeft />
          </Link>
        </div>

        <div className="p-6">
          <h2 className="font-bold text-gray-700 mb-4">Lista de Inscritos ({participants.length})</h2>
          
          <div className="space-y-3">
            {participants.map((p) => (
              <div key={p.registration_id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${p.status === 'attended' ? 'bg-green-500' : 'bg-gray-400'}`}>
                    {p.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">{p.name}</p>
                    <p className="text-xs text-gray-500">{p.email}</p>
                  </div>
                </div>

                <button 
                  onClick={() => handleCheckIn(p.registration_id)}
                  disabled={p.status === 'attended'}
                  className={`px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transition ${
                    p.status === 'attended' 
                      ? 'bg-green-100 text-green-700 cursor-default' 
                      : 'bg-purple-600 text-white hover:bg-purple-700 shadow-lg shadow-purple-200'
                  }`}
                >
                  {p.status === 'attended' ? <><CheckCircle size={16}/> Presente</> : 'Check-in'}
                </button>
              </div>
            ))}
            {participants.length === 0 && <p className="text-center text-gray-400 py-10">Nenhum inscrito ainda.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}