'use client';

import { useState, useEffect } from 'react';
import { api } from '@/services/api';
import { UserPlus, UserMinus, Search, UserCheck, Clock } from 'lucide-react';

export default function CommunityPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [myFriendships, setMyFriendships] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  // 1. Estado da Busca
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const userData = localStorage.getItem('user_data');
    if (userData) {
      const user = JSON.parse(userData);
      setCurrentUser(user);
      loadData(user.id);
    }
  }, []);

  async function loadData(userId: number) {
    try {
      const resUsers = await api.get(`/users_to_add?current_user_id=${userId}`);
      const resFriends = await api.get(`/friendships/my?user_id=${userId}`);
      setUsers(resUsers.data);
      setMyFriendships(resFriends.data);
    } catch (error) { console.error(error); }
  }

  function findFriendship(otherUserEmail: string) {
    return myFriendships.find((f: any) => f.friend_email === otherUserEmail);
  }

  async function handleAction(otherUser: any) {
    const friendship = findFriendship(otherUser.email);
    if (friendship) {
      if(!confirm("Tem certeza?")) return;
      await api.delete(`/friendships/${friendship.id}`);
    } else {
      await api.post('/friendships', { requester_id: currentUser.id, receiver_id: otherUser.id });
    }
    loadData(currentUser.id);
  }

  async function acceptFriend(id: number) {
     await api.put(`/friendships/${id}`, { status: 'accepted' });
     loadData(currentUser.id);
  }

  // 2. Filtragem de Usuários (Nome ou Cidade)
  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (u.city && u.city.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Comunidade</h1>
          <p className="text-gray-500">Conecte-se com outros participantes.</p>
        </div>
        {/* Input de Busca Ativo */}
        <div className="bg-gray-100 p-2 rounded-lg flex items-center gap-2 text-gray-400 w-full md:w-auto transition focus-within:ring-2 focus-within:ring-blue-200 focus-within:bg-white">
           <Search size={20} />
           <input 
             placeholder="Buscar pessoas..." 
             className="bg-transparent outline-none w-full"
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)} // <--- Conectado
           />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.length === 0 ? (
          <p className="col-span-3 text-center text-gray-500 py-10">Ninguém encontrado com esse nome.</p>
        ) : filteredUsers.map((u) => {
          const friendship = findFriendship(u.email);
          const isPending = friendship?.status === 'pending';
          const isFriend = friendship?.status === 'accepted';
          const isReceived = isPending && friendship.direction === 'received';

          return (
            <div key={u.id} className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition border border-gray-100 flex flex-col items-center text-center relative overflow-hidden group">
               <div className="absolute top-0 w-full h-20 bg-gradient-to-r from-purple-400 to-blue-400 opacity-20 group-hover:opacity-30 transition"></div>
               
               <div className="w-20 h-20 bg-white p-1 rounded-full relative z-10 mt-4 shadow-sm">
                 <div className="w-full h-full bg-gradient-to-tr from-purple-600 to-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                   {u.name.charAt(0)}
                 </div>
               </div>
               
               <h3 className="font-bold text-lg mt-3 text-gray-800">{u.name}</h3>
               <p className="text-sm text-gray-500 mb-6">{u.city || "Membro EventSync"}</p>

               {isReceived ? (
                 <button onClick={() => acceptFriend(friendship.id)} className="bg-green-500 text-white px-6 py-2 rounded-full font-bold shadow-green-200 shadow-lg hover:scale-105 transition flex items-center gap-2">
                   <UserCheck size={18}/> Aceitar
                 </button>
               ) : (
                 <button 
                  onClick={() => handleAction(u)}
                  className={`px-6 py-2 rounded-full font-bold shadow-lg transition flex items-center gap-2 w-full justify-center ${
                    isFriend 
                      ? 'bg-red-50 text-red-500 hover:bg-red-100 shadow-red-100' 
                      : isPending 
                        ? 'bg-yellow-50 text-yellow-600 cursor-default'
                        : 'bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:scale-105 shadow-purple-200'
                  }`}
                 >
                   {isFriend ? <><UserMinus size={18}/> Desconectar</> : 
                    isPending ? <><Clock size={18}/> Pendente</> : 
                    <><UserPlus size={18}/> Conectar</>}
                 </button>
               )}
            </div>
          );
        })}
      </div>
    </div>
  );
}