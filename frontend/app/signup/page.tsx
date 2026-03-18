"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import "./signup.css";
import { useMutation } from "@tanstack/react-query";
import { apiCall } from "@/utils/api";
import { useAuth } from "@/context/AuthContext";

const SignupForm = () => {
    const { login } = useAuth();
    const searchParams = useSearchParams();
    const redirectUrl = searchParams.get("redirect");

    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        securityQuestion: "",
        securityAnswer: ""
    });
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});


    const TEMP_EMAIL_DOMAINS = [
        "tempmail.com", "10minutemail.com", "guerrillamail.com", "mailinator.com",
        "yopmail.com", "throwawaymail.com", "temp-mail.org", "fakeinbox.com",
        "internxt.com", "tempmail.net", "sharklasers.com", "dispostable.com"
    ];

    const validateField = (name: string, value: string) => {
        let error = "";
        if (name === "name" && !value.trim()) {
            error = "Full Name is required";
        } else if (name === "email") {
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                error = "Please enter a valid email address";
            } else {
                const domain = value.split("@")[1].toLowerCase();
                if (TEMP_EMAIL_DOMAINS.includes(domain)) {
                    error = "Temporary/Disposable emails are not allowed";
                }
            }
        } else if (name === "password") {
            if (value.length < 8) error = "Password must be at least 8 characters long";
            else if (!/\d/.test(value)) error = "Password must contain at least one number";
        } else if (name === "confirmPassword" && value !== formData.password) {
            error = "Passwords do not match";
        } else if (name === "securityQuestion" && !value.trim()) {
            error = "Security question is required";
        } else if (name === "securityAnswer" && !value.trim()) {
            error = "Security answer is required";
        }
        return error;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setFieldErrors({ ...fieldErrors, [name]: validateField(name, value) });
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFieldErrors({ ...fieldErrors, [name]: validateField(name, value) });
    };

    const handleNext = (e: React.FormEvent) => {
        e.preventDefault();
        signupMutation.reset();

        const nameError = validateField("name", formData.name);
        const emailError = validateField("email", formData.email);
        const passwordError = validateField("password", formData.password);
        const confirmPasswordError = validateField("confirmPassword", formData.confirmPassword);

        const newFieldErrors = {
            ...fieldErrors,
            name: nameError,
            email: emailError,
            password: passwordError,
            confirmPassword: confirmPasswordError
        };

        setFieldErrors(newFieldErrors);

        if (nameError || emailError || passwordError || confirmPasswordError) {
            return;
        }

        setStep(2);
        window.scrollTo(0, 0);
    };

    const handleBack = () => {
        setStep(1);
        window.scrollTo(0, 0);
    };

    const signupMutation = useMutation({
        mutationFn: (signupData: any) => apiCall("/auth/signup", "POST", signupData),
        onSuccess: (data) => {
            login(data, redirectUrl || undefined);
        }
    });

    const error = signupMutation.error ? (signupMutation.error as Error).message : "";
    const loading = signupMutation.isPending;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const securityQuestionError = validateField("securityQuestion", formData.securityQuestion);
        const securityAnswerError = validateField("securityAnswer", formData.securityAnswer);

        const newFieldErrors = {
            ...fieldErrors,
            securityQuestion: securityQuestionError,
            securityAnswer: securityAnswerError
        };

        setFieldErrors(newFieldErrors);

        if (securityQuestionError || securityAnswerError) {
            return;
        }

        signupMutation.mutate({
            name: formData.name,
            email: formData.email,
            password: formData.password,
            securityQuestion: formData.securityQuestion,
            securityAnswer: formData.securityAnswer
        });
    };

    return (
        <main className="auth-main">
            <div className="auth-card fade-in">
                <Link href="/" className="btn-home-back">
                    ← Back to Home
                </Link>
                <div className="auth-header">
                    <h1>Create Account</h1>
                </div>

                <div className="auth-stepper">
                    <div className={`step-item ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
                        <div className="step-circle">{step > 1 ? "✓" : "1"}</div>
                        <span className="step-label">Basic Info</span>
                    </div>
                    <div className="step-line-mini"></div>
                    <div className={`step-item ${step === 2 ? 'active' : ''}`}>
                        <div className="step-circle">2</div>
                        <span className="step-label">Security</span>
                    </div>
                </div>

                {error && <div style={{ color: 'var(--persian-red)', marginBottom: '20px', fontWeight: 700, textAlign: 'center' }}>{error}</div>}

                <div className="step-container">
                    {step === 1 ? (
                        <form className="auth-form" onSubmit={handleNext}>
                            <div className="form-group">
                                <label>Full Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Enter your full name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    required
                                />
                                {fieldErrors.name && <span className="field-error">{fieldErrors.name}</span>}
                            </div>

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
                                    placeholder="Enter a secure password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    required
                                />
                                {fieldErrors.password && <span className="field-error">{fieldErrors.password}</span>}
                            </div>

                            <div className="form-group">
                                <label>Confirm Password</label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    placeholder="Enter confirm password"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    required
                                />
                                {fieldErrors.confirmPassword && <span className="field-error">{fieldErrors.confirmPassword}</span>}
                            </div>

                            <button type="submit" className="btn-auth">
                                Next Step
                            </button>
                        </form>
                    ) : (
                        <form className="auth-form" onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Security Question (for recovery)</label>
                                <select
                                    name="securityQuestion"
                                    value={formData.securityQuestion}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    required
                                >
                                    <option value="">Select a question...</option>
                                    <option value="What was your first pet's name?">What was your first pet's name?</option>
                                    <option value="What is your mother's maiden name?">What is your mother's maiden name?</option>
                                    <option value="What was the name of your elementary school?">What was the name of your elementary school?</option>
                                    <option value="In what city were you born?">In what city were you born?</option>
                                </select>
                                {fieldErrors.securityQuestion && <span className="field-error">{fieldErrors.securityQuestion}</span>}
                            </div>

                            <div className="form-group">
                                <label>Your Answer</label>
                                <input
                                    type="text"
                                    name="securityAnswer"
                                    placeholder="Enter your secret answer"
                                    value={formData.securityAnswer}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    required
                                />
                                {fieldErrors.securityAnswer && <span className="field-error">{fieldErrors.securityAnswer}</span>}
                            </div>

                            <div className="form-actions-row">
                                <button type="button" onClick={handleBack} className="btn-auth-secondary" disabled={loading}>
                                    Back
                                </button>
                                <button type="submit" className="btn-auth btn-auth-primary" disabled={loading}>
                                    {loading ? "Creating Account..." : "Complete Signup"}
                                </button>
                            </div>
                        </form>
                    )}
                </div>

                <div className="divider-ornate">
                    <span></span>
                    <i>✨</i>
                    <span></span>
                </div>

                <div className="auth-footer">
                    Already have an account?
                    <Link href={`/login${redirectUrl ? `?redirect=${redirectUrl}` : ''}`}>Log In</Link>
                </div>
            </div>
        </main>
    );
};

const SignupPage = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SignupForm />
        </Suspense>
    );
};

export default SignupPage;
