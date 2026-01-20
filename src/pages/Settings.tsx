import { motion } from 'framer-motion';
import { 
  Shield, 
  Key,
  Monitor,
  LogOut
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { tierBadgeStyles } from '@/data/mockData';
import { cn } from '@/lib/utils';

export default function Settings() {
  const { user } = useAuth();

  const memberSince = user?.createdAt 
    ? new Date(user.createdAt).toLocaleDateString('en-US', { 
        day: 'numeric',
        month: 'short', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    : '--';

  return (
    <div className="min-h-screen grid-pattern">
      <div className="max-w-4xl mx-auto p-6 lg:p-8 space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-2">
            Account Settings
          </h1>
          <p className="text-muted-foreground">
            Manage your profile, sessions, and account preferences
          </p>
        </motion.div>

        {/* Account Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="clean-card p-6"
        >
          <h2 className="text-sm uppercase tracking-widest font-semibold text-muted-foreground mb-5">
            Account Overview
          </h2>
          
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="clean-card p-4">
              <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Username</p>
              <p className="font-mono text-foreground">{user?.username}</p>
            </div>
            <div className="clean-card p-4">
              <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Email</p>
              <p className="font-mono text-foreground text-sm truncate">{user?.email || 'Not set'}</p>
            </div>
            <div className="clean-card p-4">
              <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Status</p>
              <p className={cn("font-mono capitalize", tierBadgeStyles[user?.subscription || 'pro'])}>
                {user?.subscription}
              </p>
            </div>
            <div className="clean-card p-4">
              <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Member Since</p>
              <p className="font-mono text-foreground text-sm">{memberSince}</p>
            </div>
            <div className="clean-card p-4">
              <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">User ID</p>
              <p className="font-mono text-foreground text-sm">{user?.id}</p>
            </div>
          </div>

          <div className="mt-4">
            <div className="clean-card p-4 w-fit">
              <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Support ID</p>
              <p className="font-mono text-foreground font-semibold">
                {user?.id?.slice(0, 6).toUpperCase() || 'AXSEC1'}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Security */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="clean-card p-6"
        >
          <h2 className="text-sm uppercase tracking-widest font-semibold text-muted-foreground mb-5">
            Security
          </h2>
          
          <div className="space-y-3">
            <Button variant="outline" className="justify-start font-mono text-xs uppercase tracking-wider">
              <Key className="w-4 h-4 mr-3" />
              Change Password
            </Button>
            
            <Button variant="outline" className="justify-start font-mono text-xs uppercase tracking-wider">
              <Shield className="w-4 h-4 mr-3" />
              Enable Two-Factor Auth
            </Button>
          </div>
        </motion.div>

        {/* Active Sessions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="clean-card p-6"
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm uppercase tracking-widest font-semibold text-muted-foreground">
              Active Sessions
            </h2>
            <Button variant="destructive" size="sm" className="font-mono text-xs uppercase tracking-wider">
              <LogOut className="w-4 h-4 mr-2" />
              Revoke All Sessions
            </Button>
          </div>
          
          <div className="clean-card p-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground text-xs uppercase mb-1">Device</p>
                <p className="text-foreground font-mono">Desktop</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs uppercase mb-1">Platform</p>
                <p className="text-foreground font-mono">Web Browser</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs uppercase mb-1">Browser</p>
                <p className="text-foreground font-mono">Chrome</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs uppercase mb-1">Created</p>
                <p className="text-foreground font-mono text-xs">{memberSince}</p>
              </div>
              <div className="col-span-2">
                <p className="text-muted-foreground text-xs uppercase mb-1">Expires</p>
                <p className="text-foreground font-mono text-xs">
                  {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}