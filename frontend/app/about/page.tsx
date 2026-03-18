import React from "react";
import Image from "next/image";
import Link from "next/link";
import "./about.css";

const AboutPage: React.FC = () => {
  const differentiators = [
    {
      id: 1,
      title: "Handcrafted Quality",
      description: "Every rug is carefully knotted by master artisans, preserving centuries-old Persian techniques.",
      icon: "🧶"
    },
    {
      id: 2,
      title: "Premium Materials",
      description: "We source only the finest highland wool and organic silk for unmatched texture and durability.",
      icon: "✨"
    },
    {
      id: 3,
      title: "Ethical Sourcing",
      description: "Our commitment to fair trade ensures that every weaver is respected and fairly compensated.",
      icon: "🤝"
    },
    {
      id: 4,
      title: "Timeless Design",
      description: "A curated collection that honors classical Persian heritage while embracing modern living.",
      icon: "🏛️"
    },
  ];

  return (
    <main className="about-main">
      {/* Hero Section */}
      <section className="about-hero fade-in">
        <div className="hero-content">
          <h1>Crafting Legacies</h1>
          <p>Discover the journey of Farshe, where every thread tells a story of heritage, art, and obsession with quality.</p>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="about-section alternate fade-in delay-1">
        <div className="section-content">
          <div className="text-box">
            <span className="subtitle">Since 1985</span>
            <h2>A Foundation of Artistry</h2>
            <p>
              We started with a simple belief that a rug is more than just décor. It is a foundation that brings warmth, comfort, and balance to a space.
              Inspired by timeless designs and evolving lifestyles, we set out to create rugs that truly feel like home.
            </p>
            <p>
              Our journey began in the heart of traditional weaving centers, where we partnered with families who have passed down the secret of the perfect knot for generations.
            </p>
          </div>
          <div className="image-box">
            <Image src="/persianRug.png" alt="Traditional Rug Design" width={600} height={450} className="round-img shadow" />
          </div>
        </div>
      </section>

      {/* Differentiators */}
      <section className="differentiators-section fade-in delay-2">
        <div className="container">
          <div className="section-header center">
            <h2>Why Farshe?</h2>
            <div className="divider"></div>
          </div>
          <div className="diff-grid">
            {differentiators.map((item) => (
              <div key={item.id} className="diff-card">
                <div className="diff-icon">{item.icon}</div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Craftsmanship */}
      <section className="about-section fade-in delay-3">
        <div className="section-content reverse">
          <div className="text-box">
            <span className="subtitle">The Process</span>
            <h2>Mastery in Every Knot</h2>
            <p>
              Every Farshe rug undergoes a rigorous journey. From the carding of raw wool to the final organic wash, we ensure no corners are cut.
            </p>
            <ul className="process-list">
              <li><strong>Selection:</strong> Hand-picked fibers for purity and strength.</li>
              <li><strong>Dyeing:</strong> Using natural, vegetable-based pigments for depth.</li>
              <li><strong>Weaving:</strong> Precision hand-knotting that can take months to complete.</li>
              <li><strong>Finishing:</strong> Sun-drying and expert trimming for a soft, lustrous finish.</li>
            </ul>
          </div>
          <div className="image-box">
            <Image src="/handmadeRug.png" alt="Handmade Rug Process" width={600} height={450} className="round-img shadow" />
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="mission-highlight fade-in">
        <div className="mission-card">
          <h2>Our Mission</h2>
          <p>
            "To preserve the dying art of hand-weaving while making the luxury of premium Persian craftsmanship accessible to modern homes around the world."
          </p>
          <Link href="/shop" className="btn-primary">Explore Our Collection</Link>
        </div>
      </section>
    </main>
  );
};

export default AboutPage;
