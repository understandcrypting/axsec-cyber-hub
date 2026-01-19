import { motion } from 'framer-motion';
import { 
  CreditCard, 
  Check, 
  Crown, 
  Shield,
  Zap,
  Mail
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { CyberCard, CyberCardContent, CyberCardHeader, CyberCardTitle } from '@/components/ui/cyber-card';
import { CyberButton } from '@/components/ui/cyber-button';
import { CyberBadge } from '@/components/ui/cyber-badge';
import { SubscriptionTier } from '@/types';
import { cn } from '@/lib/utils';

interface Plan {
  tier: SubscriptionTier;
  name: string;
  credits: string;
  description: string;
  features: string[];
  icon: React.ElementType;
}

const plans: Plan[] = [
  {
    tier: 'pro',
    name: 'Pro',
    credits: '100/day',
    description: 'For professionals and researchers',
    features: [
      '100 credits per day',
      'Access to all Pro modules',
      'Standard support',
      'Search history',
      'Export results',
    ],
    icon: Shield,
  },
  {
    tier: 'enterprise',
    name: 'Enterprise',
    credits: 'Unlimited',
    description: 'For teams and organizations',
    features: [
      'Unlimited daily credits',
      'All modules unlocked',
      'Priority support',
      'Advanced modules (IntelX, NPD, etc.)',
      'Bulk operations',
      'Custom integrations',
    ],
    icon: Crown,
  },
];

export default function Subscriptions() {
  const { user } = useAuth();

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-2xl font-bold font-mono tracking-wide">
          <span className="text-primary">Subscription</span> Plans
        </h1>
        <p className="text-sm text-muted-foreground mt-2">
          Your plan is managed by an administrator
        </p>
      </motion.div>

      {/* Current Plan Status */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <CyberCard glow>
          <CyberCardContent className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <CreditCard className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Current Plan</p>
                  <p className="text-xl font-mono font-bold text-foreground capitalize">{user?.subscription}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-xs text-muted-foreground uppercase">Daily Credits</p>
                  <p className="font-mono font-bold text-foreground">
                    {user?.dailyCreditsLimit === -1 ? (
                      <span className="text-yellow-400">Unlimited</span>
                    ) : (
                      <span>
                        <span className="text-primary">{(user?.dailyCreditsLimit || 0) - (user?.dailyCreditsUsed || 0)}</span>
                        <span className="text-muted-foreground"> / {user?.dailyCreditsLimit}</span>
                      </span>
                    )}
                  </p>
                </div>
                <CyberBadge variant="glow">Active</CyberBadge>
              </div>
            </div>
          </CyberCardContent>
        </CyberCard>
      </motion.div>

      {/* Plans Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {plans.map((plan, index) => {
          const Icon = plan.icon;
          const isCurrentPlan = user?.subscription === plan.tier;
          
          return (
            <motion.div
              key={plan.tier}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <CyberCard 
                className={cn(
                  "relative h-full flex flex-col",
                  isCurrentPlan && "border-primary/50 ring-1 ring-primary/20"
                )}
              >
                {isCurrentPlan && (
                  <div className="absolute -top-3 left-4">
                    <CyberBadge variant="glow">Current Plan</CyberBadge>
                  </div>
                )}
                
                <CyberCardHeader className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "p-2 rounded-lg",
                      plan.tier === 'enterprise' ? "bg-yellow-500/10" : "bg-primary/10"
                    )}>
                      <Icon className={cn(
                        "w-5 h-5",
                        plan.tier === 'enterprise' ? "text-yellow-400" : "text-primary"
                      )} />
                    </div>
                    <div>
                      <CyberCardTitle className="text-lg">{plan.name}</CyberCardTitle>
                      <p className="text-sm text-muted-foreground">{plan.description}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-baseline gap-2">
                    <Zap className={cn(
                      "w-4 h-4",
                      plan.tier === 'enterprise' ? "text-yellow-400" : "text-primary"
                    )} />
                    <span className="text-2xl font-bold font-mono">{plan.credits}</span>
                    <span className="text-muted-foreground text-sm">credits</span>
                  </div>
                </CyberCardHeader>

                <CyberCardContent className="flex-1">
                  <ul className="space-y-3">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <Check className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CyberCardContent>

                <div className="p-6 pt-0">
                  {isCurrentPlan ? (
                    <CyberButton variant="outline" className="w-full" disabled>
                      Current Plan
                    </CyberButton>
                  ) : (
                    <CyberButton variant="outline" className="w-full" disabled>
                      Contact Admin
                    </CyberButton>
                  )}
                </div>
              </CyberCard>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Contact Admin */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <CyberCard>
          <CyberCardContent className="p-6 text-center">
            <Mail className="w-8 h-8 text-primary mx-auto mb-3" />
            <h3 className="font-mono font-semibold text-foreground mb-2">Need to upgrade?</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Contact your administrator to change your subscription plan.
            </p>
            <CyberButton variant="outline">
              <Mail className="w-4 h-4 mr-2" />
              Contact Support
            </CyberButton>
          </CyberCardContent>
        </CyberCard>
      </motion.div>
    </div>
  );
}
