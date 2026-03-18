"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import "./login.css";
import { useMutation } from "@tanstack/react-query";
import { apiCall } from "@/utils/api";
import { useAuth } from "@/context/AuthContext";

const LoginForm = () => {
    const { login } = useAuth();
    const searchParams = useSearchParams();
    const redirectUrl = searchParams.get("redirect");

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

    const TEMP_EMAIL_DOMAINS = [
        "tempmail.com", "10minutemail.com", "guerrillamail.com", "mailinator.com",
        "yopmail.com", "throwawaymail.com", "temp-mail.org", "fakeinbox.com",
        "internxt.com", "tempmail.net", "sharklasers.com", "dispostable.com"
    ];

    const validateField = (name: string, value: string) => {
        let error = "";
        if (name === "email") {
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                error = "Please enter a valid email address";
            } else {
                const domain = value.split("@")[1].toLowerCase();
                if (TEMP_EMAIL_DOMAINS.includes(domain)) {
                    error = "Temporary/Disposable emails are not allowed";
                }
            }
        } else if (name === "password" && !value) {
            error = "Password is required";
        }
        return error;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setFieldErrors({ ...fieldErrors, [name]: validateField(name, value) });
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFieldErrors({ ...fieldErrors, [name]: validateField(name, value) });
    };

    const loginMutation = useMutation({
        mutationFn: (loginData: any) => apiCall("/auth/login", "POST", loginData),
        onSuccess: (data) => {
            login(data, redirectUrl || undefined);
        }
    });

    const error = loginMutation.error ? (loginMutation.error as Error).message : "";
    const loading = loginMutation.isPending;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        loginMutation.reset();

        const emailError = validateField("email", formData.email);
        const passwordError = validateField("password", formData.password);

        setFieldErrors({
            email: emailError,
            password: passwordError
        });

        if (emailError || passwordError) return;

        loginMutation.mutate(formData);
    };

    return (
        <main className="auth-main">
            <div className="auth-card fade-in">
                <Link href="/" className="btn-home-back">
                    ← Back to Home
                </Link>
                <div className="auth-header">
                    <h1>Log In</h1>
                </div>

                {error && <div style={{ color: 'var(--persian-red)', marginBottom: '20px', fontWeight: 700 }}>{error}</div>}

                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="Enter your email address"
                            value={formData.email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            required
                        />
                        {fieldErrors.email && <span className="field-error">{fieldErrors.email}</span>}
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            name="password"
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            required
                        />
                        {fieldErrors.password && <span className="field-error">{fieldErrors.password}</span>}
                    </div>

                    <div style={{ textAlign: 'right', marginTop: '-10px', marginBottom: '10px' }}>
                        <Link href="/forgot-password" style={{ fontSize: '0.9rem', color: '#999', textDecoration: 'none' }}>
                            Forgot Password?
                        </Link>
                    </div>

                    <button type="submit" className="btn-auth" disabled={loading}>
                        {loading ? "Logging In..." : "Continue Journey"}
                    </button>
                </form>

                <div className="divider-ornate">
                    <span></span>
                    <i>✨</i>
                    <span></span>
                </div>

                <div className="auth-footer">
                    New to Farshe?
                    <Link href={`/signup${redirectUrl ? `?redirect=${redirectUrl}` : ''}`}>Create Account</Link>
                </div>
            </div>
        </main>
    );
};

const LoginPage = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <LoginForm />
        </Suspense>
    );
};

export default LoginPage;
