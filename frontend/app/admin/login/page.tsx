"use client";
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { apiCall } from '@/utils/api';
import Link from 'next/link';
import './AdminLogin.css';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});
    const [isLoading, setIsLoading] = useState(false);
    
    const { login } = useAuth();
    const router = useRouter();

    const validateField = (name: string, value: string) => {
        let errors = { ...fieldErrors };
        if (name === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!value) errors.email = 'Imperial email is required';
            else if (!emailRegex.test(value)) errors.email = 'Invalid email structure';
            else delete errors.email;
        }
        if (name === 'password') {
            if (!value) errors.password = 'Secret key is required';
            else if (value.length < 6) errors.password = 'Key must be at least 6 characters';
            else delete errors.password;
        }
        setFieldErrors(errors);
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setEmail(value);
        validateField('email', value);
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setPassword(value);
        validateField('password', value);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Final check
        if (Object.keys(fieldErrors).length > 0 || !email || !password) {
            setError('Please correct your credentials.');
            return;
        }

        setError('');
        setIsLoading(true);

        try {
            const data = await apiCall('/auth/login', 'POST', { email, password });
            
            if (!data.isAdmin) {
                setError('Master access denied. Admin credentials required.');
                return;
            }

            login(data, '/admin');
        } catch (err: any) {
            setError(err.message || 'Authentication failed');
        } finally {
            setIsLoading(false);
        }
    };

    const isFormValid = email && password && Object.keys(fieldErrors).length === 0;

    return (
        <div className="admin-login-wrapper">
            <div className="admin-login-container">
                <div className="login-heritage-card glass-card">
                    <div className="heritage-logo">
                        <h1>FĀRSHÉ</h1>
                        <span>Master Access</span>
                    </div>
                    
                    <form onSubmit={handleSubmit} className="admin-login-form" noValidate>
                        <div className="form-group">
                            <label>Imperial Email</label>
                            <input 
                                type="email" 
                                value={email}
                                onChange={handleEmailChange}
                                placeholder="Enter admin email address"
                                className={fieldErrors.email ? 'invalid' : ''}
                                required 
                            />
                            <div className={`live-error ${fieldErrors.email ? 'visible' : ''}`}>
                                {fieldErrors.email}
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Secret Key</label>
                            <input 
                                type="password" 
                                value={password}
                                onChange={handlePasswordChange}
                                placeholder="Enter admin password"
                                className={fieldErrors.password ? 'invalid' : ''}
                                required 
                            />
                            <div className={`live-error ${fieldErrors.password ? 'visible' : ''}`}>
                                {fieldErrors.password}
                            </div>
                        </div>
                        
                        {error && <p className="admin-error-msg">{error}</p>}
                        
                        <button 
                            type="submit" 
                            className="btn-master" 
                            disabled={isLoading || !isFormValid}
                        >
                            {isLoading ? 'Authenticating...' : 'Enter Master Control'}
                        </button>
                    </form>
                    
                    <div className="login-footer">
                        <Link href="/" className="back-link">Return to Storefront</Link>
                    </div>
                </div>
            </div>
            <div className="heritage-overlay"></div>
        </div>
    );
};

export default AdminLogin;
