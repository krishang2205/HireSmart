import React, { createContext, useContext, useEffect, useState } from 'react';
import { authApi } from '../lib/api';

interface User {
	id: string;
	fullName: string;
	email: string;
	role: string;
	companyName?: string;
	industry?: string;
	companySize?: string;
}

interface AuthContextValue {
	user: User | null;
	token: string | null;
	loading: boolean;
	login: (email: string, password: string) => Promise<void>;
	signup: (data: any) => Promise<void>;
	logout: () => void;
	updateProfile: (data: { name?: string; email?: string; companyName?: string; industry?: string; companySize?: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const updateProfile = async (data: { name?: string; email?: string; companyName?: string; industry?: string; companySize?: string }) => {
		if (!token) return;
		setLoading(true);
		try {
			const res = await authApi.updateProfile(token, data);
			if (res.user) setUser(res.user);
		} finally {
			setLoading(false);
		}
	};
	const [user, setUser] = useState<User | null>(null);
	const [token, setToken] = useState<string | null>(() => localStorage.getItem('hs_token'));
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (token && !user) {
			authApi.me(token).then(d => setUser(d.user)).catch(() => logout());
		}
	}, [token]);

	const login = async (email: string, password: string) => {
		setLoading(true);
		try {
			const d = await authApi.login({ email, password });
			setToken(d.token);
			localStorage.setItem('hs_token', d.token);
			setUser(d.user);
		} finally { setLoading(false); }
	};

	const signup = async (data: any) => {
		setLoading(true);
		try {
			const response = await authApi.signup(data);
			// Auto-login after successful signup
			if (response.token && response.user) {
				setToken(response.token);
				localStorage.setItem('hs_token', response.token);
				setUser(response.user);
			}
		} finally { setLoading(false); }
	};

	const logout = () => {
		setToken(null);
		setUser(null);
		localStorage.removeItem('hs_token');
	};

	return (
	<AuthContext.Provider value={{ user, token, loading, login, signup, logout, updateProfile }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	const ctx = useContext(AuthContext);
	if (!ctx) throw new Error('useAuth must be used within AuthProvider');
	return ctx;
};
