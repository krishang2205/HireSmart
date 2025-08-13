import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import { FloatingLabelInput, PasswordField } from '@/components/auth/FloatingLabelInput';
import { Button } from '@/components/ui/button';
import AuthLayout from '@/components/auth/AuthLayout';
import { useToast } from '@/hooks/use-toast';
import SocialLogin from '@/components/auth/SocialLogin';

interface FormValues { 
  email: string; 
  password: string; 
  remember: boolean; 
}

export default function Login() {
  const { login, loading } = useAuth();
  const { push } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isValid, isDirty, touchedFields },
    trigger,
    setError,
    watch
  } = useForm<FormValues>({ 
    mode: 'onTouched',
    defaultValues: {
      email: '',
      password: '',
      remember: false
    }
  });

  const watchedFields = watch();

  // Custom validation function
  const validateForm = async () => {
    const emailValid = await trigger('email');
    const passwordValid = await trigger('password');
    return emailValid && passwordValid;
  };

  const onSubmit = async (data: FormValues) => {
    setIsSubmitted(true);
    
    // Final validation before submission
    const isValid = await validateForm();
    if (!isValid) {
      push({ title: 'Please fix the errors', variant: 'destructive' });
      return;
    }

    try {
      await login(data.email.trim(), data.password);
      push({ title: 'Login successful!', description: 'Welcome back to HireSmart.', variant: 'success' });
      window.location.href = '/dashboard';
    } catch (e: any) {
      const msg = e?.response?.data?.message || 'Login failed';
      const errors = e?.response?.data?.errors || [];
      
      // Set field-specific errors if provided by the server
      if (errors && Array.isArray(errors)) {
        errors.forEach((error: any) => {
          if (error.field && error.message) {
            setError(error.field as keyof FormValues, {
              type: 'server',
              message: error.message
            });
          }
        });
      }
      
      push({ 
        title: msg, 
        description: errors.length > 0 ? errors[0].message : undefined,
        variant: 'destructive' 
      });
    }
  };

  // Social login handlers
  const handleGoogleLogin = () => {
    push({ title: 'Google login', description: 'Google authentication coming soon!', variant: 'default' });
  };

  const handleAppleLogin = () => {
    push({ title: 'Apple login', description: 'Apple authentication coming soon!', variant: 'default' });
  };

  const handleFacebookLogin = () => {
    push({ title: 'Facebook login', description: 'Facebook authentication coming soon!', variant: 'default' });
  };

  const handleTwitterLogin = () => {
    push({ title: 'Twitter login', description: 'Twitter authentication coming soon!', variant: 'default' });
  };

  // Enhanced email validation
  const emailValidation = {
    required: 'Email is required',
    pattern: {
      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      message: 'Please enter a valid email address'
    },
    validate: (value: string) => {
      if (!value.trim()) return 'Email is required';
      return true;
    }
  };

  // Enhanced password validation
  const passwordValidation = {
    required: 'Password is required',
    minLength: {
      value: 1,
      message: 'Password is required'
    },
    validate: (value: string) => {
      if (!value.trim()) return 'Password is required';
      return true;
    }
  };

  // Check if form is ready to submit
  const isFormReady = isValid && isDirty && watchedFields.email && watchedFields.password;

  return (
    <AuthLayout title="Welcome back" subtitle="Hire smarter. Save time.">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <FloatingLabelInput 
          label="Email" 
          type="email" 
          autoComplete="email"
          placeholder="Enter your email"
          {...register('email', emailValidation)} 
          error={errors.email?.message} 
        />
        
        <PasswordField 
          label="Password" 
          autoComplete="current-password"
          placeholder="Enter your password"
          {...register('password', passwordValidation)} 
          error={errors.password?.message} 
        />
        
        <div className="flex items-center justify-between text-[11px] text-slate-600">
          <label className="flex items-center gap-2 select-none">
            <input 
              type="checkbox" 
              className="accent-blue-600" 
              {...register('remember')} 
            /> 
            Remember me
          </label>
          <a href="/auth/forgot-password" className="font-medium text-blue-600 hover:text-blue-500">
            Forgot Password?
          </a>
        </div>
        
        <Button 
          disabled={!isFormReady || loading} 
          className="w-full h-11 font-medium shadow-lg shadow-blue-500/25" 
          variant="gradient"
        >
          {loading ? 'Logging in...' : 'Log In'}
        </Button>

        {/* Social Login */}
        <SocialLogin
          onGoogleClick={handleGoogleLogin}
          onAppleClick={handleAppleLogin}
          onFacebookClick={handleFacebookLogin}
          onTwitterClick={handleTwitterLogin}
        />
        
        <p className="text-[11px] text-center text-slate-500 leading-relaxed">
          By continuing you agree to our{' '}
          <a href="/terms" className="underline decoration-dotted underline-offset-2">Terms</a> &{' '}
          <a href="/privacy" className="underline decoration-dotted underline-offset-2">Privacy Policy</a>.
        </p>
      </form>
      
      <p className="text-center text-sm text-slate-600 dark:text-slate-400 mt-6">
        Need an account?{' '}
        <a href="/auth/signup" className="text-blue-600 hover:text-blue-500 font-medium underline-offset-4 underline decoration-blue-400/50">
          Sign up
        </a>
      </p>
    </AuthLayout>
  );
}