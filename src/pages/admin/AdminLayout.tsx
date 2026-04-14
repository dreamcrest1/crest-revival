import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';

const AdminLayout = () => {
  const { user, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!user || !isAdmin) return <Navigate to="/admin/login" replace />;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full relative z-10">
        <AdminSidebar />
        <div className="flex-1 flex flex-col min-h-screen">
          <header className="h-14 flex items-center border-b border-border bg-card/80 backdrop-blur-sm px-4 gap-4">
            <SidebarTrigger />
            <span className="font-display font-semibold text-foreground">Dreamcrest Admin</span>
          </header>
          <main className="flex-1 p-6 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;
