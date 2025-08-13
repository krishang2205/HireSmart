import React from 'react';
import { Toast as ToastType } from '@/hooks/use-toast';

export const Toast: React.FC<{ toast: ToastType; onDismiss: (id: string)=>void }> = ({ toast, onDismiss }) => {
	const color = toast.variant === 'destructive' ? 'border-red-500' : toast.variant === 'success' ? 'border-green-500' : 'border-blue-500';
	return (
		<div className={`w-full max-w-sm bg-card/90 backdrop-blur border ${color} rounded-md shadow px-4 py-3 space-y-1 animate-in fade-in slide-in-from-right-2`}> 
			<div className="flex items-start justify-between gap-4">
				<div className="flex-1">
					{toast.title && <p className="font-medium text-sm">{toast.title}</p>}
					{toast.description && <p className="text-xs text-muted-foreground leading-relaxed">{toast.description}</p>}
				</div>
				<button onClick={()=>onDismiss(toast.id)} className="text-xs text-muted-foreground hover:text-foreground">✕</button>
			</div>
		</div>
	);
};
export default Toast;
