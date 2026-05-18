import { LayoutDashboard, Package, FileText, BarChart3, LogOut, Home, Search, AlertCircle, Star, BookOpen, Filter, Megaphone, MousePointerClick, Globe, SearchCheck, Sparkles } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import logo from '@/assets/logo.png';

const menuItems = [
  { title: 'Dashboard', url: '/admin/dashboard', icon: LayoutDashboard },
  { title: 'Products', url: '/admin/products', icon: Package },
  { title: 'Reviews', url: '/admin/reviews', icon: Star },
  { title: 'Blog', url: '/admin/blog', icon: BookOpen },
  { title: 'Pages', url: '/admin/pages', icon: FileText },
  { title: 'Analytics', url: '/admin/analytics', icon: BarChart3 },
  { title: 'Funnel', url: '/admin/funnel', icon: Filter },
  { title: 'UTM', url: '/admin/utm', icon: Megaphone },
  { title: 'Heatmap', url: '/admin/heatmap', icon: MousePointerClick },
  { title: 'Geo', url: '/admin/geo', icon: Globe },
  { title: 'Search Queries', url: '/admin/search-queries', icon: SearchCheck },
  { title: 'SEO Audit', url: '/admin/seo-audit', icon: Search },
  { title: 'Error Logs', url: '/admin/errors', icon: AlertCircle },
];

const AdminSidebar = () => {
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';
  const location = useLocation();
  const { signOut, user } = useAuth();

  const isItemActive = (url: string) => {
    if (url === '/admin/dashboard') {
      return location.pathname === '/admin' || location.pathname === '/admin/dashboard';
    }

    return location.pathname.startsWith(url);
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-border">
      <SidebarContent className="bg-card/80 backdrop-blur-sm">
        <div className="p-4 flex items-center gap-3 border-b border-border">
          <img src={logo} alt="Dreamcrest" className="w-8 h-8 rounded-lg shrink-0" />
          {!collapsed && <span className="font-display font-bold text-foreground">Admin</span>}
        </div>

        <SidebarGroup>
          <SidebarGroupLabel>Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map(item => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isItemActive(item.url)} tooltip={item.title}>
                    <Link to={item.url}>
                      <item.icon className="mr-2 h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Quick Links</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="View Site">
                  <Link to="/" className="text-muted-foreground">
                    <Home className="mr-2 h-4 w-4" />
                    {!collapsed && <span>View Site</span>}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="bg-card/80 backdrop-blur-sm border-t border-border p-3">
        {!collapsed && user && (
          <p className="text-xs text-muted-foreground truncate mb-2">{user.email}</p>
        )}
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-muted-foreground hover:text-destructive"
          onClick={signOut}
        >
          <LogOut className="h-4 w-4 mr-2" />
          {!collapsed && 'Sign Out'}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AdminSidebar;
