import { Outlet, Navigate, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ShoppingCart, CalendarDays, Pizza, Settings, LogOut, ShieldX } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading, isSuperAdmin, signOut } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/20">
        <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  // Usuário autenticado mas sem a role super_admin
  if (!isSuperAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/20 px-4">
        <div className="text-center space-y-4 max-w-sm">
          <div className="w-16 h-16 bg-destructive/10 rounded-2xl flex items-center justify-center mx-auto">
            <ShieldX className="w-8 h-8 text-destructive" />
          </div>
          <h1 className="text-xl font-bold text-foreground">Acesso Negado</h1>
          <p className="text-muted-foreground text-sm">
            Sua conta não tem permissão de acesso ao painel admin.
          </p>
          <button
            onClick={async () => { await signOut(); navigate('/admin/login', { replace: true }); }}
            className="text-sm text-primary hover:underline font-medium"
          >
            Sair e usar outra conta
          </button>
        </div>
      </div>
    );
  }

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login', { replace: true });
  };

  const menu = [
    { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard className="w-5 h-5" /> },
    { name: 'Pedidos', path: '/admin/orders', icon: <ShoppingCart className="w-5 h-5" /> },
    { name: 'Agenda', path: '/admin/schedule', icon: <CalendarDays className="w-5 h-5" /> },
    { name: 'Combos', path: '/admin/combos', icon: <Pizza className="w-5 h-5" /> },
    { name: 'Configurações', path: '/admin/settings', icon: <Settings className="w-5 h-5" /> },
  ];

  const userEmail = user.email || 'Admin';
  const initials = userEmail.slice(0, 2).toUpperCase();

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
          <div className="px-4 py-2 mb-2">
            <p className="text-xs text-background/50 truncate">{userEmail}</p>
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-background/80 hover:bg-background/10 w-full transition-colors"
          >
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
          <div className="flex items-center gap-3 text-sm font-medium">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
              {initials}
            </div>
            <span className="hidden sm:block text-muted-foreground">{userEmail}</span>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
