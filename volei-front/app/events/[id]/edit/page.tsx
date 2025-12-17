'use client';
// (Reutilizando a lógica do NewEventPage, mas com PUT e pré-carregamento)
import { useState, useEffect } from 'react';
import { api } from '@/services/api';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';
import Link from 'next/link';

export default function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [id, setId] = useState('');
  const [formData, setFormData] = useState<any>(null);

  useEffect(() => {
    params.then(p => {
      setId(p.id);
      loadEvent(p.id);
    });
  }, [params]);

  async function loadEvent(eventId: string) {
    try {
      const res = await api.get('/events');
      const evt = res.data.find((e:any) => e.id == eventId);
      if(evt) {
        // Separa data e hora para os inputs
        const dateObj = new Date(evt.date);
        const datePart = dateObj.toISOString().split('T')[0];
        const timePart = dateObj.toTimeString().slice(0,5);
        
        setFormData({ ...evt, datePart, timePart });
      }
    } catch (e) { alert("Erro ao carregar."); }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    try {
      const fullDateTime = `${formData.datePart}T${formData.timePart}`;
      await api.put(`/events/${id}`, {
        ...formData,
        date: fullDateTime
      });
      alert('Evento atualizado!');
      router.push(`/events/${id}`);
    } catch (e) { alert("Erro ao salvar."); }
  }

  async function handleDelete() {
    if(!confirm("Tem certeza? Isso cancelará o evento para todos.")) return;
    try {
      await api.delete(`/events/${id}`);
      alert("Evento excluído.");
      router.push('/');
    } catch (e) { alert("Erro ao excluir."); }
  }

  if (!formData) return <div>Carregando...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex justify-center">
      <div className="w-full max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Editar Evento</h1>
          <Link href={`/events/${id}`} className="text-gray-500 hover:text-purple-600"><ArrowLeft /></Link>
        </div>

        <form onSubmit={handleSave} className="bg-white p-8 rounded-2xl shadow-lg space-y-4">
           {/* Inputs Iguais ao de Criar */}
           <input className="w-full border p-3 rounded-lg" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="Título" />
           <input className="w-full border p-3 rounded-lg" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} placeholder="Local" />
           <div className="flex gap-4">
             <input type="date" className="w-full border p-3 rounded-lg" value={formData.datePart} onChange={e => setFormData({...formData, datePart: e.target.value})} />
             <input type="time" className="w-full border p-3 rounded-lg" value={formData.timePart} onChange={e => setFormData({...formData, timePart: e.target.value})} />
           </div>
           <textarea className="w-full border p-3 rounded-lg h-32" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Descrição" />
           
           <div className="flex gap-4 pt-4 border-t mt-4">
             <button type="button" onClick={handleDelete} className="px-4 py-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg flex items-center gap-2 font-bold"><Trash2 size={18}/> Excluir Evento</button>
             <button type="submit" className="flex-1 bg-purple-600 text-white py-2 rounded-lg font-bold hover:bg-purple-700 flex justify-center items-center gap-2"><Save size={18}/> Salvar Alterações</button>
           </div>
        </form>
      </div>
    </div>
  );
}