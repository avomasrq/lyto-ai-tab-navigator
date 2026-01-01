import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useDashboardData } from '@/hooks/useDashboardData';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { UsageChart } from '@/components/dashboard/UsageChart';
import { PromptHistory } from '@/components/dashboard/PromptHistory';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { 
  Activity, 
  Hash, 
  Calendar, 
  Clock, 
  ArrowLeft,
  LogOut,
  Database
} from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading, signOut } = useAuth();
  const { prompts, tokenUsage, stats, loading: dataLoading, error, refetch } = useDashboardData();
  const [seeding, setSeeding] = useState(false);

  const handleSeedTestData = async () => {
    setSeeding(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error('Please sign in first');
        return;
      }

      const response = await supabase.functions.invoke('seed-test-data', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (response.error) {
        throw response.error;
      }

      toast.success('Test data added successfully!');
      refetch();
    } catch (err) {
      console.error('Seeding error:', err);
      toast.error('Failed to add test data');
    } finally {
      setSeeding(false);
    }
  };

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex items-center gap-3 text-muted-foreground">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-sm">Loading...</span>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const formatLastActivity = (dateStr: string | null) => {
    if (!dateStr) return 'No activity yet';
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const getUserName = () => {
    return user.user_metadata?.full_name || user.email?.split('@')[0] || 'there';
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background effects matching landing */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 right-0 w-[400px] h-[400px] bg-primary/3 rounded-full blur-[120px]" />
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px),
                            linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }} />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2 group">
              <span className="text-xl font-serif tracking-tight">
                Lyto AI<span className="text-primary">.</span>
              </span>
            </Link>
            <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
              <span>/</span>
              <span>Dashboard</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleSeedTestData} 
              disabled={seeding}
              className="gap-2"
            >
              <Database className="h-4 w-4" />
              <span className="hidden sm:inline">{seeding ? 'Adding...' : 'Add Test Data'}</span>
            </Button>
            <div className="hidden sm:block text-sm text-muted-foreground">
              {user.email}
            </div>
            <Button variant="ghost" size="sm" onClick={handleSignOut} className="gap-2 text-muted-foreground hover:text-foreground">
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-12 relative z-10">
        {/* Welcome Section */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-border bg-card/50 backdrop-blur-sm mb-6">
            <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
              Your Analytics
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif leading-[1.1] mb-4">
            Welcome back,
            <br />
            <span className="text-gradient">{getUserName()}</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-md">
            Here's an overview of your Lyto AI usage and activity insights.
          </p>
        </div>

        {error && (
          <div className="mb-8 rounded-2xl border border-destructive/30 bg-destructive/5 p-5 text-destructive">
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Stats Bento Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {dataLoading ? (
            <>
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-36 rounded-2xl" />
              ))}
            </>
          ) : (
            <>
              <StatsCard
                title="Total Requests"
                value={stats.totalRequests.toLocaleString()}
                subtitle="All time"
                icon={<Activity className="h-5 w-5" />}
                number="01"
              />
              <StatsCard
                title="Total Tokens"
                value={stats.totalTokens.toLocaleString()}
                subtitle="API usage"
                icon={<Hash className="h-5 w-5" />}
                number="02"
              />
              <StatsCard
                title="This Week"
                value={stats.weekRequests.toLocaleString()}
                subtitle={`${stats.weekTokens.toLocaleString()} tokens`}
                icon={<Calendar className="h-5 w-5" />}
                number="03"
              />
              <StatsCard
                title="Last Activity"
                value={formatLastActivity(stats.lastActivity)}
                subtitle={stats.todayRequests > 0 ? `${stats.todayRequests} today` : 'No activity today'}
                icon={<Clock className="h-5 w-5" />}
                number="04"
              />
            </>
          )}
        </div>

        {/* Charts Section */}
        <div className="mb-8">
          <div className="flex items-end justify-between mb-6">
            <div>
              <span className="text-xs uppercase tracking-[0.25em] text-primary font-medium">
                Analytics
              </span>
              <h2 className="text-2xl md:text-3xl font-serif mt-2">
                Usage <span className="italic text-gradient">trends</span>
              </h2>
            </div>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-4">
            {dataLoading ? (
              <>
                <Skeleton className="h-[340px] rounded-2xl" />
                <Skeleton className="h-[340px] rounded-2xl" />
              </>
            ) : (
              <>
                <UsageChart
                  data={tokenUsage}
                  title="Requests Over Time"
                  dataKey="total_requests"
                  color="hsl(24, 95%, 50%)"
                />
                <UsageChart
                  data={tokenUsage}
                  title="Token Consumption"
                  dataKey="total_tokens"
                  color="hsl(220, 70%, 50%)"
                />
              </>
            )}
          </div>
        </div>

        {/* Prompt History */}
        <div>
          <div className="flex items-end justify-between mb-6">
            <div>
              <span className="text-xs uppercase tracking-[0.25em] text-primary font-medium">
                History
              </span>
              <h2 className="text-2xl md:text-3xl font-serif mt-2">
                Recent <span className="italic text-gradient">prompts</span>
              </h2>
            </div>
          </div>
          
          {dataLoading ? (
            <Skeleton className="h-[400px] rounded-2xl" />
          ) : (
            <PromptHistory prompts={prompts} />
          )}
        </div>

        {/* Back to Home */}
        <div className="mt-16 pt-8 border-t border-border/50">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group">
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back to home
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
