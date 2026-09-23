import { useEffect, useState } from 'react';
import { ShoppingCart, DollarSign, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface DashboardOrder {
  id: string;
  order_number: string;
  customer_name: string;
  scheduled_time: string;
  status: string;
  total: number;
  combo_name: string;
}

interface Metrics {
  totalOrders: number;
  totalValue: number;
  pendingOrders: number;
  readyOrders: number;
}

export default function Dashboard() {
  const [metrics, setMetrics] = useState<Metrics>({ totalOrders: 0, totalValue: 0, pendingOrders: 0, readyOrders: 0 });
  const [upcomingOrders, setUpcomingOrders] = useState<DashboardOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const today = new Date().toISOString().slice(0, 10);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      // Buscar todos os pedidos de hoje
      const { data: orders, error: err } = await supabase
        .from('orders')
        .select(`
          id,
          order_number,
          customer_name,
          scheduled_time,
          status,
          total,
          order_items ( combo_name )
        `)
        .eq('scheduled_date', today)
        .neq('status', 'cancelled')
        .order('scheduled_time', { ascending: true });

      if (err) throw err;

      const typedOrders = (orders || []) as any[];

      setMetrics({
        totalOrders: typedOrders.length,
        totalValue: typedOrders.reduce((sum, o) => sum + Number(o.total), 0),
        pendingOrders: typedOrders.filter(o => o.status === 'pending').length,
        readyOrders: typedOrders.filter(o => o.status === 'ready').length,
      });

      setUpcomingOrders(
        typedOrders.map(o => ({
          id: o.id,
          order_number: o.order_number,
          customer_name: o.customer_name,
          scheduled_time: o.scheduled_time,
          status: o.status,
          total: Number(o.total),
          combo_name: o.order_items?.[0]?.combo_name || '—',
        }))
      );
    } catch {
      setError('Não foi possível carregar os dados. Tente recarregar a página.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Atualizar a cada 60 segundos automaticamente
    const interval = setInterval(fetchData, 60_000);
    return () => clearInterval(interval);
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending': return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700">Pendente</span>;
      case 'confirmed': return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">Confirmado</span>;
      case 'in_production': return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">Em Produção</span>;
      case 'ready': return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">Pronto</span>;
      case 'completed': return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">Concluído</span>;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-4 rounded-xl bg-destructive/10 text-destructive text-sm font-medium border border-destructive/20 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          {error}
        </div>
      )}

      {/* Cards de métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-background rounded-xl p-6 border border-border shadow-sm flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Pedidos de Hoje</p>
              {loading ? (
                <div className="h-8 w-12 bg-muted rounded animate-pulse mt-1" />
              ) : (
                <h3 className="text-3xl font-bold mt-1">{metrics.totalOrders}</h3>
              )}
            </div>
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <ShoppingCart className="w-5 h-5" />
            </div>
          </div>
          <div className="text-sm text-muted-foreground font-medium">Ativos (excl. cancelados)</div>
        </div>

        <div className="bg-background rounded-xl p-6 border border-border shadow-sm flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Valor Agendado (Hoje)</p>
              {loading ? (
                <div className="h-8 w-24 bg-muted rounded animate-pulse mt-1" />
              ) : (
                <h3 className="text-3xl font-bold mt-1">
                  R$ {metrics.totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </h3>
              )}
            </div>
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="text-sm text-muted-foreground font-medium">Faturamento projetado</div>
        </div>

        <div className="bg-background rounded-xl p-6 border border-border shadow-sm flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Pedidos Pendentes</p>
              {loading ? (
                <div className="h-8 w-10 bg-muted rounded animate-pulse mt-1" />
              ) : (
                <h3 className="text-3xl font-bold mt-1">{metrics.pendingOrders}</h3>
              )}
            </div>
            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="text-sm text-muted-foreground font-medium">Aguardando confirmação</div>
        </div>

        <div className="bg-background rounded-xl p-6 border border-border shadow-sm flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Pedidos Prontos</p>
              {loading ? (
                <div className="h-8 w-10 bg-muted rounded animate-pulse mt-1" />
              ) : (
                <h3 className="text-3xl font-bold mt-1">{metrics.readyOrders}</h3>
              )}
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
              <CheckCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="text-sm text-muted-foreground font-medium">Aguardando retirada</div>
        </div>
      </div>

      {/* Tabela de Próximos Pedidos */}
      <div className="bg-background rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <h3 className="font-bold text-lg">Próximos Horários (Hoje)</h3>
          <button
            onClick={fetchData}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors font-medium"
          >
            Atualizar
          </button>
        </div>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-6 space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-10 bg-muted rounded-lg animate-pulse" />
              ))}
            </div>
          ) : upcomingOrders.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground">
              Nenhum pedido para hoje ainda.
            </div>
          ) : (
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/50 text-muted-foreground">
                <tr>
                  <th className="px-6 py-3 font-medium">Horário</th>
                  <th className="px-6 py-3 font-medium">Pedido</th>
                  <th className="px-6 py-3 font-medium">Cliente</th>
                  <th className="px-6 py-3 font-medium">Combo</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {upcomingOrders.map(order => (
                  <tr key={order.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 font-bold">{order.scheduled_time.substring(0, 5)}</td>
                    <td className="px-6 py-4 font-mono text-xs">{order.order_number}</td>
                    <td className="px-6 py-4 font-medium">{order.customer_name}</td>
                    <td className="px-6 py-4">{order.combo_name}</td>
                    <td className="px-6 py-4">{getStatusBadge(order.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
