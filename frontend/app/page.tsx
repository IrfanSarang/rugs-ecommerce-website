"use client";
import { useEffect, useState } from "react";
import Carousel from "@/components/Carousel/Carousel";
import Image from "next/image";
import "./home.css";
import { useQuery } from "@tanstack/react-query";
import { apiCall } from "@/utils/api";

interface Category {
  id: number;
  title: string;
  image: string;
}

interface Product {
  id: number;
  image: string;
  name: string;
  description: string;
  price: string;
}

const HomePage = () => {
  const bannerImages = ["/Banner1.png", "/Banner2.png", "/Banner3.png"];

  const categories: Category[] = [
    { id: 1, title: "Living Room", image: "/livingRoomRug.png" },
    { id: 2, title: "Bedroom", image: "/bedroomRug.png" },
    { id: 3, title: "Handmade", image: "/handmadeRug.png" },
    { id: 4, title: "Modern", image: "/modernRug.png" },
  ];

  const { data: fetchedProducts = [] } = useQuery<Product[]>({
    queryKey: ["bestSellers"],
    queryFn: () => apiCall("/products")
  });

  const products = fetchedProducts.slice(0, 3);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
        }
      });
    }, observerOptions);

    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <main>
      {/* Hero Section */}
      <section className="hero fade-in" style={{ padding: 0 }}>
        <Carousel images={bannerImages} height="var(--hero-height, 700px)" />
      </section>

      <div className="container">
        {/* Shop By Categories */}
        <section className="category section-light reveal" id="shop">
          <div className="text-center">
            <h2 className="persian-title text-center">Shop By Categories</h2>
          </div>
          <div className="category-grid">
            {categories.map((category) => (
              <div className="category-card" key={category.id}>
                <Image 
                  src={category.image} 
                  alt={category.title} 
                  width={300} 
                  height={400} 
                  className="category-image"
                />
                <h3>{category.title}</h3>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Craftsmanship Section */}
      <section className="section-dark">
        <div className="container">
          <div className="craftsmanship reveal">
            <div className="craftsmanship-text">
              <span className="subtitle">Masterpieces of Heritage</span>
              <h2 className="persian-title">The Legacy of Craft</h2>
              <p>
                Every rug in our collection tells a story that spans generations. Hand-knotted by master artisans using traditional Persian techniques, our rugs are more than just floor coverings—they are masterpieces of heritage and soul. Using only organic dyes and premium wool, we ensure each piece is a sustainable luxury for your home.
              </p>
              <a href="/about" className="btn-primary">Learn Our Story</a>
            </div>
            <div className="craftsmanship-image">
              <Image 
                src="/handmadeRug.png" 
                alt="Craftsmanship" 
                width={600} 
                height={400} 
                className="heritage-photo"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="container">
        {/* Best Sellers */}
        <section className="bestSellers section-light reveal">
          <div className="text-center">
            <h2 className="persian-title text-center">Best Sellers</h2>
          </div>
          <div className="bestSellers-container">
            {products.map((product) => (
              <div key={product.id} className="bestSellers-card">
                <Image 
                  src={product.image} 
                  alt={product.name} 
                  width={400} 
                  height={500} 
                />
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                <div className="price">{product.price}</div>
                <button className="btn-auth">Add to Cart</button>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Testimonials */}
      <section className="section-dark">
        <div className="container">
          <section className="testimonials reveal">
            <div className="text-center">
              <h2 className="persian-title text-center">Voices of Excellence</h2>
            </div>
            <div className="testimonials-grid">
              <div className="testimonial-card">
                <p>"The Royal Heritage rug I purchased is truly the centerpiece of my home. The craftsmanship is beyond words."</p>
                <h4>— IRFAN SARANG</h4>
              </div>
              <div className="testimonial-card">
                <p>"Seamless delivery and the rug looks even better in person than it did on the website. High quality wool!"</p>
                <h4>— DANISH SHAIKH</h4>
              </div>
              <div className="testimonial-card">
                <p>"Authentic designs and premium feel. Farshe is the only place I will ever buy rugs from now on."</p>
                <h4>— ANURAG DUBEY</h4>
              </div>
            </div>
          </section>
        </div>
      </section>

      <div className="container">
        {/* Why Choose Us */}
        <section className="whyChooseUs section-light reveal">
          <div className="text-center">
            <h2 className="persian-title text-center">The Farshe Difference</h2>
          </div>
          <div className="whyChooseUs-grid">
            <div className="whyCard">
              <h4>HandCrafted Quality</h4>
              <p>Authentic hand-knotted pieces from expert artisans using organic dyes.</p>
            </div>
            <div className="whyCard">
              <h4>Fast Delivery</h4>
              <p>Insured global shipping straight to your doorstep within 5-7 days.</p>
            </div>
            <div className="whyCard">
              <h4>Easy Returns</h4>
              <p>Not satisfied? Return it within 30 days, no questions asked.</p>
            </div>
          </div>
        </section>
      </div>

      {/* Newsletter Section */}
      <section className="newsletter reveal">
        <div className="container">
          <div className="newsletter-inner">
            <h2>Join the Heritage</h2>
            <p>Sign up to receive exclusive offers, early access to new collections, and stories from the artisans.</p>
            <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder="Enter your email address" aria-label="Email for newsletter" required />
              <button type="submit">Subscribe</button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
};

export default HomePage;
