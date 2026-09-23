import { useState } from 'react';
import { Button } from '@/components/ui/button';

const mockOrders = [
  { id: '1', number: 'FP-1024', customer: 'João da Silva', whatsapp: '(22) 99999-9999', combo: 'Combo 50 Unidades', total: 99.90, time: '18:00', status: 'pending' },
  { id: '2', number: 'FP-1025', customer: 'Maria Oliveira', whatsapp: '(22) 98888-8888', combo: 'Combo 30 Unidades', total: 59.90, time: '18:30', status: 'confirmed' },
  { id: '3', number: 'FP-1026', customer: 'Pedro Santos', whatsapp: '(22) 97777-7777', combo: 'Combo 50 Unidades', total: 99.90, time: '19:00', status: 'in_production' },
];

export default function Orders() {
  const [orders, setOrders] = useState(mockOrders);

  const updateStatus = (id: string, newStatus: string) => {
    setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending': return <span className="px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700">Pendente</span>;
      case 'confirmed': return <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">Confirmado</span>;
      case 'in_production': return <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">Em Produção</span>;
      case 'ready': return <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">Pronto</span>;
      case 'completed': return <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">Concluído</span>;
      case 'cancelled': return <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">Cancelado</span>;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestão de Pedidos</h2>
        <div className="flex gap-2">
          <Button variant="outline">Filtros</Button>
        </div>
      </div>

      <div className="bg-background rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground border-b border-border">
              <tr>
                <th className="px-6 py-4 font-medium">Pedido</th>
                <th className="px-6 py-4 font-medium">Cliente</th>
                <th className="px-6 py-4 font-medium">Combo</th>
                <th className="px-6 py-4 font-medium">Horário (Hoje)</th>
                <th className="px-6 py-4 font-medium">Status Atual</th>
                <th className="px-6 py-4 font-medium">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 font-mono font-medium">{order.number}</td>
                  <td className="px-6 py-4">
                    <div className="font-semibold">{order.customer}</div>
                    <div className="text-xs text-muted-foreground">{order.whatsapp}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium">{order.combo}</div>
                    <div className="text-xs font-semibold text-primary">R$ {order.total.toFixed(2).replace('.',',')}</div>
                  </td>
                  <td className="px-6 py-4 font-bold text-lg">{order.time}</td>
                  <td className="px-6 py-4">{getStatusBadge(order.status)}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      {order.status === 'pending' && <Button size="sm" onClick={() => updateStatus(order.id, 'confirmed')} className="h-8 text-xs">Confirmar</Button>}
                      {order.status === 'confirmed' && <Button size="sm" onClick={() => updateStatus(order.id, 'in_production')} className="h-8 text-xs bg-purple-600 hover:bg-purple-700">Produzir</Button>}
                      {order.status === 'in_production' && <Button size="sm" onClick={() => updateStatus(order.id, 'ready')} className="h-8 text-xs bg-green-600 hover:bg-green-700">Pronto</Button>}
                      {order.status === 'ready' && <Button size="sm" onClick={() => updateStatus(order.id, 'completed')} variant="outline" className="h-8 text-xs">Concluir</Button>}
                      {['pending', 'confirmed'].includes(order.status) && (
                        <Button size="sm" variant="ghost" className="h-8 text-xs text-destructive hover:text-destructive" onClick={() => updateStatus(order.id, 'cancelled')}>Cancelar</Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
