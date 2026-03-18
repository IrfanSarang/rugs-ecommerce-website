"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import "./designers.css";

const DesignersPage = () => {
    const designers = [
        {
            id: 1,
            name: "Reza Sarraf Mamaghani",
            title: "Tabriz Master Artisan",
            bio: "Renowned for reviving the 'Gonbad' (Dome) style, Reza Sarraf is a legendary figure in Tabriz. His work is characterized by intricate mathematical precision and a color palette that captures the essence of Persian spirituality.",
            elements: ["Geometric Precision", "Mathematical Patterns", "Silky Textures"],
            image: "/traditionalRug.png",
            reverse: false
        },
        {
            id: 2,
            name: "Seyed Hossein Rassamy",
            title: "Kerman Floral Visionary",
            bio: "Master Rassamy of Kerman is celebrated for his 'Gol-Farang' (European Flower) designs which blended traditional Persian floral motifs with a touch of Victorian elegance. Each piece takes over 18 months to complete.",
            elements: ["Lavish Florals", "Pastel Palettes", "Fine Knotting"],
            image: "/persianRug.png",
            reverse: true
        },
        {
            id: 3,
            name: "Haji Jalili",
            title: "The Marand Icon",
            bio: "Jalili's rugs from the late 19th century are among the most coveted by collectors. He was famous for using unique, muted color schemes of dusty rose and terra-cotta, moving away from the bright reds of the era.",
            elements: ["Muted Antique Tones", "Terra-cotta Base", "Collector's Grade"],
            image: "/handmadeRug.png",
            reverse: false
        },
        {
            id: 4,
            name: "Ali Khodadadi",
            title: "3D Weaving Pioneer",
            bio: "The contemporary maestro who revolutionized the industry with his 'Sculpted Rug' technique. Khodadadi's work transcends flooring, creating three-dimensional tapestries where motifs literally rise from the surface.",
            elements: ["Sculpted Piles", "High Contrast", "Innovative Reliefs"],
            image: "/modernRug.png",
            reverse: true
        }
    ];

    return (
        <main className="designers-main">
            {/* Hero Section */}
            <section className="designers-hero fade-in">
                <div className="designers-container">
                    <span className="designers-subtitle">The Master Hands</span>
                    <h1>The Artisans Behind Farshe</h1>
                    <p>We partner with the world's most distinguished Persian designers to bring you limited-edition masterpieces that are as much an investment as they are art.</p>
                </div>
            </section>

            {/* Designers Grid */}
            <section className="designers-grid designers-container">
                {designers.map((designer, index) => (
                    <div
                        key={designer.id}
                        className={`designer-showcase fade-in ${designer.reverse ? 'reverse' : ''}`}
                        style={{ animationDelay: `${0.2 * (index + 1)}s` }}
                    >
                        <div className="designer-image-wrapper">
                            <Image
                                src={designer.image}
                                alt={designer.name}
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="designer-info">
                            <span className="designer-meta">{designer.title}</span>
                            <h2 className="designer-name">{designer.name}</h2>
                            <p className="designer-bio">{designer.bio}</p>

                            <div className="signature-elements">
                                <h4>Signature Elements</h4>
                                <div className="elements-list">
                                    {designer.elements.map(el => (
                                        <span key={el} className="element-tag">{el}</span>
                                    ))}
                                </div>
                            </div>

                            <Link href="/shop" className="btn-view-collection">
                                View Signature Collection
                            </Link>
                        </div>
                    </div>
                ))}
            </section>

            {/* CTA Section */}
            <section className="blog-cta fade-in" style={{ backgroundColor: 'var(--persian-red)' }}>
                <div className="cta-content designers-container" style={{ textAlign: 'center', color: 'white' }}>
                    <h2 style={{ fontSize: '2.5rem', marginBottom: '15px' }}>Own a Masterpiece</h2>
                    <p style={{ opacity: 0.9, marginBottom: '30px' }}>Our designer collections are released in limited quantities. Secure your piece of history today.</p>
                    <Link href="/shop" className="btn-primary" style={{ background: 'white', color: 'var(--persian-red)' }}>
                        Shop Designer Collection
                    </Link>
                </div>
            </section>
        </main>
    );
};

export default DesignersPage;
