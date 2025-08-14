import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { authApi } from '../../lib/api';
import { FloatingLabelInput } from '@/components/auth/FloatingLabelInput';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface FormValues {
  email: string;
}

export default function ForgotPassword() {
  const { push } = useToast();
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isValid, isDirty },
    trigger,
    watch
  } = useForm<FormValues>({ 
    mode: 'onTouched',
    defaultValues: {
      email: ''
    }
  });

  const watchedFields = watch();

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

  // Custom validation function
  const validateForm = async () => {
    const emailValid = await trigger('email');
    return emailValid;
  };

  const onSubmit = async (data: FormValues) => {
    // Final validation before submission
    const isValid = await validateForm();
    if (!isValid) {
      push({ title: 'Please fix the errors', variant: 'destructive' });
      return;
    }

    setLoading(true);
    try {
      await authApi.requestPasswordReset(data.email.trim());
      setSent(true);
      push({ title: 'Reset link sent', description: 'Check your email for password reset instructions.', variant: 'success' });
    } catch (e: any) {
      const msg = e?.response?.data?.message || 'Failed to send reset link';
      push({ 
        title: msg, 
        description: e?.response?.data?.errors?.[0]?.message,
        variant: 'destructive' 
      });
    } finally {
      setLoading(false);
    }
  };

  // Check if form is ready to submit
  const isFormReady = isValid && isDirty && watchedFields.email;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-10">
      <div className="w-full max-w-md bg-card border rounded-2xl shadow-sm p-8 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-xl font-semibold">Reset your password</h1>
          <p className="text-sm text-slate-600">Enter your email to receive a password reset link</p>
        </div>
        
        {sent ? (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-900">Check your email</p>
              <p className="text-sm text-slate-600 mt-1">We've sent a password reset link to your email address.</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <FloatingLabelInput
              label="Email"
              type="email"
              autoComplete="email"
              placeholder="Enter your email address"
              {...register('email', emailValidation)}
              error={errors.email?.message}
            />
            
            <Button 
              disabled={!isFormReady || loading} 
              className="w-full h-11 font-medium shadow-lg shadow-blue-500/25" 
              variant="gradient"
            >
              {loading ? 'Sending...' : 'Send reset link'}
            </Button>
          </form>
        )}
        
        <p className="text-center text-sm">
          <a href="/auth/login" className="text-blue-600 hover:text-blue-500 font-medium underline-offset-4 underline decoration-blue-400/50">
            Back to login
          </a>
        </p>
      </div>
    </div>
  );
}
