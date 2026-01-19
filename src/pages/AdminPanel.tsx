import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Plus, 
  Search, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Power,
  UserPlus,
  X,
  Check
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserManagement } from '@/contexts/UserManagementContext';
import { CyberCard, CyberCardContent, CyberCardHeader, CyberCardTitle } from '@/components/ui/cyber-card';
import { CyberInput } from '@/components/ui/cyber-input';
import { CyberButton } from '@/components/ui/cyber-button';
import { CyberBadge } from '@/components/ui/cyber-badge';
import { tierBadgeStyles } from '@/data/mockData';
import { SubscriptionTier } from '@/types';
import { cn } from '@/lib/utils';
import { Navigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
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

export default function AdminPanel() {
  const { user } = useAuth();
  const { users, addUser, deleteUser, toggleUserStatus } = useUserManagement();
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    role: 'user' as 'admin' | 'user',
    subscription: 'basic' as SubscriptionTier,
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
    if (!newUser.username || !newUser.email) {
      toast.error('Please fill in all required fields');
      return;
    }

    addUser({
      username: newUser.username,
      email: newUser.email,
      role: newUser.role,
      subscription: newUser.subscription,
      isActive: true,
    });

    toast.success('User created successfully');
    setIsAddModalOpen(false);
    setNewUser({ username: '', email: '', role: 'user', subscription: 'basic' });
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold font-mono tracking-wide">
            <span className="text-primary text-glow">Admin</span> Panel
          </h1>
          <p className="text-sm text-muted-foreground font-mono mt-1">
            Manage users, permissions, and system settings
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
          <CyberCardContent className="p-4 text-center">
            <p className="text-2xl font-bold font-mono text-foreground">{users.length}</p>
            <p className="text-xs text-muted-foreground font-mono uppercase">Total Users</p>
          </CyberCardContent>
        </CyberCard>
        <CyberCard>
          <CyberCardContent className="p-4 text-center">
            <p className="text-2xl font-bold font-mono text-success">{users.filter(u => u.isActive).length}</p>
            <p className="text-xs text-muted-foreground font-mono uppercase">Active</p>
          </CyberCardContent>
        </CyberCard>
        <CyberCard>
          <CyberCardContent className="p-4 text-center">
            <p className="text-2xl font-bold font-mono text-warning">{users.filter(u => u.role === 'admin').length}</p>
            <p className="text-xs text-muted-foreground font-mono uppercase">Admins</p>
          </CyberCardContent>
        </CyberCard>
        <CyberCard>
          <CyberCardContent className="p-4 text-center">
            <p className="text-2xl font-bold font-mono text-primary">{users.filter(u => u.subscription === 'enterprise').length}</p>
            <p className="text-xs text-muted-foreground font-mono uppercase">Enterprise</p>
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
          placeholder="Search users by name or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          icon={<Search className="w-4 h-4" />}
          className="max-w-md"
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
                    <th className="text-left py-3 px-4 text-xs font-mono text-muted-foreground uppercase tracking-wider">Status</th>
                    <th className="text-left py-3 px-4 text-xs font-mono text-muted-foreground uppercase tracking-wider">User</th>
                    <th className="text-left py-3 px-4 text-xs font-mono text-muted-foreground uppercase tracking-wider">Role</th>
                    <th className="text-left py-3 px-4 text-xs font-mono text-muted-foreground uppercase tracking-wider">Subscription</th>
                    <th className="text-left py-3 px-4 text-xs font-mono text-muted-foreground uppercase tracking-wider">Created</th>
                    <th className="text-left py-3 px-4 text-xs font-mono text-muted-foreground uppercase tracking-wider">Last Login</th>
                    <th className="text-right py-3 px-4 text-xs font-mono text-muted-foreground uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="border-b border-border/30 hover:bg-muted/20 transition-colors">
                      <td className="py-3 px-4">
                        <div className={cn(
                          "w-2 h-2 rounded-full",
                          u.isActive ? "status-online" : "status-offline"
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
                      <td className="py-3 px-4 text-sm text-muted-foreground font-mono">
                        {u.createdAt}
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
                          <DropdownMenuContent align="end" className="bg-popover border-border">
                            <DropdownMenuItem 
                              onClick={() => handleToggleStatus(u.id, u.isActive)}
                              className="gap-2"
                            >
                              <Power className="w-4 h-4" />
                              {u.isActive ? 'Deactivate' : 'Activate'}
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
                  <SelectItem value="free">Free</SelectItem>
                  <SelectItem value="basic">Basic</SelectItem>
                  <SelectItem value="pro">Pro</SelectItem>
                  <SelectItem value="enterprise">Enterprise</SelectItem>
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
    </div>
  );
}
