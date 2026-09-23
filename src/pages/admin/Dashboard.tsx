import { ShoppingCart, DollarSign, Clock, CheckCircle } from 'lucide-react';

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-background rounded-xl p-6 border border-border shadow-sm flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Pedidos de Hoje</p>
              <h3 className="text-3xl font-bold mt-1">12</h3>
            </div>
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <ShoppingCart className="w-5 h-5" />
            </div>
          </div>
          <div className="text-sm text-green-600 font-medium">+3 desde a última hora</div>
        </div>

        <div className="bg-background rounded-xl p-6 border border-border shadow-sm flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Valor Agendado (Hoje)</p>
              <h3 className="text-3xl font-bold mt-1">R$ 1.250</h3>
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
              <h3 className="text-3xl font-bold mt-1">5</h3>
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
              <h3 className="text-3xl font-bold mt-1">4</h3>
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
        <div className="px-6 py-4 border-b border-border">
          <h3 className="font-bold text-lg">Próximos Horários (Hoje)</h3>
        </div>
        <div className="overflow-x-auto">
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
              {['18:00', '18:30', '19:00', '19:00'].map((time, i) => (
                <tr key={i} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 font-bold">{time}</td>
                  <td className="px-6 py-4 font-mono text-xs">#FP-{1024+i}</td>
                  <td className="px-6 py-4 font-medium">João {i+1} da Silva</td>
                  <td className="px-6 py-4">Combo 50 Unidades</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                      Pendente
                    </span>
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
