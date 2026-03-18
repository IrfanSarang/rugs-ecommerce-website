"use client";

import React from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import "./cart.css";

const CartPage = () => {
    const { cartItems, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();

    if (cartItems.length === 0) {
        return (
            <main className="cart-main">
                <div className="cart-empty-container fade-in">
                    <div className="empty-cart-icon">🛒</div>
                    <h2>Your collection is empty</h2>
                    <p>It seems you haven't discovered any treasures yet. Explore our masterpieces to begin your collection.</p>
                    <Link href="/shop" className="btn-primary">Explore Shop</Link>
                </div>
            </main>
        );
    }

    return (
        <main className="cart-main">
            <div className="cart-container fade-in">
                <h1 className="cart-title">Your Heritage Collection</h1>

                <div className="cart-grid">
                    <div className="cart-items-section">
                        {cartItems.map((item) => (
                            <div key={item.id} className="cart-item-card">
                                <div className="cart-item-image">
                                    <img src={item.image} alt={item.name} />
                                </div>
                                <div className="cart-item-details">
                                    <div className="cart-item-type">{item.category}</div>
                                    <h3>{item.name}</h3>
                                    <div className="cart-item-price">{item.price}</div>
                                </div>
                                <div className="cart-item-actions">
                                    <div className="quantity-controls">
                                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                                        <span>{item.quantity}</span>
                                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                                    </div>
                                    <button className="btn-remove" onClick={() => removeFromCart(item.id)}>
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}

                        <button className="btn-clear-cart" onClick={clearCart}>
                            Clear Entire Collection
                        </button>
                    </div>

                    <aside className="cart-summary">
                        <div className="summary-card">
                            <h3>Collection Summary</h3>
                            <div className="summary-row">
                                <span>Subtotal</span>
                                <span>₹{cartTotal.toLocaleString('en-IN')}</span>
                            </div>
                            <div className="summary-row">
                                <span>Shipping</span>
                                <span className="free-shipping">Complimentary</span>
                            </div>
                            <div className="divider"></div>
                            <div className="summary-row total">
                                <span>Total</span>
                                <span>₹{cartTotal.toLocaleString('en-IN')}</span>
                            </div>
                            <Link href="/checkout" style={{ width: '100%' }}>
                                <button className="btn-checkout">
                                    Proceed to Checkout
                                </button>
                            </Link>
                            <p className="summary-note">Prices include all applicable taxes and heritage preservation fees.</p>
                        </div>
                    </aside>
                </div>
            </div>
        </main>
    );
};

export default CartPage;
