import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Camera } from 'lucide-react';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/admin');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = isSignUp 
      ? await signUp(email, password)
      : await signIn(email, password);

    if (error) {
      toast.error(error.message || (isSignUp ? 'Sign up failed' : 'Login failed'));
    } else {
      if (isSignUp) {
        toast.success('Account created! Please check your email to confirm.');
      } else {
        toast.success('Welcome back!');
        navigate('/admin');
      }
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="afri-glass p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <Camera className="w-12 h-12 mx-auto mb-4 text-accent" />
          <h1 className="font-display text-3xl mb-2">{isSignUp ? 'Admin Sign Up' : 'Admin Login'}</h1>
          <p className="text-muted-foreground">Afriframe Pictures</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@afriframe.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={loading}
          >
            {loading ? (isSignUp ? 'Creating account...' : 'Signing in...') : (isSignUp ? 'Sign Up' : 'Sign In')}
          </Button>
        </form>

        <div className="text-center text-sm text-muted-foreground mt-6 space-y-2">
          <button 
            onClick={() => setIsSignUp(!isSignUp)}
            className="hover:text-accent transition-colors"
          >
            {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
          </button>
          <p>
            <a href="/" className="hover:text-accent transition-colors">
              ← Back to website
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
