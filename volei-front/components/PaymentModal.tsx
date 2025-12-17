'use client';

import { useState } from 'react';
import { X, CreditCard, QrCode, CheckCircle, Lock } from 'lucide-react';

interface PaymentModalProps {
  eventTitle: string;
  price: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function PaymentModal({ eventTitle, price, onConfirm, onCancel }: PaymentModalProps) {
  const [method, setMethod] = useState<'card' | 'pix'>('card');
  const [loading, setLoading] = useState(false);

  function handlePay() {
    setLoading(true);
    // Simula delay de processamento bancário (2 segundos)
    setTimeout(() => {
      setLoading(false);
      onConfirm();
    }, 2000);
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden relative">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-white">
          <button onClick={onCancel} className="absolute top-4 right-4 text-white/70 hover:text-white transition">
            <X size={24} />
          </button>
          <h2 className="text-xl font-bold">Checkout Seguro</h2>
          <p className="text-purple-100 text-sm flex items-center gap-1 mt-1">
            <Lock size={12} /> Ambiente criptografado (Simulado)
          </p>
        </div>

        <div className="p-6">
          {/* Resumo */}
          <div className="mb-6 bg-gray-50 p-4 rounded-xl border border-gray-100">
            <p className="text-xs text-gray-500 uppercase font-bold">Evento</p>
            <p className="font-bold text-gray-800 truncate">{eventTitle}</p>
            <div className="mt-2 flex justify-between items-center border-t border-gray-200 pt-2">
              <span className="text-gray-600">Total a pagar:</span>
              <span className="text-xl font-bold text-purple-600">R$ {price}</span>
            </div>
          </div>

          {/* Seleção de Método */}
          <p className="font-bold text-gray-700 mb-3 text-sm">Forma de Pagamento</p>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <button 
              onClick={() => setMethod('card')}
              className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition ${method === 'card' ? 'border-purple-500 bg-purple-50 text-purple-700' : 'border-gray-100 text-gray-400 hover:border-gray-200'}`}
            >
              <CreditCard size={24} />
              <span className="text-xs font-bold">Cartão</span>
            </button>
            <button 
              onClick={() => setMethod('pix')}
              className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition ${method === 'pix' ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-100 text-gray-400 hover:border-gray-200'}`}
            >
              <QrCode size={24} />
              <span className="text-xs font-bold">Pix</span>
            </button>
          </div>

          {/* Conteúdo Dinâmico (Fake Form) */}
          {method === 'card' ? (
            <div className="space-y-3 mb-6 animate-in slide-in-from-left-4 fade-in">
              <input type="text" placeholder="Número do Cartão" className="w-full bg-gray-50 border border-gray-200 p-3 rounded-lg outline-none focus:border-purple-400" defaultValue="4444 5555 6666 7777" />
              <div className="flex gap-3">
                <input type="text" placeholder="MM/AA" className="w-1/2 bg-gray-50 border border-gray-200 p-3 rounded-lg outline-none" defaultValue="12/28" />
                <input type="text" placeholder="CVV" className="w-1/2 bg-gray-50 border border-gray-200 p-3 rounded-lg outline-none" defaultValue="123" />
              </div>
            </div>
          ) : (
            <div className="mb-6 text-center animate-in slide-in-from-right-4 fade-in bg-green-50 p-4 rounded-xl border border-green-100">
              <QrCode size={64} className="mx-auto text-green-600 mb-2" />
              <p className="text-xs text-green-700 font-bold">Escaneie para pagar instantaneamente</p>
            </div>
          )}

          {/* Botão de Ação */}
          <button 
            onClick={handlePay}
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-4 rounded-xl font-bold shadow-lg shadow-purple-200 hover:scale-[1.02] transition flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {loading ? 'Processando...' : <><CheckCircle size={20} /> Confirmar Pagamento</>}
          </button>
        </div>
      </div>
    </div>
  );
}