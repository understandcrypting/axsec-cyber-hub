import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Search, 
  Loader2, 
  CheckCircle, 
  XCircle,
  Copy,
  ExternalLink,
  Terminal
} from 'lucide-react';
import { mockModules } from '@/data/mockData';
import { CyberCard, CyberCardContent, CyberCardHeader, CyberCardTitle } from '@/components/ui/cyber-card';
import { CyberInput } from '@/components/ui/cyber-input';
import { CyberButton } from '@/components/ui/cyber-button';
import { CyberBadge } from '@/components/ui/cyber-badge';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface MockResult {
  success: boolean;
  data: Record<string, unknown>;
  source: string;
  timestamp: string;
}

// Mock result generator
function generateMockResult(moduleId: string, query: string): MockResult {
  const sources = ['Primary DB', 'Cache', 'External API', 'Archive'];
  const randomSource = sources[Math.floor(Math.random() * sources.length)];
  
  const mockData: Record<string, Record<string, unknown>> = {
    discord: {
      user_id: query,
      username: 'target_user#1234',
      created_at: '2019-03-15',
      avatar_url: 'https://cdn.discordapp.com/avatars/...',
      badges: ['Nitro', 'Early Supporter'],
      mutual_servers: 12,
      connections: ['Steam', 'Spotify', 'GitHub'],
    },
    instagram: {
      username: query,
      full_name: 'John Doe',
      followers: 1523,
      following: 342,
      posts: 89,
      bio: 'Living life to the fullest 🌟',
      is_verified: false,
      is_private: true,
    },
    leakosint: {
      email: query,
      breaches: ['LinkedIn 2021', 'Adobe 2019', 'Dropbox 2012'],
      total_records: 4,
      password_hashes: 2,
      first_seen: '2012-07-15',
      last_updated: '2024-08-20',
    },
    shodan: {
      ip: query,
      hostname: 'server.example.com',
      country: 'United States',
      city: 'San Francisco',
      org: 'Cloudflare Inc',
      ports: [80, 443, 22, 8080],
      vulns: ['CVE-2021-44228'],
    },
    roblox: {
      user_id: query,
      username: 'RobloxPlayer123',
      display_name: 'CoolPlayer',
      created: '2018-05-20',
      friends: 234,
      followers: 1089,
      groups: 15,
    },
  };

  return {
    success: Math.random() > 0.2, // 80% success rate
    data: mockData[moduleId] || { query, module: moduleId, result: 'Sample data found' },
    source: randomSource,
    timestamp: new Date().toISOString(),
  };
}

export default function ModuleSearch() {
  const { moduleId } = useParams<{ moduleId: string }>();
  const navigate = useNavigate();
  const [selectedSearchType, setSelectedSearchType] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<MockResult | null>(null);

  const module = mockModules.find(m => m.id === moduleId);

  if (!module) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <XCircle className="w-12 h-12 text-destructive mb-4" />
        <h2 className="text-xl font-mono text-foreground">Module Not Found</h2>
        <CyberButton variant="outline" onClick={() => navigate('/modules')} className="mt-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Modules
        </CyberButton>
      </div>
    );
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setResults(null);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));

    const result = generateMockResult(moduleId!, searchQuery);
    setResults(result);
    setIsSearching(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4"
      >
        <CyberButton variant="ghost" size="icon" onClick={() => navigate('/modules')}>
          <ArrowLeft className="w-5 h-5" />
        </CyberButton>
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold font-mono tracking-wide">
            <span className="text-primary text-glow">{module.name}</span> Lookup
          </h1>
          <p className="text-sm text-muted-foreground font-mono mt-1">
            {module.description}
          </p>
        </div>
      </motion.div>

      {/* Search Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <CyberCard glow>
          <CyberCardHeader>
            <CyberCardTitle className="flex items-center gap-2">
              <Terminal className="w-5 h-5 text-primary" />
              Search Parameters
            </CyberCardTitle>
          </CyberCardHeader>
          <CyberCardContent>
            {/* Search Type Tabs */}
            <div className="flex flex-wrap gap-2 mb-4">
              {module.searchTypes.map((type, index) => (
                <CyberButton
                  key={type.id}
                  variant={selectedSearchType === index ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => {
                    setSelectedSearchType(index);
                    setSearchQuery('');
                    setResults(null);
                  }}
                >
                  {type.label}
                </CyberButton>
              ))}
            </div>

            {/* Search Form */}
            <form onSubmit={handleSearch} className="space-y-4">
              <div>
                <label className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-2 block">
                  {module.searchTypes[selectedSearchType].label}
                </label>
                <div className="flex gap-3">
                  <CyberInput
                    placeholder={module.searchTypes[selectedSearchType].placeholder}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    icon={<Search className="w-4 h-4" />}
                    className="flex-1"
                    disabled={isSearching}
                  />
                  <CyberButton type="submit" disabled={isSearching || !searchQuery.trim()}>
                    {isSearching ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Searching...
                      </>
                    ) : (
                      <>
                        <Search className="w-4 h-4" />
                        Search
                      </>
                    )}
                  </CyberButton>
                </div>
              </div>
            </form>
          </CyberCardContent>
        </CyberCard>
      </motion.div>

      {/* Results */}
      <AnimatePresence mode="wait">
        {isSearching && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-12"
          >
            <div className="relative inline-flex">
              <Loader2 className="w-12 h-12 text-primary animate-spin" />
              <motion.div
                className="absolute inset-0 bg-primary/20 rounded-full blur-xl"
                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0.2, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
            <p className="font-mono text-muted-foreground mt-4">
              Querying databases...
            </p>
          </motion.div>
        )}

        {results && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <CyberCard>
              <CyberCardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center gap-3">
                  {results.success ? (
                    <CheckCircle className="w-5 h-5 text-success" />
                  ) : (
                    <XCircle className="w-5 h-5 text-destructive" />
                  )}
                  <CyberCardTitle>
                    {results.success ? 'Results Found' : 'No Results'}
                  </CyberCardTitle>
                </div>
                <div className="flex items-center gap-2">
                  <CyberBadge variant={results.success ? 'success' : 'destructive'}>
                    {results.source}
                  </CyberBadge>
                  <span className="text-xs text-muted-foreground font-mono">
                    {new Date(results.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              </CyberCardHeader>
              <CyberCardContent>
                {results.success ? (
                  <div className="space-y-4">
                    {/* Raw JSON Output */}
                    <div className="relative">
                      <pre className="p-4 rounded-lg bg-muted/30 overflow-x-auto text-sm font-mono text-foreground">
                        {JSON.stringify(results.data, null, 2)}
                      </pre>
                      <button
                        onClick={() => copyToClipboard(JSON.stringify(results.data, null, 2))}
                        className="absolute top-2 right-2 p-2 rounded-md bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Parsed Data Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {Object.entries(results.data).map(([key, value]) => (
                        <div key={key} className="p-3 rounded-md bg-muted/20">
                          <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
                            {key.replace(/_/g, ' ')}
                          </p>
                          <p className="font-mono text-foreground mt-1 break-all">
                            {Array.isArray(value) 
                              ? value.join(', ') 
                              : String(value)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <XCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground font-mono">
                      No data found for query: <code className="text-primary">{searchQuery}</code>
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Try a different search term or check another module
                    </p>
                  </div>
                )}
              </CyberCardContent>
            </CyberCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
