import Link from 'next/link';
import { Trophy, Users } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="bg-blue-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <Trophy size={24} /> Vôlei Manager
        </h1>
        <div className="flex gap-6">
          <Link href="/" className="flex items-center gap-1 hover:text-blue-200 transition">
            <Trophy size={18} /> Partidas
          </Link>
          <Link href="/players" className="flex items-center gap-1 hover:text-blue-200 transition">
            <Users size={18} /> Jogadores
          </Link>
        </div>
      </div>
    </nav>
  );
}