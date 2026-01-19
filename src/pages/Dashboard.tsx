import { motion } from 'framer-motion';
import { 
  Activity, 
  Search, 
  Users, 
  Shield, 
  TrendingUp,
  Clock,
  AlertTriangle,
  CheckCircle,
  ArrowUpRight
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { CyberCard, CyberCardHeader, CyberCardTitle, CyberCardContent } from '@/components/ui/cyber-card';
import { CyberBadge } from '@/components/ui/cyber-badge';
import { CyberButton } from '@/components/ui/cyber-button';
import { useNavigate } from 'react-router-dom';

const stats = [
  { label: 'Total Searches', value: '12,847', icon: Search, change: '+12.5%', trend: 'up' },
  { label: 'Active Modules', value: '24', icon: Activity, change: '+3', trend: 'up' },
  { label: 'API Requests Today', value: '1,234', icon: TrendingUp, change: '+8.2%', trend: 'up' },
  { label: 'System Status', value: 'Online', icon: Shield, change: 'Operational', trend: 'stable' },
];

const recentSearches = [
  { query: 'discord:123456789012345678', module: 'Discord', status: 'success', time: '2 min ago' },
  { query: 'user@example.com', module: 'LeakOSINT', status: 'success', time: '5 min ago' },
  { query: 'johndoe', module: 'Datahound', status: 'success', time: '12 min ago' },
  { query: '192.168.1.1', module: 'Shodan', status: 'not_found', time: '18 min ago' },
  { query: 'target_user', module: 'Instagram', status: 'success', time: '25 min ago' },
];

const systemAlerts = [
  { type: 'info', message: 'API rate limit at 65% capacity', time: '1 hour ago' },
  { type: 'warning', message: 'Snusbase experiencing delays', time: '2 hours ago' },
  { type: 'success', message: 'New module: Telegram lookup available', time: '1 day ago' },
];

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold font-mono tracking-wide">
            <span className="text-muted-foreground">Welcome back,</span>{' '}
            <span className="text-primary text-glow">{user?.username}</span>
          </h1>
          <p className="text-sm text-muted-foreground font-mono mt-1">
            <Clock className="inline w-3 h-3 mr-1" />
            Last login: {user?.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'N/A'}
          </p>
        </div>
        <CyberButton onClick={() => navigate('/modules')}>
          <Search className="w-4 h-4" />
          Start New Search
        </CyberButton>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <CyberCard>
              <CyberCardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
                      {stat.label}
                    </p>
                    <p className="text-2xl font-bold font-mono mt-1 text-foreground">
                      {stat.value}
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      {stat.trend === 'up' && (
                        <TrendingUp className="w-3 h-3 text-success" />
                      )}
                      <span className={`text-xs font-mono ${
                        stat.trend === 'up' ? 'text-success' : 'text-muted-foreground'
                      }`}>
                        {stat.change}
                      </span>
                    </div>
                  </div>
                  <div className="p-2 rounded-md bg-primary/10">
                    <stat.icon className="w-5 h-5 text-primary" />
                  </div>
                </div>
              </CyberCardContent>
            </CyberCard>
          </motion.div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Searches */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2"
        >
          <CyberCard>
            <CyberCardHeader className="flex flex-row items-center justify-between">
              <CyberCardTitle>Recent Searches</CyberCardTitle>
              <CyberButton variant="ghost" size="sm">
                View All <ArrowUpRight className="w-3 h-3 ml-1" />
              </CyberButton>
            </CyberCardHeader>
            <CyberCardContent>
              <div className="space-y-3">
                {recentSearches.map((search, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-md bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${
                        search.status === 'success' ? 'status-online' : 'status-pending'
                      }`} />
                      <div>
                        <code className="text-sm font-mono text-foreground">{search.query}</code>
                        <p className="text-xs text-muted-foreground">{search.module}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <CyberBadge 
                        variant={search.status === 'success' ? 'success' : 'warning'}
                        className="text-[10px]"
                      >
                        {search.status === 'success' ? 'Found' : 'No Data'}
                      </CyberBadge>
                      <p className="text-xs text-muted-foreground mt-1">{search.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CyberCardContent>
          </CyberCard>
        </motion.div>

        {/* System Alerts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <CyberCard>
            <CyberCardHeader>
              <CyberCardTitle>System Alerts</CyberCardTitle>
            </CyberCardHeader>
            <CyberCardContent>
              <div className="space-y-3">
                {systemAlerts.map((alert, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 rounded-md bg-muted/30"
                  >
                    {alert.type === 'warning' && (
                      <AlertTriangle className="w-4 h-4 text-warning flex-shrink-0 mt-0.5" />
                    )}
                    {alert.type === 'success' && (
                      <CheckCircle className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                    )}
                    {alert.type === 'info' && (
                      <Activity className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <p className="text-sm text-foreground">{alert.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">{alert.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CyberCardContent>
          </CyberCard>

          {/* Quick Actions */}
          <CyberCard className="mt-4">
            <CyberCardHeader>
              <CyberCardTitle>Quick Actions</CyberCardTitle>
            </CyberCardHeader>
            <CyberCardContent className="space-y-2">
              <CyberButton variant="outline" className="w-full justify-start" size="sm">
                <Users className="w-4 h-4 mr-2" />
                Batch Lookup
              </CyberButton>
              <CyberButton variant="outline" className="w-full justify-start" size="sm">
                <Shield className="w-4 h-4 mr-2" />
                Generate API Token
              </CyberButton>
            </CyberCardContent>
          </CyberCard>
        </motion.div>
      </div>
    </div>
  );
}
