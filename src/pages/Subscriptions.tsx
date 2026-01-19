import { motion } from 'framer-motion';
import { 
  CreditCard, 
  Check, 
  Crown, 
  Zap, 
  Shield, 
  Star,
  ArrowUpRight
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
  price: string;
  description: string;
  features: string[];
  icon: React.ElementType;
  popular?: boolean;
}

const plans: Plan[] = [
  {
    tier: 'free',
    name: 'Free',
    price: '$0',
    description: 'Basic access for light usage',
    features: [
      '100 searches per month',
      'Basic modules only',
      'Email support',
      'Community access',
    ],
    icon: Star,
  },
  {
    tier: 'basic',
    name: 'Basic',
    price: '$29',
    description: 'Essential tools for individuals',
    features: [
      '1,000 searches per month',
      'Basic + Social modules',
      'Email & chat support',
      'API access (limited)',
      'Search history',
    ],
    icon: Zap,
  },
  {
    tier: 'pro',
    name: 'Pro',
    price: '$99',
    description: 'Advanced features for professionals',
    features: [
      '5,000 searches per month',
      'All Pro modules',
      'Priority support',
      'Full API access',
      'Batch operations',
      'Export capabilities',
      'Custom alerts',
    ],
    icon: Shield,
    popular: true,
  },
  {
    tier: 'enterprise',
    name: 'Enterprise',
    price: '$299',
    description: 'Unlimited power for teams',
    features: [
      'Unlimited searches',
      'All modules unlocked',
      'Dedicated support',
      'Unlimited API access',
      'Team management',
      'Custom integrations',
      'SLA guarantee',
      'On-premise option',
    ],
    icon: Crown,
  },
];

const tierOrder: SubscriptionTier[] = ['free', 'basic', 'pro', 'enterprise'];

export default function Subscriptions() {
  const { user } = useAuth();
  const currentTierIndex = tierOrder.indexOf(user?.subscription || 'free');

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-2xl mx-auto"
      >
        <h1 className="text-2xl lg:text-3xl font-bold font-mono tracking-wide">
          <span className="text-primary text-glow">Subscription</span> Plans
        </h1>
        <p className="text-sm text-muted-foreground font-mono mt-2">
          Choose the plan that fits your intelligence needs
        </p>
      </motion.div>

      {/* Current Plan */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="max-w-md mx-auto"
      >
        <CyberCard glow>
          <CyberCardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CreditCard className="w-5 h-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground font-mono uppercase">Current Plan</p>
                <p className="font-mono font-bold text-foreground capitalize">{user?.subscription}</p>
              </div>
            </div>
            <CyberBadge variant="glow">Active</CyberBadge>
          </CyberCardContent>
        </CyberCard>
      </motion.div>

      {/* Plans Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 max-w-7xl mx-auto"
      >
        {plans.map((plan, index) => {
          const Icon = plan.icon;
          const isCurrentPlan = user?.subscription === plan.tier;
          const tierIndex = tierOrder.indexOf(plan.tier);
          const canUpgrade = tierIndex > currentTierIndex;
          const canDowngrade = tierIndex < currentTierIndex;
          
          return (
            <motion.div
              key={plan.tier}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <CyberCard 
                glow={plan.popular}
                className={cn(
                  "relative h-full flex flex-col",
                  plan.popular && "border-primary/50",
                  isCurrentPlan && "ring-2 ring-primary"
                )}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <CyberBadge variant="glow">Most Popular</CyberBadge>
                  </div>
                )}
                
                <CyberCardHeader className="text-center">
                  <div className={cn(
                    "w-12 h-12 rounded-lg mx-auto flex items-center justify-center mb-2",
                    plan.popular ? "bg-primary/20" : "bg-muted/50"
                  )}>
                    <Icon className={cn(
                      "w-6 h-6",
                      plan.popular ? "text-primary" : "text-muted-foreground"
                    )} />
                  </div>
                  <CyberCardTitle className="text-lg">{plan.name}</CyberCardTitle>
                  <div className="mt-2">
                    <span className="text-3xl font-bold font-mono text-foreground">{plan.price}</span>
                    <span className="text-muted-foreground text-sm">/month</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">{plan.description}</p>
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
                  ) : canUpgrade ? (
                    <CyberButton 
                      variant={plan.popular ? 'glow' : 'default'} 
                      className="w-full"
                    >
                      Upgrade <ArrowUpRight className="w-4 h-4 ml-1" />
                    </CyberButton>
                  ) : (
                    <CyberButton variant="ghost" className="w-full text-muted-foreground">
                      Downgrade
                    </CyberButton>
                  )}
                </div>
              </CyberCard>
            </motion.div>
          );
        })}
      </motion.div>

      {/* FAQ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="max-w-2xl mx-auto mt-12"
      >
        <CyberCard>
          <CyberCardHeader>
            <CyberCardTitle>Frequently Asked Questions</CyberCardTitle>
          </CyberCardHeader>
          <CyberCardContent className="space-y-4">
            <div>
              <h4 className="font-mono text-foreground font-semibold">Can I change plans anytime?</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.
              </p>
            </div>
            <div>
              <h4 className="font-mono text-foreground font-semibold">What payment methods do you accept?</h4>
              <p className="text-sm text-muted-foreground mt-1">
                We accept all major credit cards, PayPal, and cryptocurrency payments.
              </p>
            </div>
            <div>
              <h4 className="font-mono text-foreground font-semibold">Is there a refund policy?</h4>
              <p className="text-sm text-muted-foreground mt-1">
                We offer a 14-day money-back guarantee for all paid plans.
              </p>
            </div>
          </CyberCardContent>
        </CyberCard>
      </motion.div>
    </div>
  );
}
