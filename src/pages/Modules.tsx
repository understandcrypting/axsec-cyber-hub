import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Grid, 
  List,
  MessageCircle,
  Camera,
  Music,
  Send,
  Globe,
  Database,
  ShieldAlert,
  AlertTriangle,
  Crown,
  FileText,
  Wifi,
  MapPin,
  Gamepad2,
  Box,
  Joystick,
  Car,
  Gamepad,
  Code,
  FileWarning,
  Lock,
  Zap,
  ArrowRight
} from 'lucide-react';
import { mockModules, tierBadgeStyles } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { CyberCard, CyberCardContent } from '@/components/ui/cyber-card';
import { CyberInput } from '@/components/ui/cyber-input';
import { CyberBadge } from '@/components/ui/cyber-badge';
import { CyberButton } from '@/components/ui/cyber-button';
import { ModuleCategory, SubscriptionTier } from '@/types';
import { cn } from '@/lib/utils';

const iconMap: Record<string, React.ElementType> = {
  MessageCircle, Camera, Music, Send, Globe, Database, ShieldAlert,
  AlertTriangle, Crown, FileText, Wifi, MapPin, Gamepad2, Box,
  Joystick, Car, Gamepad, Code, FileWarning, Search, Hash: Grid,
  Twitter: Send, Ghost: Globe,
};

const categories: { id: ModuleCategory | 'all'; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'social', label: 'Social' },
  { id: 'breach', label: 'Breach' },
  { id: 'network', label: 'Network' },
  { id: 'gaming', label: 'Gaming' },
  { id: 'identity', label: 'Identity' },
  { id: 'utilities', label: 'Utilities' },
];

const tierOrder: SubscriptionTier[] = ['pro', 'enterprise'];

export default function Modules() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ModuleCategory | 'all'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const { user } = useAuth();
  const navigate = useNavigate();

  const userTierIndex = tierOrder.indexOf(user?.subscription || 'pro');

  const filteredModules = useMemo(() => {
    return mockModules.filter(module => {
      const matchesSearch = module.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        module.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || module.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold font-mono tracking-wide">
            <span className="text-primary">OSINT</span> Modules
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {mockModules.length} modules available
          </p>
        </div>
        <div className="flex items-center gap-2">
          <CyberBadge variant="glow" className="font-mono">
            <Zap className="w-3 h-3 mr-1" />
            {user?.dailyCreditsLimit === -1 
              ? 'Unlimited Credits' 
              : `${(user?.dailyCreditsLimit || 0) - (user?.dailyCreditsUsed || 0)} credits left`
            }
          </CyberBadge>
        </div>
      </motion.div>

      {/* Search & Filters */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col lg:flex-row gap-4"
      >
        <div className="flex-1 max-w-md">
          <CyberInput
            placeholder="Search modules..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={<Search className="w-4 h-4" />}
          />
        </div>
        
        <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0">
          {categories.map((cat) => (
            <CyberButton
              key={cat.id}
              variant={selectedCategory === cat.id ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setSelectedCategory(cat.id)}
              className="whitespace-nowrap"
            >
              {cat.label}
            </CyberButton>
          ))}
        </div>

        <div className="flex gap-1 border border-border rounded-lg p-1">
          <CyberButton
            variant={viewMode === 'grid' ? 'default' : 'ghost'}
            size="icon"
            onClick={() => setViewMode('grid')}
            className="h-8 w-8"
          >
            <Grid className="w-4 h-4" />
          </CyberButton>
          <CyberButton
            variant={viewMode === 'list' ? 'default' : 'ghost'}
            size="icon"
            onClick={() => setViewMode('list')}
            className="h-8 w-8"
          >
            <List className="w-4 h-4" />
          </CyberButton>
        </div>
      </motion.div>

      {/* Modules Grid/List */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className={cn(
          viewMode === 'grid' 
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
            : 'space-y-2'
        )}
      >
        {filteredModules.map((module, index) => {
          const Icon = iconMap[module.icon] || Search;
          const locked = isModuleLocked(module.requiredTier);
          
          return (
            <motion.div
              key={module.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.03 * index }}
            >
              {viewMode === 'grid' ? (
                <CyberCard
                  className={cn(
                    "cursor-pointer group relative h-full transition-all duration-200",
                    locked ? "opacity-50 hover:opacity-60" : "hover:border-primary/50"
                  )}
                  onClick={() => handleModuleClick(module.id)}
                >
                  <CyberCardContent className="p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div className={cn(
                        "p-2.5 rounded-lg transition-colors",
                        locked ? "bg-muted/30" : "bg-primary/10 group-hover:bg-primary/20"
                      )}>
                        <Icon className={cn(
                          "w-5 h-5",
                          locked ? "text-muted-foreground" : "text-primary"
                        )} />
                      </div>
                      {locked ? (
                        <Lock className="w-4 h-4 text-muted-foreground" />
                      ) : (
                        <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      )}
                    </div>
                    
                    <h3 className={cn(
                      "font-mono font-semibold mb-1 transition-colors",
                      locked ? "text-muted-foreground" : "text-foreground group-hover:text-primary"
                    )}>
                      {module.name}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-4">
                      {module.description}
                    </p>

                    <div className="flex items-center justify-between pt-3 border-t border-border/30">
                      <CyberBadge 
                        className={cn("text-[10px]", tierBadgeStyles[module.requiredTier])}
                      >
                        {module.requiredTier}
                      </CyberBadge>
                      <span className="text-[10px] text-muted-foreground font-mono">
                        {module.searchTypes.length} types
                      </span>
                    </div>
                  </CyberCardContent>
                </CyberCard>
              ) : (
                <CyberCard
                  className={cn(
                    "cursor-pointer group transition-all duration-200",
                    locked ? "opacity-50" : "hover:border-primary/50"
                  )}
                  onClick={() => handleModuleClick(module.id)}
                >
                  <CyberCardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "p-2 rounded-lg",
                        locked ? "bg-muted/30" : "bg-primary/10"
                      )}>
                        <Icon className={cn(
                          "w-5 h-5",
                          locked ? "text-muted-foreground" : "text-primary"
                        )} />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-mono font-semibold text-foreground">
                            {module.name}
                          </h3>
                          <CyberBadge 
                            className={cn("text-[10px]", tierBadgeStyles[module.requiredTier])}
                          >
                            {module.requiredTier}
                          </CyberBadge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5 truncate">
                          {module.description}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-xs text-muted-foreground font-mono">
                          {module.searchTypes.length} types
                        </span>
                        {locked ? (
                          <Lock className="w-4 h-4 text-muted-foreground" />
                        ) : (
                          <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        )}
                      </div>
                    </div>
                  </CyberCardContent>
                </CyberCard>
              )}
            </motion.div>
          );
        })}
      </motion.div>

      {filteredModules.length === 0 && (
        <div className="text-center py-12">
          <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground font-mono">No modules found</p>
        </div>
      )}
    </div>
  );
}
