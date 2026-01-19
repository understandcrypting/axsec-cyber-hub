import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { CyberButton } from '@/components/ui/cyber-button';
import { CyberInput } from '@/components/ui/cyber-input';
import { CyberCard, CyberCardContent } from '@/components/ui/cyber-card';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const success = await login(username, password);
      if (success) {
        navigate('/dashboard');
      } else {
        setError('Invalid credentials or inactive account');
      }
    } catch {
      setError('Authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 cyber-grid relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-sm"
      >
        <CyberCard className="backdrop-blur-xl border-border/50">
          <CyberCardContent className="p-8">
            {/* Logo & Header */}
            <motion.div 
              className="text-center mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex justify-center mb-4">
                <div className="relative p-3 rounded-xl bg-primary/10 border border-primary/20">
                  <Shield className="w-10 h-10 text-primary" />
                </div>
              </div>
              <h1 className="text-2xl font-bold font-mono tracking-wider text-foreground">
                <span className="text-primary">AX</span>SEC
              </h1>
              <p className="text-xs text-muted-foreground mt-2 tracking-widest uppercase">
                Intelligence Platform
              </p>
            </motion.div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 p-3 mb-4 rounded-md bg-destructive/10 border border-destructive/30 text-destructive text-sm"
              >
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span className="font-mono text-xs">{error}</span>
              </motion.div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
                  Username
                </label>
                <CyberInput
                  type="text"
                  placeholder="Enter username..."
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  autoFocus
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
                  Password
                </label>
                <div className="relative">
                  <CyberInput
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter password..."
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <CyberButton
                type="submit"
                className="w-full mt-6"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <motion.div
                      className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    />
                    Authenticating...
                  </span>
                ) : (
                  'Sign In'
                )}
              </CyberButton>
            </form>

            {/* Footer */}
            <div className="mt-6 pt-4 border-t border-border/30 text-center">
              <p className="text-xs font-mono text-muted-foreground/60">
                Demo: admin / any password (4+ chars)
              </p>
            </div>
          </CyberCardContent>
        </CyberCard>
      </motion.div>
    </div>
  );
}
