"use client";

import React, { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import "./checkout.css";

const CheckoutPage = () => {
    const { cartItems, cartTotal, clearCart } = useCart();
    const { user, isLoading } = useAuth();
    const [step, setStep] = useState(1); // 1: Info, 2: Payment, 3: Processing, 4: Success
    const router = useRouter();

    const [processingMessage, setProcessingMessage] = useState("");
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const [submissionError, setSubmissionError] = useState<string | null>(null);
    const [lastOrder, setLastOrder] = useState<any>(null);
    
    // Promo Code State
    const [promoCode, setPromoCode] = useState("");
    const [appliedCoupon, setAppliedCoupon] = useState<{code: string, discountValue: number} | null>(null);
    const [promoError, setPromoError] = useState<string | null>(null);
    const [promoLoading, setPromoLoading] = useState(false);

    const [shippingData, setShippingData] = useState({
        fullName: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        zip: ""
    });

    useEffect(() => {
        if (user) {
            setShippingData(prev => ({
                ...prev,
                fullName: user.name || "",
                email: user.email || ""
            }));
        }
    }, [user]);

    const [paymentData, setPaymentData] = useState({
        cardNumber: "",
        expiry: "",
        cvv: ""
    });

    const validateField = (name: string, value: string) => {
        let error = "";
        if (name === "fullName" && !value.trim()) {
            error = "Full Name is required";
        } else if (name === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            error = "Please enter a valid email address";
        } else if (name === "phone" && !/^\+?[\d\s-]{10,}$/.test(value)) {
            error = "Enter a valid phone number";
        } else if (name === "address" && !value.trim()) {
            error = "Delivery address is required";
        } else if (name === "city" && !value.trim()) {
            error = "City is required";
        } else if (name === "zip" && !/^\d{5,6}$/.test(value)) {
            error = "Enter 5-6 digit zip code";
        } else if (name === "cardNumber" && !/^\d{4}\s?\d{4}\s?\d{4}\s?\d{4}$/.test(value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim())) {
            // Very basic card check for demo
            if (value.replace(/\D/g, '').length !== 16) error = "Card number must be 16 digits";
        } else if (name === "expiry" && !/^\d{2}\/\d{2}$/.test(value)) {
            error = "Use MM/YY format";
        } else if (name === "cvv" && !/^\d{3}$/.test(value)) {
            error = "CVV must be 3 digits";
        }
        return error;
    };

    const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setShippingData({ ...shippingData, [name]: value });
        setFieldErrors({ ...fieldErrors, [name]: validateField(name, value) });
    };

    const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPaymentData({ ...paymentData, [name]: value });
        setFieldErrors({ ...fieldErrors, [name]: validateField(name, value) });
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFieldErrors({ ...fieldErrors, [name]: validateField(name, value) });
    };

    const validateShipping = () => {
        const errors = {
            fullName: validateField("fullName", shippingData.fullName),
            email: validateField("email", shippingData.email),
            phone: validateField("phone", shippingData.phone),
            address: validateField("address", shippingData.address),
            city: validateField("city", shippingData.city),
            zip: validateField("zip", shippingData.zip)
        };
        setFieldErrors(prev => ({ ...prev, ...errors }));
        return !Object.values(errors).some(e => e !== "");
    };

    const validatePayment = () => {
        const errors = {
            cardNumber: validateField("cardNumber", paymentData.cardNumber),
            expiry: validateField("expiry", paymentData.expiry),
            cvv: validateField("cvv", paymentData.cvv)
        };
        setFieldErrors(prev => ({ ...prev, ...errors }));
        return !Object.values(errors).some(e => e !== "");
    };

    const handleApplyPromo = async () => {
        if (!promoCode.trim()) return;
        setPromoLoading(true);
        setPromoError(null);
        try {
            const response = await fetch('http://localhost:5000/api/coupons/validate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code: promoCode })
            });
            const data = await response.json();
            if (response.ok && data.valid) {
                setAppliedCoupon({
                    code: data.code,
                    discountValue: data.discountValue
                });
                setPromoCode("");
            } else {
                setPromoError(data.message || "Invalid heritage code");
            }
        } catch (error) {
            setPromoError("Authentication with treasury failed");
        } finally {
            setPromoLoading(false);
        }
    };

    const calculateDiscount = () => {
        if (!appliedCoupon) return 0;
        return (cartTotal * appliedCoupon.discountValue) / 100;
    };

    const finalTotal = cartTotal - calculateDiscount();


    const handlePayment = async () => {
        setStep(3);
        const messages = [
            "Initializing secure heritage vault...",
            "Authenticating with Royal Bank...",
            "Finalizing your collection acquire...",
            "Securing your digital certificate..."
        ];

        try {
            // Prepare order data
            const orderData = {
                customerName: shippingData.fullName,
                customerEmail: shippingData.email,
                totalAmount: finalTotal,
                userId: user?.id || null,
                couponCode: appliedCoupon?.code || null,
                discountAmount: calculateDiscount(),
                phone: shippingData.phone,
                city: shippingData.city,
                zip: shippingData.zip,
                address: shippingData.address,
                items: cartItems.map(item => ({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    image: item.image
                }))
            };

            // Call backend to store order
            const response = await fetch('http://localhost:5000/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(orderData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to record order in heritage archives');
            }

            const result = await response.json();
            setLastOrder({ ...orderData, id: result.id });

            // Simulated processing messages
            let msgIndex = 0;
            const interval = setInterval(() => {
                if (msgIndex < messages.length) {
                    setProcessingMessage(messages[msgIndex]);
                    msgIndex++;
                } else {
                    clearInterval(interval);
                    setTimeout(() => {
                        setStep(4);
                        clearCart();
                    }, 1000);
                }
            }, 1000);

            setProcessingMessage(messages[0]);
        } catch (error: any) {
            console.error('Order Submission Error:', error);
            setSubmissionError(error.message || "An error occurred while securing your masterpiece.");
            setStep(5); // Error state
        }
    };

    if (cartItems.length === 0 && step !== 4) {
        return (
            <main className="checkout-main">
                <div className="status-card error-card fade-in">
                    <h2>Cart is Empty</h2>
                    <p>Please add items to your collection before proceeding.</p>
                    <Link href="/shop" className="btn-primary">Back to Gallery</Link>
                </div>
            </main>
        );
    }

    if (isLoading) {
        return (
            <main className="checkout-main">
                <div className="status-card fade-in" style={{ textAlign: "center", padding: "50px" }}>
                    <div className="persian-spinner" style={{ margin: "0 auto 20px" }}>
                        <div className="spinner-inner"></div>
                        <div className="spinner-center">✦</div>
                    </div>
                    <h2>Gathering Heritage Details...</h2>
                    <p>Preparing your secure acquisition experience.</p>
                </div>
            </main>
        );
    }

    return (
        <main className="checkout-main">
            <div className="checkout-container">
                {step < 3 && (
                    <div className="checkout-grid fade-in">
                        <div className="checkout-form-section">
                            <div className="checkout-step-header">
                                <span className={`step-dot ${step >= 1 ? 'active' : ''}`}>1</span>
                                <div className="step-line"></div>
                                <span className={`step-dot ${step >= 2 ? 'active' : ''}`}>2</span>
                            </div>

                            {!user && step === 1 && (
                                <div className="guest-checkout-banner fade-in">
                                    <div className="banner-content">
                                        <div className="banner-icon-wrapper">
                                            <span className="banner-icon">⚔️</span>
                                        </div>
                                        <div className="banner-text">
                                            <h3>Inscribe into the Heritage</h3>
                                            <p>Join our curation circle to track acquisitions and unlock bespoke patron benefits.</p>
                                        </div>
                                    </div>
                                    <div className="banner-actions">
                                        <Link href={`/login?redirect=/checkout`} className="btn-banner-auth secondary">
                                            Sign In
                                        </Link>
                                        <Link href={`/signup?redirect=/checkout`} className="btn-banner-auth primary">
                                            Become a Patron
                                        </Link>
                                    </div>
                                </div>
                            )}

                            {step === 1 ? (
                                <div className="checkout-step-content">
                                    <h1>Shipping Information</h1>
                                    <div className="input-row">
                                            <div className={`input-group ${fieldErrors.fullName ? 'error' : (shippingData.fullName ? 'success' : '')}`}>
                                                <label>Full Name</label>
                                                <input 
                                                    type="text" 
                                                    name="fullName"
                                                    placeholder="Enter your full name" 
                                                    value={shippingData.fullName}
                                                    onChange={handleShippingChange}
                                                    onBlur={handleBlur}
                                                />
                                                {fieldErrors.fullName && <span className="field-error">{fieldErrors.fullName}</span>}
                                            </div>
                                    </div>
                                    <div className="input-row-grid">
                                        <div className={`input-group ${fieldErrors.email ? 'error' : (shippingData.email ? 'success' : '')}`}>
                                            <label>Email Address</label>
                                            <input 
                                                type="email" 
                                                name="email"
                                                placeholder="Enter your email address" 
                                                value={shippingData.email}
                                                onChange={handleShippingChange}
                                                onBlur={handleBlur}
                                            />
                                            {fieldErrors.email && <span className="field-error">{fieldErrors.email}</span>}
                                        </div>
                                        <div className={`input-group ${fieldErrors.phone ? 'error' : (shippingData.phone ? 'success' : '')}`}>
                                            <label>Primary Contact Number</label>
                                            <input 
                                                type="tel" 
                                                name="phone"
                                                placeholder="Enter your phone number" 
                                                value={shippingData.phone}
                                                onChange={handleShippingChange}
                                                onBlur={handleBlur}
                                            />
                                            {fieldErrors.phone && <span className="field-error">{fieldErrors.phone}</span>}
                                        </div>
                                    </div>
                                    <div className="input-row">
                                        <div className={`input-group ${fieldErrors.address ? 'error' : (shippingData.address ? 'success' : '')}`}>
                                            <label>Delivery Address</label>
                                            <textarea 
                                                name="address"
                                                placeholder="Enter your full address"
                                                value={shippingData.address}
                                                onChange={handleShippingChange}
                                                onBlur={handleBlur}
                                            ></textarea>
                                            {fieldErrors.address && <span className="field-error">{fieldErrors.address}</span>}
                                        </div>
                                    </div>
                                    <div className="input-row-grid">
                                        <div className={`input-group ${fieldErrors.city ? 'error' : (shippingData.city ? 'success' : '')}`}>
                                            <label>City</label>
                                            <input 
                                                type="text" 
                                                name="city"
                                                placeholder="Enter City" 
                                                value={shippingData.city}
                                                onChange={handleShippingChange}
                                                onBlur={handleBlur}
                                            />
                                            {fieldErrors.city && <span className="field-error">{fieldErrors.city}</span>}
                                        </div>
                                        <div className={`input-group ${fieldErrors.zip ? 'error' : (shippingData.zip ? 'success' : '')}`}>
                                            <label>Postal / Zip Code</label>
                                            <input 
                                                type="text" 
                                                name="zip"
                                                placeholder="Enter 6-digit PIN code" 
                                                value={shippingData.zip}
                                                onChange={handleShippingChange}
                                                onBlur={handleBlur}
                                            />
                                            {fieldErrors.zip && <span className="field-error">{fieldErrors.zip}</span>}
                                        </div>
                                    </div>
                                    <button 
                                        className="btn-continue-checkout w-100 mt-4" 
                                        onClick={() => {
                                            if (validateShipping()) setStep(2);
                                        }}
                                    >
                                        Continue to Payment
                                    </button>
                                </div>
                            ) : (
                                <div className="checkout-step-content">
                                    <h1>Payment Details</h1>
                                    <div className="payment-alert">
                                        <span className="icon">🛡️</span>
                                        <p>Secure Dummy Gateway for Demonstration</p>
                                    </div>
                                    <div className="input-row">
                                            <div className={`input-group ${fieldErrors.cardNumber ? 'error' : (paymentData.cardNumber ? 'success' : '')}`}>
                                                <label>Card Number</label>
                                                <input 
                                                    type="text" 
                                                    name="cardNumber"
                                                    placeholder="Enter 16-digit card number" 
                                                    maxLength={19} 
                                                    value={paymentData.cardNumber}
                                                    onChange={handlePaymentChange}
                                                    onBlur={handleBlur}
                                                />
                                                {fieldErrors.cardNumber && <span className="field-error">{fieldErrors.cardNumber}</span>}
                                            </div>
                                    </div>
                                    <div className="input-row-grid">
                                        <div className={`input-group ${fieldErrors.expiry ? 'error' : (paymentData.expiry ? 'success' : '')}`}>
                                            <label>Expiry</label>
                                            <input 
                                                type="text" 
                                                name="expiry"
                                                placeholder="Enter Expiry (MM/YY)" 
                                                maxLength={5} 
                                                value={paymentData.expiry}
                                                onChange={handlePaymentChange}
                                                onBlur={handleBlur}
                                            />
                                            {fieldErrors.expiry && <span className="field-error">{fieldErrors.expiry}</span>}
                                        </div>
                                        <div className="input-group">
                                            <label>CVV</label>
                                            <input 
                                                type="password" 
                                                name="cvv"
                                                placeholder="Enter CVV" 
                                                maxLength={3} 
                                                value={paymentData.cvv}
                                                onChange={handlePaymentChange}
                                                onBlur={handleBlur}
                                            />
                                            {fieldErrors.cvv && <span className="field-error">{fieldErrors.cvv}</span>}
                                        </div>
                                    </div>
                                    <button 
                                        className="btn-buy-now w-100 mt-4" 
                                        onClick={() => {
                                            if (validatePayment()) handlePayment();
                                        }}
                                    >
                                        <span className="icon">🛡️</span> Complete Masterpiece Acquisition
                                    </button>
                                    
                                    <div className="trust-signals">
                                        <div className="trust-item">
                                            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12 2C9.24 2 7 4.24 7 7v3H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-1V7c0-2.76-2.24-5-5-5zm0 2c1.66 0 3 1.34 3 3v3H9V7c0-1.66 1.34-3 3-3zm-6 8h12v8H6v-8z"/></svg>
                                            <span>Bank-Level Security</span>
                                        </div>
                                        <div className="trust-item">
                                            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/></svg>
                                            <span>SSL Encrypted</span>
                                        </div>
                                    </div>

                                    <button className="btn-back" onClick={() => setStep(1)}>Back to Shipping</button>
                                </div>
                            )}
                        </div>

                        <aside className="checkout-summary">
                            <div className="summary-card">
                                <h3>Order Summary</h3>
                                <div className="checkout-items-list">
                                    {cartItems.map(item => (
                                        <div key={item.id} className="checkout-item">
                                            <img src={item.image} alt={item.name} />
                                            <div className="item-info">
                                                <span className="item-name">{item.name}</span>
                                                <span className="item-qty">Qty: {item.quantity}</span>
                                            </div>
                                            <span className="item-price">{item.price}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="summary-footer">
                                    <div className="promo-section">
                                        <div className="promo-input-group">
                                            <input 
                                                type="text" 
                                                placeholder="Heritage Code" 
                                                value={promoCode}
                                                onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                                                disabled={promoLoading || !!appliedCoupon}
                                            />
                                            <button 
                                                onClick={handleApplyPromo}
                                                disabled={promoLoading || !promoCode || !!appliedCoupon}
                                            >
                                                {promoLoading ? '...' : 'Apply'}
                                            </button>
                                        </div>
                                        {promoError && <p className="promo-error">{promoError}</p>}
                                        {appliedCoupon && (
                                            <div className="applied-coupon fade-in">
                                                <span className="coupon-tag">⚜️ {appliedCoupon.code}</span>
                                                <button onClick={() => setAppliedCoupon(null)} className="remove-coupon">✕</button>
                                            </div>
                                        )}
                                    </div>

                                    <div className="summary-row">
                                        <span>Subtotal</span>
                                        <span>₹{cartTotal.toLocaleString('en-IN')}</span>
                                    </div>
                                    {appliedCoupon && (
                                        <div className="summary-row discount fade-in">
                                            <span>Patron Discount ({appliedCoupon.discountValue}%)</span>
                                            <span>-₹{calculateDiscount().toLocaleString('en-IN')}</span>
                                        </div>
                                    )}
                                    <div className="summary-row total">
                                        <span>Total Amount</span>
                                        <span>₹{finalTotal.toLocaleString('en-IN')}</span>
                                    </div>
                                </div>
                            </div>
                        </aside>
                    </div>
                )}

                {step === 3 && (
                    <div className="processing-container fade-in">
                        <div className="persian-spinner">
                            <div className="spinner-inner"></div>
                            <div className="spinner-center">✦</div>
                        </div>
                        <h2>{processingMessage}</h2>
                        <p>Our artisans are preparing your secure transaction...</p>
                    </div>
                )}

                {step === 4 && (
                    <div className="success-container fade-in">
                        <div className="success-icon">✨</div>
                        <h1>Acquisition Complete</h1>
                        <p className="success-subtitle">Congratulations! Your chosen masterpieces have been secured.</p>
                        
                        {lastOrder && (
                            <div className="order-receipt-card">
                                <div className="receipt-header">
                                    <span className="order-label">Heritage Order ID</span>
                                    <span className="order-id">#FSH-{lastOrder.id}</span>
                                </div>
                                <div className="receipt-divider"></div>
                                <div className="delivery-recap">
                                    <div className="recap-group">
                                        <span className="label">Delivering To:</span>
                                        <p>{lastOrder.customerName}</p>
                                        <p>{lastOrder.address}</p>
                                        <p>{lastOrder.city}, {lastOrder.zip}</p>
                                    </div>
                                    <div className="recap-group">
                                        <span className="label">Contact:</span>
                                        <p>{lastOrder.phone}</p>
                                        <p>{lastOrder.customerEmail}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <p className="heritage-note">A digital certificate of authenticity and your receipt have been dispatched to your email.</p>
                        
                        <div className="success-actions">
                            <Link href="/" className="btn-primary">Return to Palace</Link>
                            {user && <Link href="/orders" className="btn-secondary">Track Acquisition</Link>}
                        </div>
                    </div>
                )}

                {step === 5 && (
                    <div className="error-container fade-in">
                        <div className="error-icon">🛡️</div>
                        <h1>Acquisition Interrupted</h1>
                        <p className="error-message">{submissionError}</p>
                        <p>Our artisans were unable to secure your transaction. Please review your details and try again.</p>
                        <div className="error-actions">
                            <button className="btn-primary" onClick={() => { setStep(2); setSubmissionError(null); }}>Retry Payment</button>
                            <button className="btn-secondary" onClick={() => { setStep(1); setSubmissionError(null); }}>Review Information</button>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
};

export default CheckoutPage;
