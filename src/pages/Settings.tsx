import { motion } from 'framer-motion';
import { 
  User, 
  Shield, 
  Key
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { CyberCard, CyberCardContent, CyberCardHeader, CyberCardTitle } from '@/components/ui/cyber-card';
import { CyberInput } from '@/components/ui/cyber-input';
import { CyberButton } from '@/components/ui/cyber-button';
import { CyberBadge } from '@/components/ui/cyber-badge';
import { tierBadgeStyles } from '@/data/mockData';
import { cn } from '@/lib/utils';

export default function Settings() {
  const { user } = useAuth();

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold font-mono tracking-wide">
          <span className="text-primary">Settings</span>
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your account preferences
        </p>
      </motion.div>

      <div className="grid gap-6">
        {/* Profile Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <CyberCard>
            <CyberCardHeader>
              <CyberCardTitle className="flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                Profile
              </CyberCardTitle>
            </CyberCardHeader>
            <CyberCardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <span className="text-xl font-mono font-bold text-primary">
                    {user?.username[0].toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="font-mono font-semibold text-foreground">{user?.username}</p>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                </div>
                <CyberBadge className={cn("ml-auto", tierBadgeStyles[user?.subscription || 'pro'])}>
                  {user?.subscription}
                </CyberBadge>
              </div>

              <div className="grid gap-4 pt-4 border-t border-border/30">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-mono text-muted-foreground uppercase">Username</label>
                    <CyberInput defaultValue={user?.username} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-mono text-muted-foreground uppercase">Email</label>
                    <CyberInput defaultValue={user?.email} />
                  </div>
                </div>
                <CyberButton variant="outline" className="w-fit">
                  Save Changes
                </CyberButton>
              </div>
            </CyberCardContent>
          </CyberCard>
        </motion.div>

        {/* Security */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <CyberCard>
            <CyberCardHeader>
              <CyberCardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                Security
              </CyberCardTitle>
            </CyberCardHeader>
            <CyberCardContent className="space-y-4">
              <CyberButton variant="outline" className="w-full sm:w-auto justify-start">
                <Key className="w-4 h-4 mr-2" />
                Change Password
              </CyberButton>
              
              <CyberButton variant="outline" className="w-full sm:w-auto justify-start">
                <Shield className="w-4 h-4 mr-2" />
                Enable Two-Factor Auth
              </CyberButton>
              
              <div className="pt-4 border-t border-border/30">
                <p className="text-xs font-mono text-muted-foreground uppercase mb-3">Active Sessions</p>
                <div className="p-3 rounded-md bg-muted/20 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-mono text-foreground">Current Session</p>
                    <p className="text-xs text-muted-foreground">Active now</p>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-success" />
                </div>
              </div>
            </CyberCardContent>
          </CyberCard>
        </motion.div>
      </div>
    </div>
  );
}
