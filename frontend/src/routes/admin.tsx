import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import api from '../lib/api';
import { 
  Users, 
  ShieldCheck, 
  LogOut, 
  ChevronLeft,
  LayoutDashboard
} from 'lucide-react';
import { Link, useNavigate } from '@tanstack/react-router';

export const Route = createFileRoute('/admin' as any)({
  beforeLoad: async () => {
    try {
      const response = await api.get('/auth/me');
      if (!response.data.is_superadmin) {
        throw redirect({ to: '/dashboard' });
      }
    } catch (err) {
      throw redirect({ to: '/login' });
    }
  },
  component: AdminLayout,
});

function AdminLayout() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-rose-50 flex flex-col hidden md:flex sticky top-0 h-screen">
        <div className="p-8 flex items-center gap-3">
          <div className="w-10 h-10 bg-foreground rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-rose-200">Y</div>
          <div>
            <h1 className="font-heading font-bold text-xl text-foreground leading-none">Admin Hub</h1>
            <p className="text-[8px] font-bold text-rose-300 uppercase tracking-widest leading-none mt-1">YumYum Core</p>
          </div>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2">
          <Link 
            to="/admin" 
            className="flex items-center gap-3 px-4 py-3 rounded-2xl text-rose-300 font-bold hover:bg-rose-50 hover:text-primary transition-colors [&.active]:bg-primary [&.active]:text-white [&.active]:shadow-xl [&.active]:shadow-rose-100"
          >
            <LayoutDashboard className="h-5 w-5" />
            Dashboard
          </Link>
          <Link 
            to="/dashboard" 
            className="flex items-center gap-3 px-4 py-3 rounded-2xl text-rose-300 font-bold hover:bg-rose-50 hover:text-primary transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
            Back to Vendor Hub
          </Link>
        </nav>

        <div className="p-4 border-t border-rose-50">
          <button 
            onClick={() => {
                localStorage.removeItem('token');
                navigate({ to: '/login' });
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-rose-200 font-bold hover:bg-rose-50 hover:text-red-500 transition-colors"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto">
        <header className="md:hidden bg-white/80 backdrop-blur-xl px-6 py-6 border-b border-rose-50 flex items-center justify-between sticky top-0 z-20">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-foreground rounded-xl flex items-center justify-center text-white font-bold">Y</div>
                <h1 className="font-heading font-bold text-xl text-foreground">Admin</h1>
            </div>
            <ShieldCheck className="h-6 w-6 text-primary" />
        </header>
        <div className="p-6 md:p-12">
            <Outlet />
        </div>
      </main>
    </div>
  );
}
