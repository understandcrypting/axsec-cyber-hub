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
  Lock,
  ChevronRight
} from 'lucide-react';
import { mockModules } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/ui/input';
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
          locked && "opacity-50",
          isComingSoon && "opacity-40 pointer-events-none"
        )}
        onClick={() => !isComingSoon && handleModuleClick(module.id)}
      >
        {isComingSoon && (
          <span className="absolute top-3 right-3 text-[9px] uppercase tracking-wider text-muted-foreground">
            Coming Soon
          </span>
        )}
        {locked && !isComingSoon && (
          <Lock className="absolute top-4 right-4 w-3.5 h-3.5 text-muted-foreground" />
        )}
        
        <div className="w-10 h-10 rounded bg-muted flex items-center justify-center mb-4">
          <Icon className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
        </div>
        
        <h3 className="font-medium text-foreground mb-1.5 text-sm uppercase tracking-wide">
          {module.name}
        </h3>
        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
          {module.description}
        </p>

        <ChevronRight className="absolute bottom-4 right-4 w-4 h-4 text-muted-foreground/0 group-hover:text-muted-foreground transition-all group-hover:translate-x-0.5" />
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen grid-pattern">
      <div className="max-w-6xl mx-auto p-6 lg:p-8 space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
            Explore Our Tools
          </p>
          <h1 className="text-2xl lg:text-3xl font-semibold text-foreground mb-2">
            Module Library
          </h1>
          <p className="text-sm text-muted-foreground max-w-lg mx-auto">
            Access our comprehensive collection of OSINT tools, breach databases, and intelligence modules
          </p>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-xl mx-auto"
        >
          <Input
            placeholder="Search modules..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-card border-border h-11 text-sm font-mono"
          />
        </motion.div>

        {/* Featured & Recommended */}
        {featuredModules.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="section-divider mb-5">
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium px-4">
                Featured & Recommended
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {featuredModules.map((module, index) => (
                <motion.div
                  key={module.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * index }}
                >
                  <ModuleCard module={module} />
                </motion.div>
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
            <div className="section-divider mb-5">
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium px-4">
                AXSEC Premium Only
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {premiumModules.map((module, index) => (
                <motion.div
                  key={module.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * index }}
                >
                  <ModuleCard module={module} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {filteredModules.length === 0 && (
          <div className="text-center py-16">
            <Search className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground text-sm">No modules found</p>
          </div>
        )}
      </div>
    </div>
  );
}