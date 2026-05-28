import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Loader2, LogIn, UserPlus, Mail, Lock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEOHead from '@/components/SEOHead';

const Auth = () => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = (location.state as any)?.from || '/my-orders';

  useEffect(() => {
    if (user) navigate(redirectTo, { replace: true });
  }, [user, navigate, redirectTo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/my-orders` },
        });
        if (error) throw error;
        toast({ title: 'Account created!', description: 'You are now signed in.' });
        navigate(redirectTo, { replace: true });
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast({ title: 'Welcome back!' });
        navigate(redirectTo, { replace: true });
      }
    } catch (err: any) {
      toast({ title: 'Authentication failed', description: err.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead title={mode === 'login' ? 'Login | Dreamcrest' : 'Sign Up | Dreamcrest'} description="Login to view your order history and manage your account." />
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4 pt-32 pb-16">
        <div className="w-full max-w-md bg-card/70 backdrop-blur-xl border border-primary/30 rounded-2xl p-8 shadow-[0_0_48px_hsl(var(--primary)/0.15)]">
          <div className="text-center mb-6">
            <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-primary/15 border-2 border-primary/40 flex items-center justify-center shadow-[0_0_24px_hsl(var(--primary)/0.35)]">
              {mode === 'login' ? <LogIn className="w-7 h-7 text-primary" /> : <UserPlus className="w-7 h-7 text-primary" />}
            </div>
            <h1 className="font-display font-bold text-2xl text-foreground tracking-wide">
              {mode === 'login' ? 'Enter the Keep' : 'Join the Court'}
            </h1>
            <div className="flex items-center justify-center gap-2 my-2">
              <span className="h-px w-10 bg-primary/40" />
              <span className="text-primary text-xs">❖</span>
              <span className="h-px w-10 bg-primary/40" />
            </div>
            <p className="text-sm text-muted-foreground">
              {mode === 'login' ? 'Sign in to view your royal ledger' : 'Forge your seal to track your orders'}
            </p>
          </div>


          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="email" placeholder="Email" required disabled={loading}
                value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-secondary/40 border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary"
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="password" placeholder="Password (min 6 chars)" required minLength={6} disabled={loading}
                value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-secondary/40 border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary"
              />
            </div>
            <button
              type="submit" disabled={loading}
              className="w-full bg-primary text-primary-foreground rounded-xl py-3 font-semibold text-sm hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (mode === 'login' ? 'Login' : 'Sign Up')}
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-5">
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button
              onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
              className="text-primary font-medium hover:underline"
            >
              {mode === 'login' ? 'Sign up' : 'Login'}
            </button>
          </p>
          <p className="text-center text-xs text-muted-foreground mt-4">
            <Link to="/" className="hover:text-primary">← Back to home</Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Auth;
