"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import { apiCall } from "@/utils/api";
import "../login/login.css"; // Reuse auth styles

const ForgotPasswordPage = () => {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState("");
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");

    const fetchQuestionMutation = useMutation({
        mutationFn: (email: string) => apiCall("/auth/forgot-password/question", "POST", { email }),
        onSuccess: (data) => {
            setQuestion(data.question);
            setStep(2);
        }
    });

    const resetPasswordMutation = useMutation({
        mutationFn: (resetData: any) => apiCall("/auth/forgot-password/reset", "POST", resetData),
        onSuccess: () => {
            setMessage("Password reset successful! You can now log in.");
            setStep(3);
        }
    });

    const loading = fetchQuestionMutation.isPending || resetPasswordMutation.isPending;
    const error = (fetchQuestionMutation.error as Error)?.message || (resetPasswordMutation.error as Error)?.message || "";

    const handleFetchQuestion = (e: React.FormEvent) => {
        e.preventDefault();
        fetchQuestionMutation.mutate(email);
    };

    const handleResetPassword = (e: React.FormEvent) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            // We can't easily set the mutation error directly, so we'll just handle this locally or via a custom error
            return;
        }

        resetPasswordMutation.mutate({
            email,
            securityAnswer: answer,
            newPassword
        });
    };

    return (
        <main className="auth-main">
            <div className="auth-card fade-in">
                <Link href="/" className="btn-home-back">
                    ← Back to Home
                </Link>
                <div className="auth-header">
                    <h1>Reset Password</h1>
                </div>

                {newPassword !== confirmPassword && confirmPassword !== "" && <div style={{ color: 'var(--persian-red)', marginBottom: '20px', fontWeight: 700, textAlign: 'center' }}>Passwords do not match</div>}

                {error && <div style={{ color: 'var(--persian-red)', marginBottom: '20px', fontWeight: 700, textAlign: 'center' }}>{error}</div>}
                {message && <div style={{ color: 'green', marginBottom: '20px', fontWeight: 700, textAlign: 'center' }}>{message}</div>}

                {step === 1 && (
                    <form className="auth-form" onSubmit={handleFetchQuestion}>
                        <div className="form-group">
                            <label>Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email address"
                                required
                            />
                        </div>
                        <button type="submit" className="btn-auth" disabled={loading}>
                            {loading ? "Finding Account..." : "Next Step"}
                        </button>
                    </form>
                )}

                {step === 2 && (
                    <form className="auth-form" onSubmit={handleResetPassword}>
                        {question ? (
                            <>
                                <div className="form-group">
                                    <label>Security Question</label>
                                    <p style={{ margin: '10px 0', fontSize: '1.1rem', color: 'var(--deep-charcoal)', fontWeight: 600 }}>{question}</p>
                                </div>

                                <div className="form-group">
                                    <label>Your Answer</label>
                                    <input
                                        type="text"
                                        value={answer}
                                        onChange={(e) => setAnswer(e.target.value)}
                                        placeholder="Enter your secret answer"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>New Password</label>
                                    <input
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder="Enter new password"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Confirm Password</label>
                                    <input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Enter confirm new password"
                                        required
                                    />
                                </div>

                                <button type="submit" className="btn-auth" disabled={loading}>
                                    {loading ? "Resetting..." : "Reset Password"}
                                </button>
                            </>
                        ) : (
                            <div style={{ textAlign: 'center' }}>
                                <p style={{ marginBottom: '20px', color: '#666' }}>No security question found for this account. Please contact support to reset your password.</p>
                                <button type="button" onClick={() => setStep(1)} className="btn-auth">Go Back</button>
                            </div>
                        )}
                    </form>
                )}

                {step === 3 && (
                    <Link href="/login" className="btn-auth" style={{ textDecoration: 'none', display: 'block', textAlign: 'center' }}>
                        Go to Log In
                    </Link>
                )}

                <div className="divider-ornate">
                    <span></span>
                    <i>✨</i>
                    <span></span>
                </div>

                <div className="auth-footer">
                    Suddenly remembered?
                    <Link href="/login">Log In</Link>
                </div>
            </div>
        </main>
    );
};

export default ForgotPasswordPage;
