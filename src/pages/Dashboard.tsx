import { motion } from 'framer-motion';
import { 
  Zap, 
  Crown, 
  Search, 
  Clock,
  LayoutGrid,
  Plus,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const creditsUsed = user?.dailyCreditsUsed || 0;
  const creditsLimit = user?.dailyCreditsLimit || 100;
  const isUnlimited = creditsLimit === -1;

  // Calculate time until reset (midnight UTC)
  const now = new Date();
  const midnight = new Date(now);
  midnight.setUTCHours(24, 0, 0, 0);
  const diff = midnight.getTime() - now.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  const resetTime = `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const memberSince = user?.createdAt 
    ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : '--';

  return (
    <div className="min-h-screen grid-pattern">
      <div className="max-w-6xl mx-auto p-6 lg:p-8 space-y-6">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
            Welcome back
          </p>
          <h1 className="text-2xl lg:text-3xl font-semibold font-mono text-foreground">
            {user?.username}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Your account overview and quick access to tools.
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {/* Credits Today */}
          <div className="clean-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-4 h-4 text-muted-foreground" />
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
                Credits Today
              </span>
            </div>
            <p className="text-3xl font-mono font-semibold text-foreground mb-1">
              {isUnlimited ? '∞' : creditsLimit - creditsUsed}
            </p>
            <p className="text-xs text-muted-foreground">
              of {isUnlimited ? 'unlimited' : `${creditsLimit} limit`}
            </p>
            {!isUnlimited && (
              <div className="mt-3 h-1 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-foreground/60 rounded-full transition-all"
                  style={{ width: `${((creditsLimit - creditsUsed) / creditsLimit) * 100}%` }}
                />
              </div>
            )}
          </div>

          {/* Account Status */}
          <div className="clean-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <Crown className="w-4 h-4 text-muted-foreground" />
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
                Account Status
              </span>
            </div>
            <p className="text-2xl font-mono font-semibold text-foreground capitalize mb-1">
              {user?.subscription || 'Pro'}
            </p>
            <p className="text-xs text-muted-foreground">
              Member since {memberSince}
            </p>
          </div>

          {/* Total Lookups */}
          <div className="clean-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <Search className="w-4 h-4 text-muted-foreground" />
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
                Total Lookups
              </span>
            </div>
            <p className="text-3xl font-mono font-semibold text-foreground mb-1">
              {user?.totalSearches || 0}
            </p>
            <p className="text-xs text-muted-foreground">
              All-time lookup count
            </p>
          </div>

          {/* Reset In */}
          <div className="clean-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
                Reset In
              </span>
            </div>
            <p className="text-3xl font-mono font-semibold text-foreground mb-1">
              {resetTime}
            </p>
            <p className="text-xs text-muted-foreground">
              Usage resets in
            </p>
          </div>
        </motion.div>

        {/* Browse Modules Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="clean-card p-6 relative overflow-hidden"
        >
          <div className="absolute top-4 right-4 text-muted-foreground/20">
            <Plus className="w-12 h-12" />
          </div>
          <h2 className="text-xs uppercase tracking-widest font-medium text-muted-foreground mb-2">
            Browse Modules
          </h2>
          <p className="text-muted-foreground text-sm max-w-2xl mb-5">
            Access our comprehensive collection of OSINT tools, breach databases, and intelligence modules. 
            Explore various data sources and investigative resources.
          </p>
          <Button 
            variant="outline" 
            className="font-mono uppercase tracking-widest text-xs group"
            onClick={() => navigate('/modules')}
          >
            <LayoutGrid className="w-4 h-4 mr-2" />
            Browse Modules Now
            <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
          </Button>
        </motion.div>

        {/* System Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="clean-card p-5 flex items-center justify-between"
        >
          <div>
            <h3 className="font-medium text-foreground text-sm">System Status</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              All systems operational. No incidents reported.
            </p>
          </div>
          <span className="status-operational uppercase font-mono rounded">
            Operational
          </span>
        </motion.div>
      </div>
    </div>
  );
}