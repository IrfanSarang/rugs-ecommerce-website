"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Product } from "@/data/products";

interface WishlistContextType {
    wishlistItems: Product[];
    addToWishlist: (product: Product) => void;
    removeFromWishlist: (productId: number) => void;
    isInWishlist: (productId: number) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [wishlistItems, setWishlistItems] = useState<Product[]>([]);

    useEffect(() => {
        const savedWishlist = localStorage.getItem("farshe_wishlist");
        if (savedWishlist) {
            setWishlistItems(JSON.parse(savedWishlist));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("farshe_wishlist", JSON.stringify(wishlistItems));
    }, [wishlistItems]);

    const addToWishlist = (product: Product) => {
        setWishlistItems((prev) => {
            if (prev.find((item) => item.id === product.id)) return prev;
            return [...prev, product];
        });
    };

    const removeFromWishlist = (productId: number) => {
        setWishlistItems((prev) => prev.filter((item) => item.id !== productId));
    };

    const isInWishlist = (productId: number) => {
        return wishlistItems.some((item) => item.id === productId);
    };

    return (
        <WishlistContext.Provider value={{ wishlistItems, addToWishlist, removeFromWishlist, isInWishlist }}>
            {children}
        </WishlistContext.Provider>
    );
};

export const useWishlist = () => {
    const context = useContext(WishlistContext);
    if (!context) {
        throw new Error("useWishlist must be used within a WishlistProvider");
    }
    return context;
};
