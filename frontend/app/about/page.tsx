import React from "react";
import "./about.css";

interface makesDifferent {
  id: number;
  name: string;
  description: string;
}

const page = () => {
  const makesDifferent: makesDifferent[] = [
    {
      id: 1,
      name: "Handcrafted Quality",
      description:
        "Every rug is carefully crafted with attention to detail and finish.",
    },
    {
      id: 2,
      name: "Premium Materials",
      description:
        "We use high-quality fibers that feel soft, last longer, and maintain their look.",
    },
    {
      id: 3,
      name: "Cool Designs",
      description: "A curated blend of classic patterns and modern aesthetics.",
    },
    {
      id: 4,
      name: "Fair Pricing",
      description:
        "Luxury rugs offered at honest prices, without unnecessary markups.",
    },
  ];

  return (
    <main>
      <section className="story">
        <h1>Our Story</h1>
        <p>
          We started with a simple belief that a rug is more than just décor. It
          is a foundation that brings warmth, comfort, and balance to a space.
          Inspired by timeless designs and evolving lifestyles, we set out to
          create rugs that truly feel like home.
        </p>
        <p>
          Each rug is thoughtfully crafted using premium materials and skilled
          techniques. From selecting textures to perfecting patterns, every
          detail matters. Our designs blend traditional artistry with modern
          aesthetics, making them suitable for both classic and contemporary
          interiors.
        </p>
        <p>
          Our journey is driven by quality, trust, and customer satisfaction. We
          focus on durability, comfort, and long-lasting beauty. With ethical
          practices and fair pricing at our core, we aim to make elegant rugs
          accessible to every home.
        </p>
      </section>

      <section className="makesDifferent">
        <h1>What Makes Us Different</h1>
        <div className="makesDifferent-container">
          {makesDifferent.map((makesDifferent) => (
            <div key={makesDifferent.id}>
              <h2>{makesDifferent.name}</h2>
              <p>{makesDifferent.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="craftmanship">
        <h1>Craftmanship and Quality</h1>
        <p>
          Every rug is crafted with precision, care, and attention to detail.
        </p>
        <p>
          We begin by selecting premium-quality materials that offer softness
          and strength.
        </p>
        <p>
          Skilled artisans then bring each design to life using refined
          techniques.
        </p>
        <p>
          The result is a rug that combines durability, comfort, and timeless
          beauty.
        </p>
      </section>

      <section className="sustainability">
        <h1>Sustainability & Ethics</h1>

        <p>
          We are committed to responsible practices that respect both people and
          the environment.
        </p>
        <p>
          Our materials are sourced with care to reduce waste and environmental
          impact.
        </p>
        <p>
          We work with skilled artisans and ethical manufacturers who value fair
          working conditions.
        </p>
        <p>
          By focusing on quality over quantity, we create rugs that last longer
          and reduce unnecessary consumption.
        </p>
      </section>
      <section className="mission">
        <h1>Our Mission</h1>

        <p>
          Our mission is to make premium-quality rugs accessible to every home
          while preserving craftsmanship, comfort, and timeless design.
        </p>

        <button className="shop-btn">Shop Now</button>
      </section>
    </main>
  );
};

export default page;
