"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Product } from "@/data/products";
import "./ProductModal.css";

interface ProductModalProps {
    product: Product;
    onClose: () => void;
    onAddToCart: (product: Product) => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ product, onClose, onAddToCart }) => {
    const [activeImage, setActiveImage] = useState(product.image);
    const [zoomPos, setZoomPos] = useState({ x: 0, y: 0, show: false });
    const galleryItems = product.gallery || [product.image];

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
        const x = ((e.pageX - left - window.scrollX) / width) * 100;
        const y = ((e.pageY - top - window.scrollY) / height) * 100;
        setZoomPos({ x, y, show: true });
    };

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="product-modal" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}>✕</button>
                
                <div className="modal-body">
                    <div className="modal-gallery-section">
                        <div 
                            className="main-image-preview"
                            onMouseMove={handleMouseMove}
                            onMouseLeave={() => setZoomPos(prev => ({ ...prev, show: false }))}
                        >
                            <Image 
                                src={activeImage} 
                                alt={product.name} 
                                width={600} 
                                height={600} 
                                className="main-img"
                            />
                            {zoomPos.show && (
                                <div 
                                    className="zoom-lens"
                                    style={{
                                        backgroundImage: `url(${activeImage})`,
                                        backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
                                        backgroundSize: '200%'
                                    }}
                                ></div>
                            )}
                        </div>
                        <div className="thumbnails-list">
                            {galleryItems.map((img, idx) => (
                                <div 
                                    key={idx} 
                                    className={`thumb-item ${activeImage === img ? 'active' : ''}`}
                                    onClick={() => setActiveImage(img)}
                                >
                                    <Image src={img} alt="Thumbnail" width={80} height={80} />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="modal-info-section">
                        <span className="info-category">{product.category}</span>
                        <h2>{product.name}</h2>
                        <div className="info-rating">
                            {"★".repeat(product.rating)}{"☆".repeat(5 - product.rating)}
                            <span>(Patron Verified)</span>
                        </div>
                        <p className="info-description">{product.description}</p>
                        
                        <div className="info-meta">
                            {product.material && (
                                <div className="meta-item">
                                    <strong>Material:</strong> {product.material}
                                </div>
                            )}
                            <div className="meta-item">
                                <strong>Origin:</strong> Hand-crafted Heritage
                            </div>
                        </div>

                        <div className="info-purchase">
                            <span className="info-price">{product.price}</span>
                            <button 
                                className="btn-modal-add"
                                onClick={() => onAddToCart(product)}
                            >
                                Add to Collection
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductModal;
