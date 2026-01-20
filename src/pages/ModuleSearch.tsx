import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Search, 
  Loader2, 
  CheckCircle, 
  XCircle,
  Copy
} from 'lucide-react';
import { mockModules } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface MockResult {
  success: boolean;
  data: Record<string, unknown>;
  source: string;
  timestamp: string;
}

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
      bio: 'Living life to the fullest',
      is_verified: false,
      is_private: true,
    },
    snusbase: {
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
  };

  return {
    success: Math.random() > 0.2,
    data: mockData[moduleId] || { query, module: moduleId, result: 'Sample data found' },
    source: randomSource,
    timestamp: new Date().toISOString(),
  };
}

export default function ModuleSearch() {
  const { moduleId } = useParams<{ moduleId: string }>();
  const navigate = useNavigate();
  const [selectedSearchType, setSelectedSearchType] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<MockResult | null>(null);

  const module = mockModules.find(m => m.id === moduleId);

  if (!module) {
    return (
      <div className="min-h-screen grid-pattern flex flex-col items-center justify-center">
        <XCircle className="w-12 h-12 text-destructive mb-4" />
        <h2 className="text-xl font-mono text-foreground">Module Not Found</h2>
        <Button variant="outline" onClick={() => navigate('/modules')} className="mt-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Modules
        </Button>
      </div>
    );
  }

  // Set default search type
  if (!selectedSearchType && module.searchTypes.length > 0) {
    setSelectedSearchType(module.searchTypes[0].id);
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setResults(null);

    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));

    const result = generateMockResult(moduleId!, searchQuery);
    setResults(result);
    setIsSearching(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const currentSearchType = module.searchTypes.find(t => t.id === selectedSearchType) || module.searchTypes[0];

  return (
    <div className="min-h-screen grid-pattern">
      <div className="max-w-3xl mx-auto p-6 lg:p-8 space-y-8">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate('/modules')}
            className="font-mono uppercase tracking-wider text-xs"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Modules
          </Button>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
            Advanced OSINT
          </p>
          <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-3">
            {module.name}
          </h1>
          <p className="text-muted-foreground">
            {module.description}
          </p>
        </motion.div>

        {/* Search Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="clean-card p-6"
        >
          {/* Tabs */}
          <div className="flex gap-6 border-b border-border mb-6">
            {module.searchTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => {
                  setSelectedSearchType(type.id);
                  setSearchQuery('');
                  setResults(null);
                }}
                className={cn(
                  "pb-3 text-sm font-medium uppercase tracking-wider transition-colors relative",
                  selectedSearchType === type.id 
                    ? "text-foreground" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {type.label}
                {selectedSearchType === type.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground"
                  />
                )}
              </button>
            ))}
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="space-y-4">
            <div>
              <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2 block">
                Query
              </label>
              <Input
                placeholder={currentSearchType?.placeholder || 'Enter query...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-input border-border h-12 font-mono"
                disabled={isSearching}
              />
            </div>

            {module.searchTypes.length > 1 && (
              <div>
                <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2 block">
                  Query Type
                </label>
                <Select value={selectedSearchType} onValueChange={setSelectedSearchType}>
                  <SelectTrigger className="bg-input border-border h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {module.searchTypes.map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <Button 
              type="submit" 
              disabled={isSearching || !searchQuery.trim()}
              className="w-full h-12 font-mono uppercase tracking-wider"
            >
              {isSearching ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  Search Database
                </>
              )}
            </Button>
          </form>
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
              <Loader2 className="w-10 h-10 text-muted-foreground animate-spin mx-auto" />
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
              className="clean-card overflow-hidden"
            >
              <div className="p-4 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {results.success ? (
                    <CheckCircle className="w-5 h-5 text-success" />
                  ) : (
                    <XCircle className="w-5 h-5 text-destructive" />
                  )}
                  <span className="font-medium text-foreground">
                    {results.success ? 'Results Found' : 'No Results'}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground font-mono">
                  {results.source} • {new Date(results.timestamp).toLocaleTimeString()}
                </span>
              </div>
              
              <div className="p-4">
                {results.success ? (
                  <div className="space-y-4">
                    <div className="relative">
                      <pre className="p-4 rounded-md bg-muted/30 overflow-x-auto text-sm font-mono text-foreground">
                        {JSON.stringify(results.data, null, 2)}
                      </pre>
                      <button
                        onClick={() => copyToClipboard(JSON.stringify(results.data, null, 2))}
                        className="absolute top-2 right-2 p-2 rounded-md bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {Object.entries(results.data).map(([key, value]) => (
                        <div key={key} className="p-3 rounded-md bg-muted/20 border border-border/50">
                          <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-1">
                            {key.replace(/_/g, ' ')}
                          </p>
                          <p className="font-mono text-foreground text-sm break-all">
                            {Array.isArray(value) ? value.join(', ') : String(value)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <XCircle className="w-10 h-10 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      No data found for: <code className="text-foreground">{searchQuery}</code>
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}