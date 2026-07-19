import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export const Login = () => {
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Helper function to handle conditional redirection
  const handleUserRedirect = (email) => {
    if (email?.toLowerCase().endsWith('@slipways.com')) {
      navigate('/dashboard'); // Send admin users to the Admin Dashboard console
    } else {
      navigate('/'); // Send regular customers to the public homepage
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setIsSubmitting(true);
    try {
      const userCredential = await loginWithGoogle();
      toast.success('Signed in with Google successfully!');
      
      // Redirect based on the Google user's email
      handleUserRedirect(userCredential.user?.email);
    } catch (err) {
      if (err.code !== 'auth/popup-closed-by-user') {
        setError('Google authentication failed.');
        toast.error('Google sign-in failed.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const userCredential = await login(formData.email, formData.password);
      toast.success('Signed in successfully!');
      
      // Redirect based on the signed-in user's email
      handleUserRedirect(userCredential.user?.email);
    } catch (err) {
      let message = 'Invalid email or password.';
      if (err.code === 'auth/invalid-credential') message = 'Incorrect credentials supplied.';
      setError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center p-4 sm:p-6 lg:p-8">
      <Card className="w-full max-w-md shadow-lg border-muted">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold tracking-tight text-center">Welcome back</CardTitle>
          <CardDescription className="text-center">Enter your credentials to access your account</CardDescription>
        </CardHeader>
        
        <CardContent className="grid gap-4">
          {error && (
            <div role="alert" className="p-3 text-sm font-medium text-destructive bg-destructive/10 rounded-md border border-destructive/20">
              {error}
            </div>
          )}

          {/* Google Access Node */}
          <Button type="button" variant="outline" className="w-full gap-2" onClick={handleGoogleSignIn} disabled={isSubmitting}>
            <svg className="h-4 w-4" aria-hidden="true" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </Button>

          <div className="relative flex items-center justify-center my-1">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-muted" /></div>
            <span className="relative bg-card px-3 text-xs text-muted-foreground uppercase">Or login with email</span>
          </div>
        
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email address</Label>
              <Input id="email" name="email" type="email" placeholder="name@example.com" required value={formData.email} onChange={handleChange} disabled={isSubmitting} />
            </div>
            
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <a href="#forgot" className="text-xs text-primary hover:underline font-medium">Forgot password?</a>
              </div>
              <div className="relative">
                <Input id="password" name="password" type={showPassword ? 'text' : 'password'} required value={formData.password} onChange={handleChange} disabled={isSubmitting} className="pr-10" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full font-medium mt-2" disabled={isSubmitting}>
              {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing In...</> : 'Sign In'}
            </Button>
          </form>
        </CardContent>

        <CardFooter>
          <p className="text-sm text-center text-muted-foreground w-full">
            Don't have an account? <Link to="/register" className="font-medium text-primary hover:underline">Sign up</Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};