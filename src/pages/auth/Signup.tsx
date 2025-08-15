import React, { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import { FloatingLabelInput, PasswordField, FloatingLabelSelect } from '@/components/auth/FloatingLabelInput';
import { Button } from '@/components/ui/button';
import AuthLayout from '@/components/auth/AuthLayout';
import { useToast } from '@/hooks/use-toast';
import SocialLogin from '@/components/auth/SocialLogin';
// @ts-ignore - types not bundled
import zxcvbn from 'zxcvbn';

const roles = [
  { value: 'HR Manager', label: 'HR Manager' },
  { value: 'Recruiter', label: 'Recruiter' },
  { value: 'Hiring Team Member', label: 'Hiring Team Member' },
  { value: 'Admin', label: 'Admin' }
];

const companySizes = [
  { value: '1-10', label: '1-10' },
  { value: '11-50', label: '11-50' },
  { value: '51-200', label: '51-200' },
  { value: '201-500', label: '201-500' },
  { value: '500+', label: '500+' }
];

const industries = [
  { value: 'Technology', label: 'Technology' },
  { value: 'Finance', label: 'Finance' },
  { value: 'Healthcare', label: 'Healthcare' },
  { value: 'Education', label: 'Education' },
  { value: 'Retail', label: 'Retail' },
  { value: 'Manufacturing', label: 'Manufacturing' },
  { value: 'Other', label: 'Other' }
];

interface FormValues {
  companyName: string;
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  role: string;
  companySize: string;
  industry: string;
}

export default function Signup() {
  const { signup, loading } = useAuth();
  const { push } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const { 
    register, 
    handleSubmit, 
    watch, 
    trigger,
    setError,
    formState: { errors, isValid, isDirty, touchedFields } 
  } = useForm<FormValues>({
    mode: 'onTouched',
    defaultValues: {
      companyName: '',
      fullName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      role: '',
      companySize: '',
      industry: '',
    }
  });
  
  const watchedFields = watch();
  const password = watch('password');

  // Custom validation function
  const validateForm = async () => {
    const fields = [
      'companyName', 'fullName', 'email', 'password', 
      'confirmPassword', 'role', 'companySize', 'industry'
    ];
    
    const results = await Promise.all(
      fields.map(field => trigger(field as keyof FormValues))
    );
    
    return results.every(result => result);
  };

  const onSubmit = async (data: FormValues) => {
    setIsSubmitted(true);
    
    // Final validation before submission
    const isValid = await validateForm();
    if (!isValid) {
      push({ title: 'Please fix the errors', variant: 'destructive' });
      return;
    }

    // Trim core string fields before validation submit
    data.companyName = data.companyName?.trim();
    data.fullName = data.fullName?.trim();
    data.email = data.email?.trim();
    
    if (data.password !== data.confirmPassword) {
      push({ title: 'Passwords do not match', variant: 'destructive' });
      return;
    }
    
    try {
      const { confirmPassword, ...payload } = data; // backend doesn't need confirmPassword
      await signup(payload);
      
      // Success message will be shown by the auth context
      push({ 
        title: 'Account created successfully!', 
        description: 'Welcome to HireSmart. You have been automatically logged in.',
        variant: 'success' 
      });
      
      // Redirect to dashboard after successful signup
      window.location.href = '/dashboard';
    } catch (e: any) {
      const msg = e?.response?.data?.message || 'Signup failed';
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
    push({ title: 'Google signup', description: 'Google authentication coming soon!', variant: 'default' });
  };

  const handleAppleLogin = () => {
    push({ title: 'Apple signup', description: 'Apple authentication coming soon!', variant: 'default' });
  };

  const handleFacebookLogin = () => {
    push({ title: 'Facebook signup', description: 'Facebook authentication coming soon!', variant: 'default' });
  };

  const handleTwitterLogin = () => {
    push({ title: 'Twitter signup', description: 'Twitter authentication coming soon!', variant: 'default' });
  };

  const strengthObj = useMemo(() => password ? zxcvbn(password) : null, [password]);
  const strengthScore = strengthObj?.score ?? -1; // 0-4

  // Enhanced validation rules
  const companyNameValidation = {
    required: 'Company name is required',
    minLength: { value: 2, message: 'Company name must be at least 2 characters' },
    validate: (value: string) => {
      if (!value.trim()) return 'Company name is required';
      return true;
    }
  };

  const fullNameValidation = {
    required: 'Full name is required',
    minLength: { value: 2, message: 'Full name must be at least 2 characters' },
    validate: (value: string) => {
      if (!value.trim()) return 'Full name is required';
      return true;
    }
  };

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

  const phoneValidation = {
    pattern: {
      value: /^[\+]?[1-9][\d]{0,15}$/,
      message: 'Please enter a valid phone number'
    }
  };

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

  const selectValidation = {
    required: 'This field is required',
    validate: (value: string) => {
      if (!value || value === '') return 'This field is required';
      return true;
    }
  };

  // Check if form is ready to submit
  const isFormReady = isValid && isDirty && 
    watchedFields.companyName && 
    watchedFields.fullName && 
    watchedFields.email && 
    watchedFields.password && 
    watchedFields.confirmPassword && 
    watchedFields.role && 
    watchedFields.companySize && 
    watchedFields.industry;

  return (
    <AuthLayout title="Create your HireSmart account" subtitle="Hire smarter. Save time.">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div className="md:col-span-2">
            <FloatingLabelInput 
              dense 
              autoComplete="organization" 
              label="Company Name" 
                // placeholder removed
              className="text-slate-700 placeholder:text-slate-700"
              {...register('companyName', companyNameValidation)} 
              error={errors.companyName?.message} 
            />
          </div>
          
          <div>
            <FloatingLabelInput 
              dense 
              autoComplete="name" 
              label="Full Name" 
                // placeholder removed
              className="text-slate-700 placeholder:text-slate-700"
              {...register('fullName', fullNameValidation)} 
              error={errors.fullName?.message} 
            />
          </div>
          
          <div>
            <FloatingLabelInput 
              dense 
              autoComplete="email" 
              label="Email" 
              type="email"  
                className="text-slate-700 placeholder:text-slate-700"
              {...register('email', emailValidation)} 
              error={errors.email?.message} 
            />
          </div>
          
          <div>
            <FloatingLabelInput 
              dense 
              autoComplete="tel" 
              label="Phone" 
               // placeholder removed
              className="text-slate-700 placeholder:text-slate-700"
              {...register('phone', phoneValidation)} 
              error={errors.phone?.message} 
            />
          </div>
          
          <div>
            <PasswordField 
              dense 
              autoComplete="new-password" 
              label="Password" 
                // placeholder removed
              showStrength 
              strength={strengthScore} 
              className="text-slate-700 placeholder:text-slate-700"
              {...register('password', passwordValidation)} 
              error={errors.password?.message} 
            />
          </div>
          
          <div>
            <PasswordField 
              dense 
              autoComplete="new-password" 
              label="Confirm Password" 
                // placeholder removed
              className="text-slate-700 placeholder:text-slate-700"
              {...register('confirmPassword', confirmPasswordValidation)} 
              error={errors.confirmPassword?.message} 
            />
          </div>
          
          <div>
            <FloatingLabelSelect
              dense
              label=""
                placeholder="Select role"
              options={roles}
              className="w-full h-10 leading-tight py-2 text-slate-700 placeholder:text-slate-700"
              {...register('role', selectValidation)}
              error={errors.role?.message}
            />
          </div>
          
          <div>
            <FloatingLabelSelect
              dense
              label=""
                placeholder="Select company size"
              options={companySizes}
              className="w-full h-10 leading-tight py-2 text-slate-700 placeholder:text-slate-700"
              {...register('companySize', selectValidation)}
              error={errors.companySize?.message}
            />
          </div>
          
          <div className="md:col-span-2">
            <FloatingLabelSelect
              dense
              label=""
                placeholder="Select industry"
              options={industries}
              className="w-full h-10 leading-tight py-2 text-slate-700 placeholder:text-slate-700"
              {...register('industry', selectValidation)}
              error={errors.industry?.message}
            />
          </div>
        </div>
        
        <Button 
          disabled={!isFormReady || loading} 
          className="w-full h-8 text-xs font-medium shadow-md shadow-blue-500/15" 
          variant="gradient"
        >
          {loading ? 'Creating Account...' : 'Create Account'}
        </Button>

        {/* Social Login */}
        <SocialLogin
          onGoogleClick={handleGoogleLogin}
          onAppleClick={handleAppleLogin}
          onFacebookClick={handleFacebookLogin}
          onTwitterClick={handleTwitterLogin}
        />
        
        <p className="text-[10px] text-center text-slate-500 leading-snug">
          By creating an account you agree to our{' '}
          <a href="/terms" className="underline decoration-dotted underline-offset-2">Terms</a> &{' '}
          <a href="/privacy" className="underline decoration-dotted underline-offset-2">Privacy Policy</a>.
        </p>
      </form>
      
      <p className="text-center text-sm text-slate-600 dark:text-slate-400 mt-4">
        Already have an account?{' '}
        <a href="/auth/login" className="text-blue-600 hover:text-blue-500 font-medium underline-offset-4 underline decoration-blue-400/50">
          Log in
        </a>
      </p>
    </AuthLayout>
  );
}