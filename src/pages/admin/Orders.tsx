import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_whatsapp: string;
  scheduled_time: string;
  scheduled_date: string;
  status: string;
  total: number;
  combo_name: string;
}

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));

  const fetchOrders = async () => {
    setLoading(true);
    setError('');

    const { data, error: err } = await supabase
      .from('orders')
      .select(`
        id,
        order_number,
        customer_name,
        customer_whatsapp,
        scheduled_time,
        scheduled_date,
        status,
        total,
        order_items ( combo_name )
      `)
      .eq('scheduled_date', selectedDate)
      .neq('status', 'cancelled')
      .order('scheduled_time', { ascending: true });

    if (err) {
      setError('Não foi possível carregar os pedidos. Tente novamente.');
    } else {
      setOrders(
        ((data as any[]) || []).map(o => ({
          id: o.id,
          order_number: o.order_number,
          customer_name: o.customer_name,
          customer_whatsapp: o.customer_whatsapp,
          scheduled_time: o.scheduled_time,
          scheduled_date: o.scheduled_date,
          status: o.status,
          total: Number(o.total),
          combo_name: o.order_items?.[0]?.combo_name || '—',
        }))
      );
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, [selectedDate]);

  const updateStatus = async (orderId: string, newStatus: string) => {
    setUpdating(orderId);

    if (newStatus === 'cancelled') {
      // Usar a RPC cancel_booking para devolver capacidade ao horário
      const { data, error: rpcErr } = await supabase.rpc('cancel_booking', { p_order_id: orderId });
      if (rpcErr || !(data as any)?.success) {
        setError('Erro ao cancelar pedido. Tente novamente.');
        setUpdating(null);
        return;
      }
    } else {
      const { error: updateErr } = await supabase
        .from('orders')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', orderId);

      if (updateErr) {
        setError('Erro ao atualizar status. Tente novamente.');
        setUpdating(null);
        return;
      }
    }

    // Atualizar localmente (sem refetch completo)
    if (newStatus === 'cancelled') {
      setOrders(prev => prev.filter(o => o.id !== orderId));
    } else {
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    }
    setUpdating(null);
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold">Gestão de Pedidos</h2>
        <div className="flex items-center gap-3">
          <input
            type="date"
            value={selectedDate}
            onChange={e => setSelectedDate(e.target.value)}
            className="h-9 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={fetchOrders}
            disabled={loading}
            className="gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-destructive/10 text-destructive text-sm font-medium border border-destructive/20 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          {error}
        </div>
      )}

      <div className="bg-background rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-6 space-y-3">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-14 bg-muted rounded-lg animate-pulse" />
              ))}
            </div>
          ) : orders.length === 0 ? (
            <div className="p-16 text-center text-muted-foreground">
              Nenhum pedido para {new Date(selectedDate + 'T12:00:00Z').toLocaleDateString('pt-BR')}.
            </div>
          ) : (
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/50 text-muted-foreground border-b border-border">
                <tr>
                  <th className="px-6 py-4 font-medium">Pedido</th>
                  <th className="px-6 py-4 font-medium">Cliente</th>
                  <th className="px-6 py-4 font-medium">Combo</th>
                  <th className="px-6 py-4 font-medium">Horário</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {orders.map(order => {
                  const isUpdating = updating === order.id;
                  return (
                    <tr key={order.id} className={`hover:bg-muted/30 transition-colors ${isUpdating ? 'opacity-50' : ''}`}>
                      <td className="px-6 py-4 font-mono font-medium text-xs">{order.order_number}</td>
                      <td className="px-6 py-4">
                        <div className="font-semibold">{order.customer_name}</div>
                        <div className="text-xs text-muted-foreground">{order.customer_whatsapp}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium">{order.combo_name}</div>
                        <div className="text-xs font-semibold text-primary">
                          R$ {order.total.toFixed(2).replace('.', ',')}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-bold text-lg">{order.scheduled_time.substring(0, 5)}</td>
                      <td className="px-6 py-4">{getStatusBadge(order.status)}</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2 flex-wrap">
                          {order.status === 'pending' && (
                            <Button
                              size="sm"
                              disabled={isUpdating}
                              onClick={() => updateStatus(order.id, 'confirmed')}
                              className="h-8 text-xs"
                            >
                              Confirmar
                            </Button>
                          )}
                          {order.status === 'confirmed' && (
                            <Button
                              size="sm"
                              disabled={isUpdating}
                              onClick={() => updateStatus(order.id, 'in_production')}
                              className="h-8 text-xs bg-purple-600 hover:bg-purple-700"
                            >
                              Produzir
                            </Button>
                          )}
                          {order.status === 'in_production' && (
                            <Button
                              size="sm"
                              disabled={isUpdating}
                              onClick={() => updateStatus(order.id, 'ready')}
                              className="h-8 text-xs bg-green-600 hover:bg-green-700"
                            >
                              Pronto
                            </Button>
                          )}
                          {order.status === 'ready' && (
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={isUpdating}
                              onClick={() => updateStatus(order.id, 'completed')}
                              className="h-8 text-xs"
                            >
                              Concluir
                            </Button>
                          )}
                          {['pending', 'confirmed'].includes(order.status) && (
                            <Button
                              size="sm"
                              variant="ghost"
                              disabled={isUpdating}
                              className="h-8 text-xs text-destructive hover:text-destructive"
                              onClick={() => updateStatus(order.id, 'cancelled')}
                            >
                              Cancelar
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
