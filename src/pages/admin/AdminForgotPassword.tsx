import { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import logo from '@/assets/logo.png';

const AdminForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setSubmitting(false);
    if (error) {
      setError(error.message);
      return;
    }
    setSent(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative z-10">
      <div className="w-full max-w-md mx-4">
        <div className="bg-card/80 backdrop-blur-sm border border-border rounded-2xl p-8 shadow-lg">
          <div className="text-center mb-8">
            <img src={logo} alt="Dreamcrest" className="w-16 h-16 mx-auto mb-4 rounded-xl" />
            <h1 className="font-display text-2xl font-bold text-foreground">Reset Password</h1>
            <p className="text-muted-foreground text-sm mt-1">
              Enter your admin email and we'll send you a reset link.
            </p>
          </div>

          {sent ? (
            <div className="bg-primary/10 border border-primary/30 rounded-lg p-4 flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div className="text-sm text-foreground">
                Check your inbox. We sent a password reset link to <b>{email}</b>. The link expires in 1 hour.
              </div>
            </div>
          ) : (
            <>
              {error && (
                <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-3 mb-6 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-destructive shrink-0" />
                  <p className="text-sm text-destructive">{error}</p>
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
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@dreamcrest.net"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full bg-primary text-primary-foreground" disabled={submitting}>
                  {submitting ? 'Sending…' : 'Send Reset Link'}
                </Button>
              </form>
            </>
          )}

          <Link
            to="/admin/login"
            className="mt-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminForgotPassword;
