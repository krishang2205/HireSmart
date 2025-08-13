import React from 'react';
import { createPortal } from 'react-dom';
import { useToast } from '@/hooks/use-toast';
import { Toast } from './toast';

export const Toaster: React.FC = () => {
	const { toasts, dismiss } = useToast();
	return createPortal(
		<div className="fixed z-50 top-4 right-4 flex flex-col gap-3">
			{toasts.map(t => <Toast key={t.id} toast={t} onDismiss={dismiss} />)}
		</div>,
		document.body
	);
};
export default Toaster;
