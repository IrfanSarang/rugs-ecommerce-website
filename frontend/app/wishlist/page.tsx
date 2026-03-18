"use client";

import React from "react";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import Link from "next/link";
import Image from "next/image";
import "./wishlist.css";

const WishlistPage = () => {
    const { wishlistItems, removeFromWishlist } = useWishlist();
    const { addToCart } = useCart();

    return (
        <main className="wishlist-main fade-in">
            <div className="wishlist-container">
                <header className="wishlist-header">
                    <h1>Your Curated Collection</h1>
                    <p>These masterpieces are reserved for your consideration.</p>
                </header>

                {wishlistItems.length === 0 ? (
                    <div className="wishlist-empty">
                        <div className="empty-icon">🏺</div>
                        <h2>Your collection is empty</h2>
                        <p>Explore our shop and keep the treasures you love here.</p>
                        <Link href="/shop" className="btn-primary">Browse Masterpieces</Link>
                    </div>
                ) : (
                    <div className="wishlist-grid">
                        {wishlistItems.map((product) => (
                            <div key={product.id} className="wishlist-card">
                                <div className="wishlist-image-container">
                                    <Image 
                                        src={product.image} 
                                        alt={product.name} 
                                        width={300} 
                                        height={300} 
                                        className="wishlist-image"
                                    />
                                    <button 
                                        className="btn-remove-wishlist"
                                        onClick={() => removeFromWishlist(product.id)}
                                        title="Remove from collection"
                                    >
                                        ✕
                                    </button>
                                </div>
                                <div className="wishlist-info">
                                    <span className="product-category">{product.category}</span>
                                    <h3>{product.name}</h3>
                                    <div className="wishlist-meta">
                                        <span className="product-price">{product.price}</span>
                                        <div className="wishlist-actions">
                                            <button 
                                                className="btn-add-to-cart"
                                                onClick={() => addToCart(product)}
                                            >
                                                Add to Cart
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
};

export default WishlistPage;
