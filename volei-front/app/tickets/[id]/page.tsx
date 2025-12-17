'use client';

import { useState, useEffect } from 'react';
import { api } from '@/services/api';
import { QRCodeSVG } from 'qrcode.react';
import { ArrowLeft, Download, Calendar, MapPin, Ticket as TicketIcon } from 'lucide-react';
import Link from 'next/link';

export default function TicketPage({ params }: { params: Promise<{ id: string }> }) {
  const [ticket, setTicket] = useState<any>(null);
  
  useEffect(() => {
    params.then(p => loadTicket(p.id));
  }, [params]);

  async function loadTicket(id: string) {
    try {
      const res = await api.get(`/registrations/${id}`);
      setTicket(res.data);
    } catch (e) { console.error(e); }
  }

  if (!ticket) return null;

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10"></div>
      <div className="absolute top-10 right-10 w-64 h-64 bg-purple-600 rounded-full blur-[100px] opacity-40"></div>
      <div className="absolute bottom-10 left-10 w-64 h-64 bg-blue-600 rounded-full blur-[100px] opacity-40"></div>

      <Link href="/" className="absolute top-6 left-6 text-white/70 hover:text-white flex items-center gap-2 transition z-20">
        <ArrowLeft /> Voltar
      </Link>

      <div className="relative z-10 w-full max-w-sm bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
        {/* Topo do Ticket */}
        <div className="bg-gradient-to-br from-purple-600 to-pink-500 p-6 text-center text-white relative">
           <div className="absolute top-1/2 -left-3 w-6 h-6 bg-gray-900 rounded-full"></div>
           <div className="absolute top-1/2 -right-3 w-6 h-6 bg-gray-900 rounded-full"></div>
           <TicketIcon className="mx-auto mb-2 opacity-80" size={32} />
           <h2 className="text-xl font-bold tracking-wider">{ticket.event_title}</h2>
           <p className="text-white/80 text-xs font-bold uppercase mt-1">Ingresso Confirmado</p>
        </div>

        {/* Corpo */}
        <div className="p-8 text-white space-y-6">
           <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-pink-400">
                <Calendar size={20} />
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase">Data</p>
                <p className="font-bold text-lg">{new Date(ticket.event_date).toLocaleDateString()}</p>
              </div>
           </div>
           
           <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-blue-400">
                <MapPin size={20} />
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase">Local</p>
                <p className="font-bold text-lg">{ticket.event_location}</p>
              </div>
           </div>

           <div className="border-t border-white/10 pt-6 flex justify-center">
             <div className="bg-white p-4 rounded-xl">
               <QRCodeSVG value={`TICKET-${ticket.id}`} size={160} />
             </div>
           </div>
           
           <div className="text-center">
             <p className="text-gray-400 text-xs">Participante</p>
             <p className="font-bold">{ticket.user_name}</p>
           </div>
        </div>

        {/* Botão Download */}
        <button onClick={() => window.print()} className="bg-white text-gray-900 font-bold py-4 hover:bg-gray-100 transition flex items-center justify-center gap-2">
          <Download size={18} /> Salvar Ticket
        </button>
      </div>
    </div>
  );
}