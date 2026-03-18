"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import "./blog.css";

interface BlogPost {
  id: string;
  img: string;
  category: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  readTime: string;
  tags: string[];
}

const BlogPage = () => {
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = ["All", "Heritage", "Interior Design", "Craftsmanship", "Rug Care"];

  const blogPosts: BlogPost[] = [
    {
      id: "1",
      img: "/blog1.png",
      category: "Heritage",
      title: "Traditional Rugs: A Timeless Art Form Across Centuries",
      excerpt: "Explore the deep-rooted history, symbolic motifs, and the unmatched craftsmanship of traditional Persian weaving that continues to define luxury interiors.",
      author: "Irfan Sarang",
      date: "Mar 1, 2026",
      readTime: "6 min read",
      tags: ["History", "Art", "Tradition"]
    },
    {
      id: "2",
      img: "/blog2.png",
      category: "Craftsmanship",
      title: "The Alchemy of Dyeing: From Plants to Persian Silk",
      excerpt: "Discover the organic process of creating vibrant, life-long colors using vegetable dyes, and why synthetic alternatives can never match the soul of a hand-knotted rug.",
      author: "Danish Shaikh",
      date: "Feb 24, 2026",
      readTime: "8 min read",
      tags: ["Organic", "Process", "Silk"]
    },
    {
      id: "3",
      img: "/blog3.png",
      category: "Interior Design",
      title: "Mastering the Layered Look: Rugs in Contemporary Spaces",
      excerpt: "Expert tips and tricks for selecting, sizing, and layering the perfect floor masterpieces to complement modern minimalist decor without losing warmth.",
      author: "Anurag Dubey",
      date: "Feb 18, 2026",
      readTime: "5 min read",
      tags: ["Styling", "Modern", "Tips"]
    },
    {
      id: "4",
      img: "/livingRoomRug.png",
      category: "Rug Care",
      title: "Protecting Your Investment: A Guide to Heirloom Care",
      excerpt: "A comprehensive guide on cleaning, rotating, and preserving the value of your hand-knotted rugs for generations to come.",
      author: "Farshe Experts",
      date: "Feb 10, 2026",
      readTime: "10 min read",
      tags: ["Maintenance", "Durability"]
    }
  ];

  const filteredPosts = activeCategory === "All"
    ? blogPosts
    : blogPosts.filter(post => post.category === activeCategory);

  return (
    <main className="blog-main">
      {/* Blog Hero */}
      <section className="blog-hero fade-in">
        <div className="blog-container">
          <span className="blog-subtitle">The Farshe Journal</span>
          <h1>Heritage, Art & Stories</h1>
          <p>Delve into the world of Persian craftsmanship, design inspiration, and the stories woven into every thread.</p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="blog-filters fade-in delay-1">
        <div className="blog-container">
          <div className="category-tabs">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`tab ${activeCategory === cat ? "active" : ""}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="blog-search-bar">
            <input type="text" placeholder="Enter search keywords..." aria-label="Search articles" />
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
          </div>
        </div>
      </section>

      {/* Blog Feed */}
      <section className="blog-feed blog-container fade-in delay-2">
        <div className="blog-grid">
          {filteredPosts.map((post) => (
            <article key={post.id} className="blog-card">
              <div className="card-image">
                <span className="category-badge">{post.category}</span>
                <Image src={post.img} alt={post.title} fill className="object-cover" />
              </div>
              <div className="card-body">
                <div className="post-meta">
                  <span className="author">By {post.author}</span>
                  <span className="dot"></span>
                  <span className="date">{post.date}</span>
                </div>
                <h2 className="post-title">
                  <Link href={`/blog/${post.id}`}>{post.title}</Link>
                </h2>
                <p className="post-excerpt">{post.excerpt}</p>
                <div className="post-footer">
                  <div className="tags">
                    {post.tags.map(tag => <span key={tag} className="tag">#{tag}</span>)}
                  </div>
                  <span className="read-time">{post.readTime}</span>
                </div>
              </div>
            </article>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="empty-blog">
            <p>No stories found in this category yet. Check back soon.</p>
          </div>
        )}
      </section>

      {/* Newsletter / CTA */}
      <section className="blog-cta fade-in delay-3">
        <div className="cta-content blog-container">
          <h2>Never miss a story</h2>
          <p>Subscribe to our journal for monthly heritage deep-dives and design tips.</p>
          <form className="cta-form" onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="Enter your email address" required />
            <button type="submit">Subscribe</button>
          </form>
        </div>
      </section>
    </main>
  );
};

export default BlogPage;
