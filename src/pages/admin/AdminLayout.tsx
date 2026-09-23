import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, ShoppingCart, CalendarDays, Pizza, Settings, LogOut } from 'lucide-react';

export default function AdminLayout() {
  const location = useLocation();
  
  // TODO: Integrar com Supabase Auth real
  const isAuthenticated = true; // Mock para visualização inicial

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  const menu = [
    { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard className="w-5 h-5" /> },
    { name: 'Pedidos', path: '/admin/orders', icon: <ShoppingCart className="w-5 h-5" /> },
    { name: 'Agenda', path: '/admin/schedule', icon: <CalendarDays className="w-5 h-5" /> },
    { name: 'Combos', path: '/admin/combos', icon: <Pizza className="w-5 h-5" /> },
    { name: 'Configurações', path: '/admin/settings', icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <div className="flex h-screen bg-muted/20">
      {/* Sidebar */}
      <aside className="w-64 bg-foreground text-background flex flex-col">
        <div className="h-20 flex items-center px-6 border-b border-background/10 py-3">
          <img src="/logo.jpg" alt="Fábrica de Pizzas" className="h-full w-auto object-contain bg-white rounded-lg p-1.5" />
        </div>
        
        <nav className="flex-1 py-6 px-4 space-y-1">
          {menu.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive ? 'bg-primary text-primary-foreground font-medium' : 'hover:bg-background/10 text-background/80'
                }`}
              >
                {item.icon}
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-background/10">
          <button className="flex items-center gap-3 px-4 py-3 rounded-lg text-background/80 hover:bg-background/10 w-full transition-colors">
            <LogOut className="w-5 h-5" />
            Sair
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-background border-b border-border flex items-center justify-between px-8">
          <h2 className="font-semibold text-lg text-foreground">
            {menu.find(m => m.path === location.pathname)?.name || 'Admin'}
          </h2>
          <div className="flex items-center gap-4 text-sm font-medium">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              AD
            </div>
            <span>Administrador</span>
          </div>
        </header>
        
        <div className="flex-1 overflow-auto p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
