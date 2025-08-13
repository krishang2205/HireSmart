// Toast context implemented without JSX to avoid duplicate parse issues.
import React, { createContext, useCallback, useContext, useState } from 'react';

export interface Toast { id: string; title?: string; description?: string; variant?: 'default'|'destructive'|'success'; duration?: number }
interface ToastContextValue { toasts: Toast[]; push:(t:Omit<Toast,'id'>)=>void; dismiss:(id:string)=>void }

const ToastContext = createContext<ToastContextValue | null>(null);

export const ToastProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
	const [toasts, setToasts] = useState<Toast[]>([]);
	const dismiss = useCallback((id:string)=> setToasts(t=>t.filter(x=>x.id!==id)), []);
	const push = useCallback((t:Omit<Toast,'id'>)=>{
		const id = Math.random().toString(36).slice(2);
		const toast: Toast = { duration:4000, ...t, id };
		setToasts(prev=>[...prev, toast]);
		if(toast.duration) setTimeout(()=>dismiss(id), toast.duration);
	}, [dismiss]);
	return React.createElement(ToastContext.Provider, { value: { toasts, push, dismiss } }, children);
};

export function useToast(){
	const ctx = useContext(ToastContext);
	if(!ctx) throw new Error('useToast must be used within ToastProvider');
	return ctx;
}
