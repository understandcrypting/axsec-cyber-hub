import { motion } from 'framer-motion';
import { 
  Settings as SettingsIcon, 
  User, 
  Key, 
  Bell, 
  Shield, 
  Moon,
  Sun,
  Monitor,
  Copy
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { CyberCard, CyberCardContent, CyberCardHeader, CyberCardTitle } from '@/components/ui/cyber-card';
import { CyberInput } from '@/components/ui/cyber-input';
import { CyberButton } from '@/components/ui/cyber-button';
import { CyberBadge } from '@/components/ui/cyber-badge';
import { Switch } from '@/components/ui/switch';
import { tierBadgeStyles } from '@/data/mockData';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function Settings() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState({
    email: true,
    browser: false,
    searchAlerts: true,
    weeklyReport: true,
  });

  const mockApiKey = 'axsec_live_' + btoa(user?.id || 'demo').substring(0, 24);

  const copyApiKey = () => {
    navigator.clipboard.writeText(mockApiKey);
    toast.success('API key copied to clipboard');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl lg:text-3xl font-bold font-mono tracking-wide">
          <span className="text-primary text-glow">Settings</span>
        </h1>
        <p className="text-sm text-muted-foreground font-mono mt-1">
          Manage your account preferences and security settings
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                <div className="w-16 h-16 rounded-lg bg-primary/20 flex items-center justify-center">
                  <span className="text-2xl font-mono font-bold text-primary">
                    {user?.username[0].toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="font-mono font-semibold text-foreground">{user?.username}</p>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                  <CyberBadge className={cn("mt-1", tierBadgeStyles[user?.subscription || 'free'])}>
                    {user?.subscription}
                  </CyberBadge>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-border/30">
                <div className="space-y-2">
                  <label className="text-xs font-mono text-muted-foreground uppercase">Username</label>
                  <CyberInput defaultValue={user?.username} />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-mono text-muted-foreground uppercase">Email</label>
                  <CyberInput defaultValue={user?.email} />
                </div>
                <CyberButton variant="outline" className="w-full">
                  Save Changes
                </CyberButton>
              </div>
            </CyberCardContent>
          </CyberCard>
        </motion.div>

        {/* API Key */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <CyberCard>
            <CyberCardHeader>
              <CyberCardTitle className="flex items-center gap-2">
                <Key className="w-5 h-5 text-primary" />
                API Access
              </CyberCardTitle>
            </CyberCardHeader>
            <CyberCardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Use this API key to integrate AXSEC with your applications.
              </p>
              
              <div className="space-y-2">
                <label className="text-xs font-mono text-muted-foreground uppercase">API Key</label>
                <div className="flex gap-2">
                  <CyberInput 
                    value={mockApiKey} 
                    readOnly 
                    className="font-mono text-sm"
                  />
                  <CyberButton variant="outline" size="icon" onClick={copyApiKey}>
                    <Copy className="w-4 h-4" />
                  </CyberButton>
                </div>
              </div>

              <div className="p-3 rounded-md bg-warning/10 border border-warning/30">
                <p className="text-xs text-warning font-mono">
                  ⚠️ Keep your API key secure. Do not share it publicly.
                </p>
              </div>

              <CyberButton variant="outline" className="w-full">
                Regenerate API Key
              </CyberButton>
            </CyberCardContent>
          </CyberCard>
        </motion.div>

        {/* Notifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <CyberCard>
            <CyberCardHeader>
              <CyberCardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-primary" />
                Notifications
              </CyberCardTitle>
            </CyberCardHeader>
            <CyberCardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-mono text-sm text-foreground">Email Notifications</p>
                  <p className="text-xs text-muted-foreground">Receive updates via email</p>
                </div>
                <Switch 
                  checked={notifications.email}
                  onCheckedChange={(checked) => setNotifications(n => ({ ...n, email: checked }))}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-mono text-sm text-foreground">Browser Notifications</p>
                  <p className="text-xs text-muted-foreground">Desktop push notifications</p>
                </div>
                <Switch 
                  checked={notifications.browser}
                  onCheckedChange={(checked) => setNotifications(n => ({ ...n, browser: checked }))}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-mono text-sm text-foreground">Search Alerts</p>
                  <p className="text-xs text-muted-foreground">Notify on matching queries</p>
                </div>
                <Switch 
                  checked={notifications.searchAlerts}
                  onCheckedChange={(checked) => setNotifications(n => ({ ...n, searchAlerts: checked }))}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-mono text-sm text-foreground">Weekly Report</p>
                  <p className="text-xs text-muted-foreground">Summary of your activity</p>
                </div>
                <Switch 
                  checked={notifications.weeklyReport}
                  onCheckedChange={(checked) => setNotifications(n => ({ ...n, weeklyReport: checked }))}
                />
              </div>
            </CyberCardContent>
          </CyberCard>
        </motion.div>

        {/* Security */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <CyberCard>
            <CyberCardHeader>
              <CyberCardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                Security
              </CyberCardTitle>
            </CyberCardHeader>
            <CyberCardContent className="space-y-4">
              <CyberButton variant="outline" className="w-full justify-start">
                <Key className="w-4 h-4 mr-2" />
                Change Password
              </CyberButton>
              
              <CyberButton variant="outline" className="w-full justify-start">
                <Shield className="w-4 h-4 mr-2" />
                Enable Two-Factor Auth
              </CyberButton>
              
              <div className="pt-4 border-t border-border/30">
                <p className="text-xs font-mono text-muted-foreground uppercase mb-3">Active Sessions</p>
                <div className="p-3 rounded-md bg-muted/30 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-mono text-foreground">Current Session</p>
                    <p className="text-xs text-muted-foreground">Chrome on Windows • Active now</p>
                  </div>
                  <div className="w-2 h-2 rounded-full status-online" />
                </div>
              </div>
            </CyberCardContent>
          </CyberCard>
        </motion.div>
      </div>
    </div>
  );
}
