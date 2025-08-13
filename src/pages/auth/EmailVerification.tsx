import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useSearchParams } from 'react-router-dom';
import api from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

export default function EmailVerification() {
  const [search] = useSearchParams();
  const token = search.get('token');
  const [status, setStatus] = useState<'verifying'|'success'|'error'>('verifying');
  const { push } = useToast();

  useEffect(()=> {
    if(!token){ setStatus('error'); return; }
    api.get(`/auth/verify-email?token=${token}`)
      .then(()=>{ setStatus('success'); push({ title: 'Email verified', variant: 'success' }); })
      .catch(()=>{ setStatus('error'); push({ title: 'Verification failed', variant: 'destructive' }); });
  }, [token]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-muted px-4 py-10 text-center space-y-6">
      <div className="flex items-center gap-2">
        <img src="/favicon.svg" alt="logo" className="h-8 w-8" />
        <span className="font-semibold text-lg">HireSmart</span>
      </div>
      <div className="w-full max-w-md bg-card/80 backdrop-blur border rounded-xl shadow-sm p-8 space-y-4">
        {status==='verifying' && <><h1 className="text-xl font-semibold">Verifying your email...</h1><p className="text-sm text-muted-foreground">Please wait a moment.</p></>}
        {status==='success' && <><h1 className="text-xl font-semibold">Email Verified 🎉</h1><p className="text-sm text-muted-foreground">You can now log in to your dashboard.</p><Button asChild variant="gradient" className="w-full"><a href="/auth/login">Go to Login</a></Button></>}
        {status==='error' && <><h1 className="text-xl font-semibold">Verification Failed</h1><p className="text-sm text-muted-foreground">Token invalid or expired.</p><Button asChild variant="outline" className="w-full"><a href="/auth/login">Back to Login</a></Button></>}
      </div>
    </div>
  );
}
