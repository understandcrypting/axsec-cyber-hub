import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Search, 
  MoreVertical, 
  Trash2, 
  Power,
  UserPlus,
  Check,
  CreditCard,
  RefreshCw,
  History,
  X,
  Clock
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserManagement } from '@/contexts/UserManagementContext';
import { CyberCard, CyberCardContent, CyberCardHeader, CyberCardTitle } from '@/components/ui/cyber-card';
import { CyberInput } from '@/components/ui/cyber-input';
import { CyberButton } from '@/components/ui/cyber-button';
import { CyberBadge } from '@/components/ui/cyber-badge';
import { tierBadgeStyles } from '@/data/mockData';
import { SubscriptionTier, SUBSCRIPTION_LIMITS, User } from '@/types';
import { cn } from '@/lib/utils';
import { Navigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

// Mock user logs data
const generateMockLogs = (userId: string) => [
  { id: '1', action: 'search', module: 'Discord', query: 'user123456', timestamp: '2025-01-19T15:30:00Z', status: 'success' },
  { id: '2', action: 'search', module: 'LeakOSINT', query: 'test@email.com', timestamp: '2025-01-19T14:22:00Z', status: 'success' },
  { id: '3', action: 'search', module: 'Shodan', query: '192.168.1.1', timestamp: '2025-01-19T12:10:00Z', status: 'not_found' },
  { id: '4', action: 'login', module: '-', query: '-', timestamp: '2025-01-19T10:00:00Z', status: 'success' },
  { id: '5', action: 'search', module: 'Instagram', query: 'johndoe', timestamp: '2025-01-18T18:45:00Z', status: 'success' },
  { id: '6', action: 'search', module: 'Snusbase', query: 'user@domain.com', timestamp: '2025-01-18T16:30:00Z', status: 'success' },
  { id: '7', action: 'login', module: '-', query: '-', timestamp: '2025-01-18T09:00:00Z', status: 'success' },
  { id: '8', action: 'search', module: 'Roblox', query: 'player123', timestamp: '2025-01-17T20:15:00Z', status: 'success' },
];

export default function AdminPanel() {
  const { user } = useAuth();
  const { users, addUser, deleteUser, toggleUserStatus, updateUserSubscription, resetUserCredits } = useUserManagement();
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [viewingLogsUser, setViewingLogsUser] = useState<User | null>(null);
  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    password: '',
    role: 'user' as 'admin' | 'user',
    subscription: 'pro' as SubscriptionTier,
  });

  // Redirect non-admins
  if (user?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  const filteredUsers = users.filter(u =>
    u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddUser = () => {
    if (!newUser.username || !newUser.email || !newUser.password) {
      toast.error('Please fill in all required fields');
      return;
    }

    const limits = SUBSCRIPTION_LIMITS[newUser.subscription];
    addUser({
      username: newUser.username,
      email: newUser.email,
      role: newUser.role,
      subscription: newUser.subscription,
      isActive: true,
      dailyCreditsUsed: 0,
      dailyCreditsLimit: limits.dailyCredits,
    });

    toast.success('User created successfully');
    setIsAddModalOpen(false);
    setNewUser({ username: '', email: '', password: '', role: 'user', subscription: 'pro' });
  };

  const handleDeleteUser = (userId: string, username: string) => {
    if (userId === user?.id) {
      toast.error('Cannot delete your own account');
      return;
    }
    deleteUser(userId);
    toast.success(`User ${username} deleted`);
  };

  const handleToggleStatus = (userId: string, currentStatus: boolean) => {
    if (userId === user?.id) {
      toast.error('Cannot deactivate your own account');
      return;
    }
    toggleUserStatus(userId);
    toast.success(`User ${currentStatus ? 'deactivated' : 'activated'}`);
  };

  const handleChangeSubscription = (userId: string, newTier: SubscriptionTier) => {
    updateUserSubscription(userId, newTier);
    toast.success(`Subscription updated to ${newTier}`);
  };

  const handleResetCredits = (userId: string) => {
    resetUserCredits(userId);
    toast.success('Daily credits reset');
  };

  const userLogs = viewingLogsUser ? generateMockLogs(viewingLogsUser.id) : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold font-mono tracking-wide">
            <span className="text-primary">Admin</span> Panel
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage users, subscriptions, and credits
          </p>
        </div>
        <CyberButton onClick={() => setIsAddModalOpen(true)}>
          <UserPlus className="w-4 h-4" />
          Add User
        </CyberButton>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <CyberCard>
          <CyberCardContent className="p-4">
            <p className="text-2xl font-bold font-mono text-foreground">{users.length}</p>
            <p className="text-xs text-muted-foreground uppercase">Total Users</p>
          </CyberCardContent>
        </CyberCard>
        <CyberCard>
          <CyberCardContent className="p-4">
            <p className="text-2xl font-bold font-mono text-success">{users.filter(u => u.isActive).length}</p>
            <p className="text-xs text-muted-foreground uppercase">Active</p>
          </CyberCardContent>
        </CyberCard>
        <CyberCard>
          <CyberCardContent className="p-4">
            <p className="text-2xl font-bold font-mono text-primary">{users.filter(u => u.subscription === 'pro').length}</p>
            <p className="text-xs text-muted-foreground uppercase">Pro</p>
          </CyberCardContent>
        </CyberCard>
        <CyberCard>
          <CyberCardContent className="p-4">
            <p className="text-2xl font-bold font-mono text-yellow-400">{users.filter(u => u.subscription === 'enterprise').length}</p>
            <p className="text-xs text-muted-foreground uppercase">Enterprise</p>
          </CyberCardContent>
        </CyberCard>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <CyberInput
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          icon={<Search className="w-4 h-4" />}
          className="max-w-sm"
        />
      </motion.div>

      {/* Users Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <CyberCard>
          <CyberCardHeader>
            <CyberCardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              User Management
            </CyberCardTitle>
          </CyberCardHeader>
          <CyberCardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/50">
                    <th className="text-left py-3 px-4 text-xs font-mono text-muted-foreground uppercase">Status</th>
                    <th className="text-left py-3 px-4 text-xs font-mono text-muted-foreground uppercase">User</th>
                    <th className="text-left py-3 px-4 text-xs font-mono text-muted-foreground uppercase">Role</th>
                    <th className="text-left py-3 px-4 text-xs font-mono text-muted-foreground uppercase">Plan</th>
                    <th className="text-left py-3 px-4 text-xs font-mono text-muted-foreground uppercase">Credits</th>
                    <th className="text-left py-3 px-4 text-xs font-mono text-muted-foreground uppercase">Last Login</th>
                    <th className="text-right py-3 px-4 text-xs font-mono text-muted-foreground uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="border-b border-border/30 hover:bg-muted/20 transition-colors">
                      <td className="py-3 px-4">
                        <div className={cn(
                          "w-2 h-2 rounded-full",
                          u.isActive ? "bg-success" : "bg-muted-foreground"
                        )} />
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-mono text-foreground">{u.username}</p>
                          <p className="text-xs text-muted-foreground">{u.email}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <CyberBadge variant={u.role === 'admin' ? 'warning' : 'secondary'}>
                          {u.role}
                        </CyberBadge>
                      </td>
                      <td className="py-3 px-4">
                        <CyberBadge className={tierBadgeStyles[u.subscription]}>
                          {u.subscription}
                        </CyberBadge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-mono text-sm">
                          {u.dailyCreditsLimit === -1 ? (
                            <span className="text-yellow-400">Unlimited</span>
                          ) : (
                            <span className={cn(
                              u.dailyCreditsUsed >= u.dailyCreditsLimit ? 'text-destructive' : 'text-foreground'
                            )}>
                              {u.dailyCreditsUsed} / {u.dailyCreditsLimit}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-muted-foreground font-mono">
                        {u.lastLogin === 'Never' ? 'Never' : new Date(u.lastLogin).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <CyberButton variant="ghost" size="icon">
                              <MoreVertical className="w-4 h-4" />
                            </CyberButton>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-popover border-border w-48">
                            <DropdownMenuItem 
                              onClick={() => setViewingLogsUser(u)}
                              className="gap-2"
                            >
                              <History className="w-4 h-4" />
                              View Logs
                            </DropdownMenuItem>
                            
                            <DropdownMenuSeparator />
                            
                            <DropdownMenuItem 
                              onClick={() => handleToggleStatus(u.id, u.isActive)}
                              className="gap-2"
                            >
                              <Power className="w-4 h-4" />
                              {u.isActive ? 'Deactivate' : 'Activate'}
                            </DropdownMenuItem>
                            
                            <DropdownMenuSub>
                              <DropdownMenuSubTrigger className="gap-2">
                                <CreditCard className="w-4 h-4" />
                                Change Plan
                              </DropdownMenuSubTrigger>
                              <DropdownMenuSubContent className="bg-popover border-border">
                                <DropdownMenuItem 
                                  onClick={() => handleChangeSubscription(u.id, 'pro')}
                                  className="gap-2"
                                >
                                  <span className={cn(
                                    "w-2 h-2 rounded-full",
                                    u.subscription === 'pro' ? 'bg-primary' : 'bg-muted'
                                  )} />
                                  Pro (100/day)
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => handleChangeSubscription(u.id, 'enterprise')}
                                  className="gap-2"
                                >
                                  <span className={cn(
                                    "w-2 h-2 rounded-full",
                                    u.subscription === 'enterprise' ? 'bg-yellow-400' : 'bg-muted'
                                  )} />
                                  Enterprise (Unlimited)
                                </DropdownMenuItem>
                              </DropdownMenuSubContent>
                            </DropdownMenuSub>

                            <DropdownMenuItem 
                              onClick={() => handleResetCredits(u.id)}
                              className="gap-2"
                            >
                              <RefreshCw className="w-4 h-4" />
                              Reset Credits
                            </DropdownMenuItem>
                            
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => handleDeleteUser(u.id, u.username)}
                              className="gap-2 text-destructive focus:text-destructive"
                            >
                              <Trash2 className="w-4 h-4" />
                              Delete User
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredUsers.length === 0 && (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground font-mono">No users found</p>
              </div>
            )}
          </CyberCardContent>
        </CyberCard>
      </motion.div>

      {/* Add User Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="bg-card border-border sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-mono text-lg flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-primary" />
              Create New User
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-xs font-mono text-muted-foreground uppercase">Username</label>
              <CyberInput
                placeholder="Enter username..."
                value={newUser.username}
                onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-mono text-muted-foreground uppercase">Email</label>
              <CyberInput
                type="email"
                placeholder="Enter email..."
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono text-muted-foreground uppercase">Password</label>
              <CyberInput
                type="password"
                placeholder="Enter password..."
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-mono text-muted-foreground uppercase">Role</label>
              <Select
                value={newUser.role}
                onValueChange={(value: 'admin' | 'user') => setNewUser({ ...newUser, role: value })}
              >
                <SelectTrigger className="bg-card border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-mono text-muted-foreground uppercase">Subscription</label>
              <Select
                value={newUser.subscription}
                onValueChange={(value: SubscriptionTier) => setNewUser({ ...newUser, subscription: value })}
              >
                <SelectTrigger className="bg-card border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  <SelectItem value="pro">Pro (100 credits/day)</SelectItem>
                  <SelectItem value="enterprise">Enterprise (Unlimited)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <CyberButton variant="outline" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </CyberButton>
            <CyberButton onClick={handleAddUser}>
              <Check className="w-4 h-4" />
              Create User
            </CyberButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* User Logs Modal */}
      <Dialog open={!!viewingLogsUser} onOpenChange={(open) => !open && setViewingLogsUser(null)}>
        <DialogContent className="bg-card border-border sm:max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="font-mono text-lg flex items-center gap-2">
              <History className="w-5 h-5 text-primary" />
              Activity Logs - {viewingLogsUser?.username}
            </DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            {/* User Summary */}
            <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/20 mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <span className="font-mono font-bold text-primary">
                  {viewingLogsUser?.username[0].toUpperCase()}
                </span>
              </div>
              <div className="flex-1">
                <p className="font-mono text-foreground">{viewingLogsUser?.email}</p>
                <div className="flex items-center gap-2 mt-1">
                  <CyberBadge className={tierBadgeStyles[viewingLogsUser?.subscription || 'pro']} >
                    {viewingLogsUser?.subscription}
                  </CyberBadge>
                  <span className="text-xs text-muted-foreground">
                    {viewingLogsUser?.dailyCreditsLimit === -1 
                      ? 'Unlimited credits' 
                      : `${viewingLogsUser?.dailyCreditsUsed} / ${viewingLogsUser?.dailyCreditsLimit} credits used`
                    }
                  </span>
                </div>
              </div>
            </div>

            {/* Logs Table */}
            <div className="overflow-y-auto max-h-[400px] rounded-lg border border-border/50">
              <table className="w-full">
                <thead className="sticky top-0 bg-card">
                  <tr className="border-b border-border/50">
                    <th className="text-left py-2 px-3 text-xs font-mono text-muted-foreground uppercase">Time</th>
                    <th className="text-left py-2 px-3 text-xs font-mono text-muted-foreground uppercase">Action</th>
                    <th className="text-left py-2 px-3 text-xs font-mono text-muted-foreground uppercase">Module</th>
                    <th className="text-left py-2 px-3 text-xs font-mono text-muted-foreground uppercase">Query</th>
                    <th className="text-left py-2 px-3 text-xs font-mono text-muted-foreground uppercase">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {userLogs.map((log) => (
                    <tr key={log.id} className="border-b border-border/30 hover:bg-muted/10">
                      <td className="py-2 px-3 text-xs text-muted-foreground font-mono">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(log.timestamp).toLocaleString()}
                        </div>
                      </td>
                      <td className="py-2 px-3">
                        <CyberBadge variant={log.action === 'login' ? 'secondary' : 'default'} className="text-[10px]">
                          {log.action}
                        </CyberBadge>
                      </td>
                      <td className="py-2 px-3 text-sm font-mono text-foreground">
                        {log.module}
                      </td>
                      <td className="py-2 px-3 text-sm font-mono text-muted-foreground truncate max-w-[150px]">
                        {log.query}
                      </td>
                      <td className="py-2 px-3">
                        <CyberBadge 
                          variant={log.status === 'success' ? 'success' : 'warning'} 
                          className="text-[10px]"
                        >
                          {log.status}
                        </CyberBadge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <DialogFooter>
            <CyberButton variant="outline" onClick={() => setViewingLogsUser(null)}>
              Close
            </CyberButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
