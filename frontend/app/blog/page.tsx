import React from "react";
import "./blog.css";

interface BlogPageProps {
  id: string;
  img: string;
  title: string;
  description: string;
}

const BlogPage = () => {
  const blogContent: BlogPageProps[] = [
    {
      id: "1",
      img: "/blog1.png",
      title: "Traditional Rugs: A Timeless Art Form",
      description:
        "Explore the rich history and craftsmanship of traditional rugs.",
    },
    {
      id: "2",
      img: "/blog2.png",
      title: "Persian Rugs: A Cultural Heritage",
      description:
        "Discover the significance of Persian rugs in art and culture.",
    },
    {
      id: "3",
      img: "/blog3.png",
      title: "How to select the perfect rug for your home",
      description:
        "Tips and tricks for choosing the right rug to complement your decor.",
    },
  ];

  return (
    <main>
      <section className="blog-heading">
        <h1>The Farshe Blog</h1>
      </section>

      <section className="blog-search">
        <input type="text" placeholder="Search articles..." />
        <button>Search</button>
      </section>

      <section className="blog-content">
        {/* Blog content will go here */}
        {blogContent.map((blog) => (
          <article key={blog.id} className="blog-article">
            <img src={blog.img} alt={blog.title} />
            <h2>{blog.title}</h2>
            <p>{blog.description}</p>
          </article>
        ))}
      </section>
    </main>
  );
};

export default BlogPage;
