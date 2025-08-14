import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { authApi } from '../../lib/api';
import { PasswordField } from '@/components/auth/FloatingLabelInput';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface FormValues {
  password: string;
  confirmPassword: string;
}

export default function ResetPassword() {
  const { push } = useToast();
  const params = new URLSearchParams(window.location.search);
  const token = params.get('token') || '';
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { 
    register, 
    handleSubmit, 
    watch, 
    formState: { errors, isValid, isDirty },
    trigger
  } = useForm<FormValues>({ 
    mode: 'onTouched',
    defaultValues: {
      password: '',
      confirmPassword: ''
    }
  });
  
  const password = watch('password');
  const watchedFields = watch();

  // Enhanced password validation
  const passwordValidation = {
    required: 'Password is required',
    minLength: { value: 8, message: 'Password must be at least 8 characters' },
    validate: (value: string) => {
      if (!value.trim()) return 'Password is required';
      if (value.length < 8) return 'Password must be at least 8 characters';
      return true;
    }
  };

  const confirmPasswordValidation = {
    required: 'Please confirm your password',
    validate: (value: string) => {
      if (!value) return 'Please confirm your password';
      if (value !== password) return 'Passwords must match';
      return true;
    }
  };

  // Custom validation function
  const validateForm = async () => {
    const passwordValid = await trigger('password');
    const confirmPasswordValid = await trigger('confirmPassword');
    return passwordValid && confirmPasswordValid;
  };

  const onSubmit = async (data: FormValues) => {
    // Final validation before submission
    const isValid = await validateForm();
    if (!isValid) {
      push({ title: 'Please fix the errors', variant: 'destructive' });
      return;
    }

    if (data.password !== data.confirmPassword) {
      push({ title: 'Passwords do not match', variant: 'destructive' });
      return;
    }

    setLoading(true);
    try {
      await authApi.resetPassword({ token, password: data.password });
      setDone(true);
      push({ title: 'Password updated successfully', variant: 'success' });
    } catch (e: any) {
      const msg = e?.response?.data?.message || 'Failed to update password';
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
  const isFormReady = isValid && isDirty && watchedFields.password && watchedFields.confirmPassword;

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4 py-10">
        <div className="w-full max-w-md bg-card border rounded-2xl shadow-sm p-8 space-y-6">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-semibold text-red-600">Invalid Reset Link</h1>
              <p className="text-sm text-slate-600 mt-1">This password reset link is invalid or has expired.</p>
            </div>
            <Button asChild className="w-full">
              <a href="/auth/forgot-password">Request New Reset Link</a>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-10">
      <div className="w-full max-w-md bg-card border rounded-2xl shadow-sm p-8 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-xl font-semibold">Set a new password</h1>
          <p className="text-sm text-slate-600">Create a strong password for your account</p>
        </div>
        
        {done ? (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-900">Password Updated</p>
              <p className="text-sm text-slate-600 mt-1">Your password has been successfully updated.</p>
            </div>
            <Button asChild className="w-full">
              <a href="/auth/login">Log in</a>
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <PasswordField
              label="New Password"
              autoComplete="new-password"
              placeholder="Enter your new password"
              {...register('password', passwordValidation)}
              error={errors.password?.message}
            />
            
            <PasswordField
              label="Confirm Password"
              autoComplete="new-password"
              placeholder="Confirm your new password"
              {...register('confirmPassword', confirmPasswordValidation)}
              error={errors.confirmPassword?.message}
            />
            
            <Button 
              disabled={!isFormReady || loading} 
              className="w-full h-11 font-medium shadow-lg shadow-blue-500/25" 
              variant="gradient"
            >
              {loading ? 'Updating...' : 'Update password'}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
