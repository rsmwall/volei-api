'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Users, Ticket, PlusCircle, LogOut, Calendar } from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();

  const menuItems = [
    { name: 'Dashboard', icon: Home, path: '/' },
    { name: 'Comunidade', icon: Users, path: '/community' },
    // Se tivermos uma rota de tickets separada listada, colocamos aqui, 
    // mas por enquanto eles aparecem na dashboard.
  ];

  return (
    <aside className="w-64 bg-white h-screen fixed left-0 top-0 shadow-xl z-50 hidden md:flex flex-col">
      {/* Logo / Brand */}
      <div className="h-20 flex items-center px-8 border-b border-gray-100">
        <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent flex items-center gap-2">
          <Calendar className="text-purple-600" /> EventSync
        </div>
      </div>

      {/* Menu Links */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Principal</p>
        
        {menuItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link 
              key={item.path} 
              href={item.path}
              className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200 font-medium ${
                isActive 
                  ? 'bg-purple-50 text-purple-700 shadow-sm border-l-4 border-purple-600' 
                  : 'text-gray-500 hover:bg-gray-50 hover:text-purple-600'
              }`}
            >
              <item.icon size={20} />
              {item.name}
            </Link>
          );
        })}

        <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider mt-8 mb-2">Ações</p>
        <Link 
            href="/events/new"
            className="w-full flex items-center gap-4 px-4 py-3 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition"
            >
            <PlusCircle size={20} /> Criar Evento
        </Link>
      </nav>

      {/* Footer Sidebar */}
      <div className="p-4 border-t border-gray-100">
        <button 
          onClick={() => { localStorage.clear(); window.location.href = '/login'; }}
          className="flex items-center gap-2 text-gray-400 hover:text-red-500 transition px-4 py-2 text-sm font-bold"
        >
          <LogOut size={16} /> Sair
        </button>
      </div>
    </aside>
  );
}