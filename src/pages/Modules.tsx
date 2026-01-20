import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  MessageCircle,
  Camera,
  Music,
  Send,
  Globe,
  Database,
  ShieldAlert,
  Crown,
  Wifi,
  Gamepad2,
  Lock
} from 'lucide-react';
import { mockModules, tierBadgeStyles } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { SubscriptionTier } from '@/types';
import { cn } from '@/lib/utils';

const iconMap: Record<string, React.ElementType> = {
  MessageCircle, Camera, Music, Send, Globe, Database, ShieldAlert,
  Crown, Wifi, Gamepad2, Search,
};

const tierOrder: SubscriptionTier[] = ['pro', 'enterprise'];

export default function Modules() {
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  const userTierIndex = tierOrder.indexOf(user?.subscription || 'pro');

  const filteredModules = useMemo(() => {
    return mockModules.filter(module => {
      const matchesSearch = module.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        module.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
  }, [searchQuery]);

  // Split modules by tier
  const featuredModules = filteredModules.filter(m => m.requiredTier === 'pro');
  const premiumModules = filteredModules.filter(m => m.requiredTier === 'enterprise');

  const handleModuleClick = (moduleId: string) => {
    const module = mockModules.find(m => m.id === moduleId);
    if (!module) return;

    const moduleTierIndex = tierOrder.indexOf(module.requiredTier);
    if (moduleTierIndex <= userTierIndex) {
      navigate(`/modules/${moduleId}`);
    }
  };

  const isModuleLocked = (requiredTier: SubscriptionTier) => {
    return tierOrder.indexOf(requiredTier) > userTierIndex;
  };

  const ModuleCard = ({ module, isComingSoon = false }: { module: typeof mockModules[0], isComingSoon?: boolean }) => {
    const Icon = iconMap[module.icon] || Database;
    const locked = isModuleLocked(module.requiredTier);
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          "clean-card p-5 cursor-pointer transition-all duration-200 group relative",
          locked && "opacity-60",
          isComingSoon && "opacity-50 pointer-events-none"
        )}
        onClick={() => !isComingSoon && handleModuleClick(module.id)}
      >
        {isComingSoon && (
          <span className="absolute top-3 right-3 text-[10px] uppercase tracking-wider text-muted-foreground">
            Coming Soon
          </span>
        )}
        {locked && !isComingSoon && (
          <Lock className="absolute top-3 right-3 w-4 h-4 text-muted-foreground" />
        )}
        
        <div className="p-3 rounded-md bg-muted/50 w-fit mb-4">
          <Icon className="w-5 h-5 text-foreground" />
        </div>
        
        <h3 className="font-semibold text-foreground mb-2 uppercase text-sm tracking-wide">
          {module.name}
        </h3>
        <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
          {module.description}
        </p>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen grid-pattern">
      <div className="max-w-6xl mx-auto p-6 lg:p-8 space-y-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
            Explore Our Tools
          </p>
          <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-3">
            Module Library
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Access our comprehensive collection of OSINT tools, breach databases, and intelligence modules
          </p>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-2xl mx-auto"
        >
          <Input
            placeholder="Search modules..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-card border-border h-12 text-sm font-mono"
          />
        </motion.div>

        {/* Featured & Recommended */}
        {featuredModules.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="section-divider mb-6">
              <span className="text-xs uppercase tracking-widest text-muted-foreground font-semibold px-4">
                Featured & Recommended
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {featuredModules.map((module) => (
                <ModuleCard key={module.id} module={module} />
              ))}
            </div>
          </motion.div>
        )}

        {/* Premium Only */}
        {premiumModules.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="section-divider mb-6">
              <span className="text-xs uppercase tracking-widest text-muted-foreground font-semibold px-4">
                AXSEC Premium Only
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {premiumModules.map((module) => (
                <ModuleCard key={module.id} module={module} />
              ))}
            </div>
          </motion.div>
        )}

        {filteredModules.length === 0 && (
          <div className="text-center py-16">
            <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground font-mono">No modules found</p>
          </div>
        )}
      </div>
    </div>
  );
}