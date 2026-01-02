import Carousel from "@/components/Carousel/Carousel";

interface Category {
  id: number;
  title: string;
  image: string;
}
interface bestSellers {
  id: number;
  image: string;
  name: string;
  description: string;
}

const page = () => {
  const images = ["/Banner1.png", "/Banner2.png", "/Banner3.png"];
  const categories: Category[] = [
    {
      id: 1,
      title: "Living Room",
      image: "/livingRoomRug.png",
    },
    {
      id: 2,
      title: "Bedroom",
      image: "/bedroomRug.png",
    },
    {
      id: 3,
      title: "Handmade",
      image: "/handmadeRug.png",
    },

    {
      id: 4,
      title: "Modern",
      image: "modernRug.png",
    },
    {
      id: 5,
      title: "Traditional",
      image: "/traditionalRug.png",
    },
  ];

  const bestSellers: bestSellers[] = [
    {
      id: 1,
      image: "/bestseller1.png",
      name: "Superfine Chenille Carpet ",
      description:
        "Experience luxury and comfort with the plush, modern Superfine Chenille Carpet, perfect for any room.",
    },
    {
      id: 2,
      image: "/bestseller2.png",
      name: "Urban Arc Modern Area Rug",
      description:
        "A contemporary abstract rug with soft neutral tones and bold curves, perfect for adding modern elegance to any living space.",
    },
    {
      id: 3,
      image: "/bestseller3.png",
      name: "Royal Heritage Persian Rug",
      description:
        "A richly detailed Persian-inspired rug featuring classic motifs and warm colors that bring timeless luxury to your home.",
    },
  ];

  return (
    <main className="container">
      <Carousel images={images} height="450px" />

      {/* Category Section */}
      <section className="category">
        <h1>Shop By Categories</h1>

        <div className="category-grid">
          {categories.map((category) => (
            <div className="category-card" key={category.id}>
              <img src={category.image} alt={category.title} />
              <h3>{category.title}</h3>
            </div>
          ))}
        </div>
      </section>

      {/*Best Sellers Section*/}
      <section className="bestSellers">
        <h1>Best Sellers</h1>

        <div className="bestSellers-container">
          {bestSellers.map((bestSeller) => (
            <div key={bestSeller.id} className="bestSellers-card">
              <img src={bestSeller.image} alt={bestSeller.name} />
              <h3>{bestSeller.name}</h3>
              <p>{bestSeller.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="whyChooseUs">
        <h3>Why Choose Us</h3>

        <div className="whyChooseUs-grid">
          <div className="whyCard">HandCrafted Quality</div>
          <div className="whyCard">Fast Delivery</div>
          <div className="whyCard">Easy Return</div>
          <div className="whyCard">Secure Payments</div>
          <div className="whyCard">Premium</div>
          <div className="whyCard">Trusted By 10,000+ Customers</div>
        </div>
      </section>

      <section className="testimonials">
        <h1>Testimonials</h1>

        <div className="testimonials-grid">
          <div className="testimonial-card">
            <p>
              "Excellent quality rug! The texture and colors are exactly as
              shown."
            </p>
            <h4>— Irfan Sarang</h4>
          </div>

          <div className="testimonial-card">
            <p>
              "Fast delivery and premium finishing. Totally worth the price."
            </p>
            <h4>— Danish Shaikh</h4>
          </div>

          <div className="testimonial-card">
            <p>
              "Beautiful design and very soft underfoot. My living room looks
              amazing."
            </p>
            <h4>— Anurag Dubey</h4>
          </div>
        </div>
      </section>
    </main>
  );
};

export default page;
