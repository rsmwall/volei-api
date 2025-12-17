'use client';

import { useState, useEffect } from 'react';
import { api } from '@/services/api';
import PaymentModal from '@/components/PaymentModal';
import Link from 'next/link';
import { 
  ArrowLeft, Calendar, MapPin, User, CheckCircle, 
  XCircle, Edit, ClipboardList, Star, MessageSquare 
} from 'lucide-react';

export default function EventDetails({ params }: { params: Promise<{ id: string }> }) {
  const [id, setId] = useState<string>('');
  const [event, setEvent] = useState<any>(null);
  const [participants, setParticipants] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [isInscribed, setIsInscribed] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [newReview, setNewReview] = useState({ score: 5, comment: '' });
  const [showPayment, setShowPayment] = useState(false);
  const [pendingRegId, setPendingRegId] = useState<number | null>(null);

  useEffect(() => {
    params.then(p => { setId(p.id); loadData(p.id); });
    const u = localStorage.getItem('user_data');
    if(u) setCurrentUser(JSON.parse(u));
  }, [params]);

  async function loadData(eventId: string) {
    try {
      // 1. Carrega Evento
      const resEvents = await api.get('/events');
      const found = resEvents.data.find((e: any) => e.id == eventId);
      setEvent(found);

      // 2. Carrega Participantes
      const resPart = await api.get(`/events/${eventId}/participants`);
      setParticipants(resPart.data);

      // 3. Verifica Inscrição
      const u = JSON.parse(localStorage.getItem('user_data') || '{}');
      const amIIn = resPart.data.some((p: any) => p.email === u.email);
      setIsInscribed(amIIn);

      // 4. Carrega Reviews
      const resReviews = await api.get(`/events/${eventId}/reviews`);
      setReviews(resReviews.data);

    } catch (e) { console.error(e); }
  }

  async function toggleSubscription() {
    if (!currentUser) return alert("Faça login primeiro!");
    
    try {
      if (isInscribed) {
        // CANCELAR (Lógica igual)
        if(!confirm("Deseja realmente cancelar?")) return;
        await api.post('/registrations/cancel', { user_id: currentUser.id, event_id: id });
        alert("Inscrição cancelada.");
        loadData(id);
      } else {
        // INSCREVER (Nova Lógica com Pagamento)
        
        // 1. Cria a inscrição inicial (Backend decide se é pendente ou confirmada baseada no preço)
        const res = await api.post('/registrations', { user_id: currentUser.id, event_id: id });
        console.log("Resposta da Inscrição:", res.data);
        
        if (res.data.requires_payment) {
          // SE FOR PAGO: Salva o ID da inscrição criada e abre o modal
          setPendingRegId(res.data.id);
          setShowPayment(true);
        } else {
          // SE FOR GRÁTIS: Já está confirmado
          alert("Inscrição confirmada! 🎟️");
          loadData(id);
        }
      }
    } catch (e) { alert("Erro ao processar."); }
  }

  // NOVA FUNÇÃO: Chamada quando o usuário clica em "Pagar" no modal
  async function handlePaymentSuccess() {
    try {
      if (pendingRegId) {
        await api.put(`/registrations/${pendingRegId}/pay`);
        setShowPayment(false); // Fecha modal
        alert("Pagamento aprovado! Inscrição confirmada. 🎉");
        loadData(id); // Atualiza tela (botão vira 'Cancelar')
      }
    } catch (e) { alert("Erro ao confirmar pagamento."); }
  }

  async function handleReview(e: React.FormEvent) {
    e.preventDefault();
    try {
      await api.post('/reviews', { 
        event_id: id, 
        user_id: currentUser.id, 
        ...newReview 
      });
      setNewReview({ score: 5, comment: '' });
      loadData(id);
    } catch(e) { alert("Erro ao enviar avaliação."); }
  }

  if (!event) return null;

  const isOwner = currentUser && (String(currentUser.id) === String(event.user_id));
  const isPaid = parseFloat(event.price) > 0;

  return (
    <div className="space-y-6 pb-20">
      {/* 1. Header de Navegação */}
      <div className="flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 text-gray-500 hover:text-purple-600 font-bold transition bg-white px-4 py-2 rounded-full shadow-sm">
          <ArrowLeft size={20} /> Voltar
        </Link>
        {isOwner && (
          <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            Você é o organizador
          </span>
        )}
      </div>

      {/* 2. Banner e Título Principal (Hero Section) */}
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
        {/* Banner colorido */}
        <div className={`h-64 w-full bg-gradient-to-r ${isPaid ? 'from-orange-400 to-pink-600' : 'from-blue-500 to-cyan-400'} relative`}>
           <div className="absolute inset-0 bg-black/10"></div>
           <div className="absolute bottom-6 left-6 md:left-10 text-white">
              <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-lg text-sm font-bold border border-white/30">
                {event.category}
              </span>
              <h1 className="text-3xl md:text-5xl font-bold mt-3 shadow-black drop-shadow-md">
                {event.title}
              </h1>
           </div>
        </div>

        {/* Barra de Informações Rápidas */}
        <div className="flex flex-col md:flex-row border-b border-gray-100">
           <div className="flex-1 p-6 flex items-center gap-4 border-b md:border-b-0 md:border-r border-gray-100">
              <div className="bg-blue-50 p-3 rounded-full text-blue-600"><Calendar size={24}/></div>
              <div>
                <p className="text-xs text-gray-400 uppercase font-bold">Data e Hora</p>
                <p className="font-semibold text-gray-800">{new Date(event.date).toLocaleString()}</p>
              </div>
           </div>
           <div className="flex-1 p-6 flex items-center gap-4">
              <div className="bg-red-50 p-3 rounded-full text-red-600"><MapPin size={24}/></div>
              <div>
                <p className="text-xs text-gray-400 uppercase font-bold">Localização</p>
                <p className="font-semibold text-gray-800">{event.location}</p>
              </div>
           </div>
        </div>
      </div>

      {/* 3. Layout de Colunas: Esquerda (Conteúdo) x Direita (Ações) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* COLUNA ESQUERDA (2/3) - Descrição e Reviews */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Card Descrição */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <ClipboardList className="text-purple-500"/> Sobre o Evento
            </h2>
            <div className="prose text-gray-600 leading-relaxed whitespace-pre-line">
              {event.description || "O organizador não forneceu uma descrição detalhada."}
            </div>
          </div>

          {/* Card Reviews */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Star className="text-yellow-500 fill-yellow-500"/> Avaliações
            </h2>
            
            <div className="space-y-4">
              {reviews.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-xl">
                  <p className="text-gray-400">Nenhuma avaliação ainda. Seja o primeiro!</p>
                </div>
              ) : reviews.map(r => (
                <div key={r.id} className="bg-gray-50 p-4 rounded-xl">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-gray-700">{r.user_name}</span>
                    <div className="flex text-yellow-400 text-sm">{'★'.repeat(r.score)}</div>
                  </div>
                  <p className="text-gray-600 text-sm italic">"{r.comment}"</p>
                </div>
              ))}
            </div>

            {/* Form de Review */}
            {currentUser && (
              <form onSubmit={handleReview} className="mt-8 pt-8 border-t border-gray-100">
                <h3 className="font-bold text-gray-700 mb-3 text-sm">Escrever avaliação</h3>
                <div className="flex gap-2 mb-3">
                  {[1,2,3,4,5].map(s => (
                    <button key={s} type="button" onClick={() => setNewReview({...newReview, score: s})} 
                      className={`text-2xl transition hover:scale-110 ${s <= newReview.score ? 'text-yellow-400' : 'text-gray-200'}`}>★</button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-4 outline-none focus:ring-2 focus:ring-purple-200" 
                    placeholder="Deixe seu comentário..." value={newReview.comment} onChange={e => setNewReview({...newReview, comment: e.target.value})} required/>
                  <button className="bg-purple-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-purple-700 transition"><MessageSquare size={18}/></button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* COLUNA DIREITA (1/3) - Card Flutuante de Ação */}
        <div className="space-y-6">
          
          {/* 1. Card de Inscrição / Preço (STICKY) */}
          <div className="bg-white p-6 rounded-3xl shadow-lg border border-purple-100 sticky top-4">
            <div className="flex justify-between items-end mb-6 border-b border-gray-100 pb-4">
              <div>
                <p className="text-sm text-gray-400 font-bold uppercase">Valor da Entrada</p>
                <p className={`text-3xl font-bold ${isPaid ? 'text-orange-500' : 'text-green-500'}`}>
                  {isPaid ? `R$ ${event.price}` : 'Grátis'}
                </p>
              </div>
              <div className="text-right">
                 <p className={`text-xs px-2 py-1 rounded font-bold ${isInscribed ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                   {isInscribed ? 'Confirmado' : 'Aberto'}
                 </p>
              </div>
            </div>

            <button 
              onClick={toggleSubscription}
              className={`w-full py-4 rounded-xl font-bold text-lg shadow-md hover:shadow-xl hover:scale-[1.02] transition flex justify-center items-center gap-2 ${
                isInscribed 
                  ? 'bg-red-50 text-red-500 hover:bg-red-100' 
                  : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
              }`}
            >
              {isInscribed ? <><XCircle /> Cancelar Inscrição</> : <><CheckCircle /> Garantir Vaga</>}
            </button>

            {/* Botões do Organizador (Só aparecem se for o dono) */}
            {isOwner && (
              <div className="grid grid-cols-2 gap-2 mt-4">
                <Link href={`/events/${id}/manage`} className="bg-blue-50 text-blue-600 py-2 rounded-lg font-bold text-sm text-center hover:bg-blue-100 flex items-center justify-center gap-1">
                  <ClipboardList size={16}/> Gerenciar
                </Link>
                <Link href={`/events/${id}/edit`} className="bg-gray-100 text-gray-600 py-2 rounded-lg font-bold text-sm text-center hover:bg-gray-200 flex items-center justify-center gap-1">
                  <Edit size={16}/> Editar
                </Link>
              </div>
            )}
          </div>

          {/* 2. Card de Participantes */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center justify-between">
              <span className="flex items-center gap-2"><User size={18} className="text-purple-500"/> Quem vai?</span>
              <span className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full">{participants.length}</span>
            </h3>
            
            <div className="flex flex-wrap gap-2">
              {participants.length === 0 ? <p className="text-gray-400 text-sm">Seja o primeiro!</p> : participants.map(p => (
                <div key={p.registration_id} className="relative group cursor-pointer">
                   <div className="w-10 h-10 rounded-full bg-gray-200 border-2 border-white shadow-sm flex items-center justify-center font-bold text-gray-500 overflow-hidden">
                     {p.photo_url ? <img src={p.photo_url} alt={p.name} /> : p.name.charAt(0)}
                   </div>
                   {/* Tooltip simples */}
                   <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap pointer-events-none">
                     {p.name}
                   </div>
                </div>
              ))}
              {participants.length > 8 && (
                <div className="w-10 h-10 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-xs font-bold text-gray-500">
                  +{participants.length - 8}
                </div>
              )}
            </div>
          </div>

          {/* 3. Card do Organizador */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4">
             <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold text-xl">
               {event.organizer?.name?.charAt(0) || "O"}
             </div>
             <div>
               <p className="text-xs text-gray-400 uppercase font-bold">Organizado por</p>
               <p className="font-bold text-gray-800">{event.organizer?.name || "Desconhecido"}</p>
             </div>
          </div>

        </div>
      </div>

      {/* MODAL DE PAGAMENTO */}
      {showPayment && event && (
        <PaymentModal 
          eventTitle={event.title}
          price={event.price}
          onConfirm={handlePaymentSuccess}
          onCancel={() => setShowPayment(false)}
        />
      )}
    </div>
  );
}