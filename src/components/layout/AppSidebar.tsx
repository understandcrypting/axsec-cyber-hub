import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Shield, 
  Search, 
  Users, 
  CreditCard,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Terminal,
  Menu
} from 'lucide-react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { CyberBadge } from '@/components/ui/cyber-badge';
import { tierBadgeStyles } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { useState } from 'react';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/modules', label: 'Modules', icon: Search },
  { path: '/subscriptions', label: 'Subscriptions', icon: CreditCard },
  { path: '/admin', label: 'Admin Panel', icon: Users, adminOnly: true },
  { path: '/settings', label: 'Settings', icon: Settings },
];

interface AppSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function AppSidebar({ collapsed, onToggle }: AppSidebarProps) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const filteredNavItems = navItems.filter(item => 
    !item.adminOnly || user?.role === 'admin'
  );

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 72 : 260 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "fixed left-0 top-0 h-screen z-40",
        "bg-sidebar border-r border-sidebar-border",
        "flex flex-col",
        "backdrop-blur-xl"
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="relative flex-shrink-0">
            <Shield className="w-8 h-8 text-primary" />
            <motion.div
              className="absolute inset-0 bg-primary/30 rounded-full blur-md"
              animate={{ opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <h1 className="font-bold font-mono text-lg tracking-wider">
                <span className="text-primary text-glow">AX</span>SEC
              </h1>
              <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
                Intelligence Platform
              </p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {filteredNavItems.map((item) => {
          const isActive = location.pathname === item.path || 
            (item.path === '/modules' && location.pathname.startsWith('/modules'));
          
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-md transition-all duration-200",
                "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                isActive && "bg-sidebar-accent text-primary border-l-2 border-primary shadow-[inset_0_0_20px_hsl(180_100%_50%/0.1)]",
                collapsed && "justify-center"
              )}
            >
              <item.icon className={cn("w-5 h-5 flex-shrink-0", isActive && "text-primary")} />
              {!collapsed && (
                <span className="font-mono text-sm uppercase tracking-wider">{item.label}</span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* User Info */}
      {user && (
        <div className={cn(
          "p-4 border-t border-sidebar-border",
          collapsed && "p-2"
        )}>
          {!collapsed && (
            <div className="mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-md bg-primary/20 flex items-center justify-center">
                  <Terminal className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-mono text-sm truncate">{user.username}</p>
                  <CyberBadge 
                    className={cn("text-[10px] mt-0.5", tierBadgeStyles[user.subscription])}
                  >
                    {user.subscription}
                  </CyberBadge>
                </div>
              </div>
            </div>
          )}
          
          <button
            onClick={handleLogout}
            className={cn(
              "flex items-center gap-2 w-full px-3 py-2 rounded-md",
              "text-muted-foreground hover:text-destructive hover:bg-destructive/10",
              "transition-colors font-mono text-sm",
              collapsed && "justify-center px-2"
            )}
          >
            <LogOut className="w-4 h-4" />
            {!collapsed && <span className="uppercase tracking-wider">Logout</span>}
          </button>
        </div>
      )}

      {/* Collapse Toggle */}
      <button
        onClick={onToggle}
        className={cn(
          "absolute -right-3 top-1/2 -translate-y-1/2",
          "w-6 h-6 rounded-full bg-sidebar border border-sidebar-border",
          "flex items-center justify-center",
          "text-muted-foreground hover:text-primary hover:border-primary",
          "transition-colors"
        )}
      >
        {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
      </button>
    </motion.aside>
  );
}

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  const filteredNavItems = navItems.filter(item => 
    !item.adminOnly || user?.role === 'admin'
  );

  return (
    <>
      {/* Mobile Header */}
      <header className="fixed top-0 left-0 right-0 h-14 bg-sidebar border-b border-sidebar-border z-50 lg:hidden">
        <div className="flex items-center justify-between h-full px-4">
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-primary" />
            <span className="font-bold font-mono">
              <span className="text-primary">AX</span>SEC
            </span>
          </div>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-muted-foreground hover:text-foreground"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Menu */}
      <motion.div
        initial={{ x: '-100%' }}
        animate={{ x: isOpen ? 0 : '-100%' }}
        transition={{ type: 'spring', damping: 25 }}
        className="fixed left-0 top-0 bottom-0 w-64 bg-sidebar border-r border-sidebar-border z-50 lg:hidden"
      >
        <div className="p-4 pt-16">
          <nav className="space-y-1">
            {filteredNavItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-md transition-all",
                    "text-sidebar-foreground hover:bg-sidebar-accent",
                    isActive && "bg-sidebar-accent text-primary"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-mono text-sm uppercase">{item.label}</span>
                </NavLink>
              );
            })}
          </nav>

          {user && (
            <div className="mt-6 pt-4 border-t border-sidebar-border">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-md bg-primary/20 flex items-center justify-center">
                  <Terminal className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="font-mono text-sm">{user.username}</p>
                  <CyberBadge className="text-[10px]">{user.subscription}</CyberBadge>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 w-full px-3 py-2 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 font-mono text-sm"
              >
                <LogOut className="w-4 h-4" />
                <span className="uppercase">Logout</span>
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
}
