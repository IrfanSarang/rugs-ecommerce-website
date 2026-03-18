"use client";

import React, { useState } from "react";
import { Product } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import { useDebounce } from "../../hooks/useDebounce"; 
import Image from "next/image"; // Optimization
import "./shop.css";
import { useQuery } from "@tanstack/react-query";
import { apiCall } from "@/utils/api";
import { useWishlist } from "@/context/WishlistContext";
import ProductModal from "@/components/ProductModal/ProductModal";

const Shop = () => {
    const router = useRouter();
    const { addToCart } = useCart();
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [selectedMaterial, setSelectedMaterial] = useState("All");
    const [searchTerm, setSearchTerm] = useState("");
    const [maxPrice, setMaxPrice] = useState(300000);
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);
    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    const { data: products = [], isLoading: loading } = useQuery<Product[]>({
        queryKey: ["products"],
        queryFn: () => apiCall("/products")
    });

    const categories = ["All", "Living Room", "Bedroom", "Handmade", "Modern", "Traditional"];
    const materials = ["All", "Silk", "Wool", "Cotton", "Chenille", "Synthetic"];

    const parsePrice = (priceStr: string) => {
        return parseInt(priceStr.replace(/[₹,]/g, ""));
    };

    const filteredProducts = products.filter((p) => {
        const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
        const matchesMaterial = selectedMaterial === "All" || p.material === selectedMaterial;
        const matchesSearch = p.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
        const matchesPrice = parsePrice(p.price) <= maxPrice;
        return matchesCategory && matchesMaterial && matchesSearch && matchesPrice;
    });

    const ProductSkeleton = () => (
        <div className="product-card skeleton">
            <div className="skeleton-image"></div>
            <div className="product-info">
                <div className="skeleton-line short"></div>
                <div className="skeleton-line medium"></div>
                <div className="skeleton-line long"></div>
                <div className="skeleton-footer">
                    <div className="skeleton-line circle"></div>
                    <div className="skeleton-line circle"></div>
                </div>
            </div>
        </div>
    );

    return (
        <main className="shop-main">
            {/* Mobile Filter Toggle */}
            <div className="mobile-filter-bar only-mobile">
                <button 
                    className="btn-toggle-filters" 
                    onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                >
                    <span className="icon">🏺</span> {isFiltersOpen ? "Close Filters" : "Filters & Tools"}
                </button>
            </div>

            <div className={`shop-container ${isFiltersOpen ? 'filters-active' : ''}`}>
                {/* Sidebar Filters */}
                <aside className={`shop-sidebar fade-in ${isFiltersOpen ? 'open' : ''}`}>
                    {/* Search Field */}
                    <div className="filter-group">
                        <h3>Search</h3>
                        <div className="search-box">
                            <input
                                type="text"
                                placeholder="Enter search terms..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="filter-group">
                        <h3>Categories</h3>
                        <ul className="filter-list">
                            {categories.map((cat) => (
                                <li
                                    key={cat}
                                    className={selectedCategory === cat ? "active" : ""}
                                    onClick={() => setSelectedCategory(cat)}
                                >
                                    {cat}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="filter-group">
                        <h3>Materials</h3>
                        <ul className="filter-list">
                            {materials.map((mat) => (
                                <li
                                    key={mat}
                                    className={selectedMaterial === mat ? "active" : ""}
                                    onClick={() => setSelectedMaterial(mat)}
                                >
                                    {mat}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="filter-group">
                        <h3>Price Range</h3>
                        <div className="price-slider-container">
                            <input
                                type="range"
                                className="price-slider"
                                min="5000"
                                max="300000"
                                step="5000"
                                value={maxPrice}
                                onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                            />
                            <div className="price-values">
                                <span>₹5,000</span>
                                <span>₹{maxPrice.toLocaleString('en-IN')}</span>
                            </div>
                        </div>
                    </div>

                    <div className="filter-group">
                        <h3>Sort By</h3>
                        <ul className="filter-list">
                            <li>Newest First</li>
                            <li>Price: Low to High</li>
                            <li>Price: High to Low</li>
                        </ul>
                    </div>
                </aside>

                {/* Content Area */}
                <section className="shop-content fade-in delay-1">
                    {loading ? (
                        <div className="product-grid">
                            {[1, 2, 3, 4, 5, 6].map((i) => <ProductSkeleton key={i} />)}
                        </div>
                    ) : (
                        <>
                            {/* Professional Result Bar */}
                            <div className="shop-results-header">
                        <div className="result-count">
                            Showing <span>{filteredProducts.length}</span> masterpieces
                        </div>
                        <div className="sort-dropdown">
                            <label>Sort by:</label>
                            <select>
                                <option>Newest First</option>
                                <option>Price: Low to High</option>
                                <option>Price: High to Low</option>
                                <option>Most Popular</option>
                            </select>
                        </div>
                    </div>

                    <div className="product-grid">
                        {filteredProducts.map((product) => (
                            <div key={product.id} className="product-card">
                                <div className="product-image-container">
                                    <Image 
                                        src={product.image} 
                                        alt={product.name} 
                                        className="product-image"
                                        width={400}
                                        height={400}
                                        priority={product.id < 5} // Load first few immediately
                                    />
                                    {product.id % 3 === 0 && <span className="badge-featured">Best Seller</span>}
                                    {product.id % 5 === 0 && <span className="badge-new">New Arrival</span>}
                                    <div className="product-overlay">
                                        <button 
                                            className="quick-view"
                                            onClick={() => setSelectedProduct(product)}
                                        >
                                            Quick View
                                        </button>
                                        <button 
                                            className={`wishlist-overlay-btn ${isInWishlist(product.id) ? 'active' : ''}`}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                isInWishlist(product.id) ? removeFromWishlist(product.id) : addToWishlist(product);
                                            }}
                                        >
                                            {isInWishlist(product.id) ? '❤️' : '🤍'}
                                        </button>
                                    </div>
                                </div>
                                <div className="product-info">
                                    <div className="product-type">{product.category}</div>
                                    <h3>{product.name}</h3>
                                    <p>{product.description}</p>
                                    <div className="product-meta">
                                        <div className="product-price">{product.price}</div>
                                        <div className="product-actions">
                                            <button
                                                className="btn-add-to-cart"
                                                onClick={() => addToCart(product)}
                                            >
                                                Add to Cart
                                            </button>
                                            <button
                                                className="btn-buy-now"
                                                onClick={() => {
                                                    addToCart(product);
                                                    router.push("/cart");
                                                }}
                                            >
                                                Buy Now
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {filteredProducts.length === 0 && (
                        <div className="shop-empty-state">
                            <div className="empty-icon">🏺</div>
                            <h2>No Treasures Found</h2>
                            <p>Try adjusting your filters or search terms to find what you're looking for.</p>
                            <button onClick={() => { setSelectedCategory("All"); setSelectedMaterial("All"); setSearchTerm(""); setMaxPrice(300000); }} className="btn-primary">Clear All Filters</button>
                        </div>
                            )}
                        </>
                    )}
                </section>
            </div>
            {/* Product Modal */}
            {selectedProduct && (
                <ProductModal 
                    product={selectedProduct} 
                    onClose={() => setSelectedProduct(null)} 
                    onAddToCart={(p) => {
                        addToCart(p);
                        setSelectedProduct(null);
                    }}
                />
            )}
        </main>
    );
};

export default Shop;
