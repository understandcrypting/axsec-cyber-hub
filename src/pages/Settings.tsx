import { motion } from 'framer-motion';
import { 
  Shield, 
  Key,
  LogOut,
  User,
  Mail,
  Crown,
  Calendar,
  Hash,
  Fingerprint,
  Monitor,
  Globe,
  Clock
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

export default function Settings() {
  const { user } = useAuth();

  const memberSince = user?.createdAt 
    ? new Date(user.createdAt).toLocaleDateString('en-US', { 
        day: 'numeric',
        month: 'short', 
        year: 'numeric'
      })
    : '--';

  const sessionExpiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  return (
    <div className="min-h-screen grid-pattern">
      <div className="max-w-4xl mx-auto p-6 lg:p-8 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl lg:text-3xl font-semibold text-foreground mb-1">
            Account Settings
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage your profile, sessions, and security preferences
          </p>
        </motion.div>

        {/* Account Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="clean-card"
        >
          <div className="px-5 py-4 border-b border-border">
            <h2 className="text-xs uppercase tracking-widest font-medium text-muted-foreground">
              Account Overview
            </h2>
          </div>
          
          <div className="p-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded bg-muted flex items-center justify-center">
                  <User className="w-4 h-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Username</p>
                  <p className="font-mono text-sm text-foreground">{user?.username}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded bg-muted flex items-center justify-center">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Email</p>
                  <p className="font-mono text-sm text-foreground truncate">{user?.email || 'Not set'}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded bg-muted flex items-center justify-center">
                  <Crown className="w-4 h-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Plan</p>
                  <p className="font-mono text-sm text-foreground capitalize">{user?.subscription}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded bg-muted flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Member Since</p>
                  <p className="font-mono text-sm text-foreground">{memberSince}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded bg-muted flex items-center justify-center">
                  <Hash className="w-4 h-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">User ID</p>
                  <p className="font-mono text-sm text-foreground">{user?.id}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded bg-muted flex items-center justify-center">
                  <Fingerprint className="w-4 h-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Support ID</p>
                  <p className="font-mono text-sm text-foreground font-medium">
                    {user?.id?.slice(0, 6).toUpperCase() || 'AXSEC1'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Security */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="clean-card"
        >
          <div className="px-5 py-4 border-b border-border">
            <h2 className="text-xs uppercase tracking-widest font-medium text-muted-foreground">
              Security
            </h2>
          </div>
          
          <div className="p-5 space-y-3">
            <button className="w-full flex items-center gap-3 p-3 rounded bg-muted/50 hover:bg-muted transition-colors text-left group">
              <div className="w-9 h-9 rounded bg-background flex items-center justify-center">
                <Key className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">Change Password</p>
                <p className="text-xs text-muted-foreground">Update your account password</p>
              </div>
            </button>
            
            <button className="w-full flex items-center gap-3 p-3 rounded bg-muted/50 hover:bg-muted transition-colors text-left group">
              <div className="w-9 h-9 rounded bg-background flex items-center justify-center">
                <Shield className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">Two-Factor Authentication</p>
                <p className="text-xs text-muted-foreground">Add an extra layer of security</p>
              </div>
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground px-2 py-1 rounded bg-background">
                Disabled
              </span>
            </button>
          </div>
        </motion.div>

        {/* Active Sessions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="clean-card"
        >
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <h2 className="text-xs uppercase tracking-widest font-medium text-muted-foreground">
              Active Sessions
            </h2>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-destructive hover:text-destructive hover:bg-destructive/10 text-xs font-mono uppercase tracking-wider h-7"
            >
              <LogOut className="w-3 h-3 mr-2" />
              Revoke All
            </Button>
          </div>
          
          <div className="p-5">
            <div className="inner-card p-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded bg-muted flex items-center justify-center flex-shrink-0">
                  <Monitor className="w-5 h-5 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-3">
                    <p className="font-medium text-foreground text-sm">Current Session</p>
                    <span className="w-1.5 h-1.5 rounded-full bg-success" />
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                    <div>
                      <p className="text-muted-foreground uppercase tracking-wider mb-0.5">Device</p>
                      <p className="text-foreground font-mono">Desktop</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground uppercase tracking-wider mb-0.5">Browser</p>
                      <p className="text-foreground font-mono">Chrome</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground uppercase tracking-wider mb-0.5">Created</p>
                      <p className="text-foreground font-mono">{memberSince}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground uppercase tracking-wider mb-0.5">Expires</p>
                      <p className="text-foreground font-mono">{sessionExpiry}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Danger Zone */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="clean-card border-destructive/30"
        >
          <div className="px-5 py-4 border-b border-destructive/20">
            <h2 className="text-xs uppercase tracking-widest font-medium text-destructive">
              Danger Zone
            </h2>
          </div>
          
          <div className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Delete Account</p>
                <p className="text-xs text-muted-foreground">Permanently delete your account and all data</p>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                className="border-destructive/50 text-destructive hover:bg-destructive hover:text-destructive-foreground text-xs font-mono uppercase tracking-wider"
              >
                Delete Account
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}