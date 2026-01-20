import { motion } from 'framer-motion';
import { 
  Zap, 
  Crown, 
  Search, 
  Clock,
  LayoutGrid,
  Plus
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
      <div className="max-w-6xl mx-auto p-6 lg:p-8 space-y-8">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
            Welcome back
          </p>
          <h1 className="text-3xl lg:text-4xl font-bold font-mono text-foreground">
            {user?.username}
          </h1>
          <p className="text-muted-foreground mt-2">
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
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-md bg-muted">
                <Zap className="w-4 h-4 text-foreground" />
              </div>
              <span className="text-xs uppercase tracking-wider text-muted-foreground">
                Credits Today
              </span>
            </div>
            <p className="text-3xl font-mono font-bold text-foreground">
              {isUnlimited ? '∞' : creditsLimit - creditsUsed}
            </p>
            <div className="mt-2">
              <p className="text-xs text-muted-foreground">
                of {isUnlimited ? 'unlimited' : creditsLimit} limit
              </p>
              {!isUnlimited && (
                <div className="mt-2 h-1 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full transition-all"
                    style={{ width: `${((creditsLimit - creditsUsed) / creditsLimit) * 100}%` }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Account Status */}
          <div className="clean-card p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-md bg-muted">
                <Crown className="w-4 h-4 text-foreground" />
              </div>
              <span className="text-xs uppercase tracking-wider text-muted-foreground">
                Account Status
              </span>
            </div>
            <p className="text-2xl font-mono font-bold text-foreground capitalize">
              {user?.subscription || 'Pro'}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Member since {memberSince}
            </p>
          </div>

          {/* Total Lookups */}
          <div className="clean-card p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-md bg-muted">
                <Search className="w-4 h-4 text-foreground" />
              </div>
              <span className="text-xs uppercase tracking-wider text-muted-foreground">
                Total Lookups
              </span>
            </div>
            <p className="text-3xl font-mono font-bold text-foreground">
              {user?.totalSearches || 0}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              All-time lookup count
            </p>
          </div>

          {/* Reset In */}
          <div className="clean-card p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-md bg-muted">
                <Clock className="w-4 h-4 text-foreground" />
              </div>
              <span className="text-xs uppercase tracking-wider text-muted-foreground">
                Reset In
              </span>
            </div>
            <p className="text-3xl font-mono font-bold text-foreground">
              {resetTime}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Usage resets in
            </p>
          </div>
        </motion.div>

        {/* Browse Modules Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="clean-card p-6 relative"
        >
          <div className="absolute top-4 right-4 text-muted-foreground/30">
            <Plus className="w-8 h-8" />
          </div>
          <h2 className="text-sm uppercase tracking-widest font-semibold text-foreground mb-2">
            Browse Modules
          </h2>
          <p className="text-muted-foreground text-sm max-w-2xl mb-6">
            Access our comprehensive collection of OSINT tools, breach databases, and intelligence modules. 
            Explore various data sources and investigative resources.
          </p>
          <Button 
            variant="outline" 
            className="font-mono uppercase tracking-wider text-xs"
            onClick={() => navigate('/modules')}
          >
            <LayoutGrid className="w-4 h-4 mr-2" />
            Browse Modules Now
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
            <h3 className="font-semibold text-foreground">System status</h3>
            <p className="text-sm text-muted-foreground">
              All systems operational. No incidents reported.
            </p>
          </div>
          <span className="status-operational text-xs font-mono uppercase px-3 py-1.5 rounded">
            Operational
          </span>
        </motion.div>
      </div>
    </div>
  );
}