import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock, Mail, AlertCircle } from 'lucide-react';
import logo from '@/assets/logo.png';

const AdminLogin = () => {
  const { user, isAdmin, loading, signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (user && isAdmin) return <Navigate to="/admin" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    
    const { error } = await signIn(email, password);
    if (error) {
      setError(error.message);
      setSubmitting(false);
      return;
    }
    
    // Check will happen via auth state change, but we need to verify admin
    setTimeout(() => setSubmitting(false), 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative z-10">
      <div className="w-full max-w-md mx-4">
        <div className="bg-card/80 backdrop-blur-sm border border-border rounded-2xl p-8 shadow-lg">
          <div className="text-center mb-8">
            <img src={logo} alt="Castle Tools" className="w-16 h-16 mx-auto mb-4 rounded-xl" />
            <h1 className="font-display text-2xl font-bold text-foreground">Admin Panel</h1>
            <p className="text-muted-foreground text-sm mt-1">Sign in to manage your store</p>
          </div>

          {error && (
            <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-3 mb-6 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-destructive shrink-0" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          {user && !isAdmin && (
            <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-3 mb-6 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-destructive shrink-0" />
              <p className="text-sm text-destructive">You don't have admin access. Contact the site administrator.</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-foreground">Email</Label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="admin@Castletool99.net"
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password" className="text-foreground">Password</Label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full bg-primary text-primary-foreground" disabled={submitting}>
              {submitting ? 'Signing in...' : 'Sign In'}
            </Button>

            <div className="text-center pt-2">
              <Link to="/admin/forgot-password" className="text-sm text-muted-foreground hover:text-primary">
                Forgot password?
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
