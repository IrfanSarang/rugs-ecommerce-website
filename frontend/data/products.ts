export interface Product {
    id: number;
    name: string;
    category: string;
    material?: string;
    description: string;
    price: string;
    discountPrice?: string;
    image: string;
    isFeatured?: boolean;
    rating: number;
    stock?: number;
    gallery?: string[];
}

export const products: Product[] = [
    {
        id: 1,
        name: "Superfine Chenille Carpet",
        category: "Living Room",
        material: "Chenille",
        description: "Experience luxury and comfort with the plush, modern Superfine Chenille Carpet.",
        price: "₹12,499",
        image: "/bestseller1.png",
        rating: 5,
        isFeatured: true,
        gallery: ["/bestseller1.png", "/bestseller2.png", "/bestseller3.png"]
    },
    {
        id: 2,
        name: "Urban Arc Modern Area Rug",
        category: "Modern",
        material: "Synthetic",
        description: "A contemporary abstract rug with soft neutral tones and bold curves.",
        price: "₹18,990",
        image: "/bestseller2.png",
        rating: 4
    },
    {
        id: 3,
        name: "Royal Heritage Persian Rug",
        category: "Traditional",
        material: "Silk",
        description: "A richly detailed Persian-inspired rug featuring classic motifs and warm colors.",
        price: "₹85,000",
        image: "/bestseller3.png",
        rating: 5,
        isFeatured: true,
        gallery: ["/bestseller3.png", "/bestseller1.png", "/product9.png"]
    },
    {
        id: 4,
        name: "Hand-Knotted Kashan Rug",
        category: "Traditional",
        material: "Wool",
        description: "Authentic hand-knotted Kashan rug from master weavers using organic dyes.",
        price: "₹1,25,000",
        image: "/traditionalRug.png",
        rating: 5
    },
    {
        id: 5,
        name: "Minimalist Geometry Rug",
        category: "Modern",
        material: "Cotton",
        description: "Perfect for office spaces or minimalist homes. Durable and easy to clean.",
        price: "₹8,500",
        image: "/modernRug.png",
        rating: 4
    },
    {
        id: 6,
        name: "Plush Bedroom Shag Rug",
        category: "Bedroom",
        description: "Soft underfoot, perfect for waking up to a cozy morning.",
        price: "₹6,900",
        image: "/bedroomRug.png",
        rating: 4
    },
    {
        id: 7,
        name: "Masterpiece Silk Inlaid Rug",
        category: "Living Room",
        description: "Luxury rug features silk inlaid borders for a shimmering, premium finish.",
        price: "₹2,45,000",
        image: "/handmadeRug.png",
        rating: 5
    },
    {
        id: 8,
        name: "Traditional Isfahan Rug",
        category: "Traditional",
        description: "Classical Isfahan design, perfect for dining rooms or formal halls.",
        price: "₹1,15,000",
        image: "/livingRoomRug.png",
        rating: 5
    },
    {
        id: 9,
        name: "Sultan's Velvet Silk Rug",
        category: "Traditional",
        description: "A masterpiece of craftsmanship featuring deep velvet red silk and gold highlights.",
        price: "₹1,55,000",
        image: "/product9.png",
        rating: 5
    },
    {
        id: 10,
        name: "Geometric Mirage Abstract Rug",
        category: "Modern",
        description: "Bold geometric patterns in teal and charcoal, perfect for contemporary spaces.",
        price: "₹24,990",
        image: "/product10.png",
        rating: 4
    },
    {
        id: 11,
        name: "Bohemian Harmony Wool Rug",
        category: "Living Room",
        description: "Textured wool with terracotta diamond motifs and organic tassels for a cozy vibe.",
        price: "₹15,400",
        image: "/product11.png",
        rating: 5
    },
    {
        id: 12,
        name: "Nordic Twilight Flatweave",
        category: "Bedroom",
        description: "Minimalist flatweave with a calming gradient, ideal for modern bedrooms.",
        price: "₹12,800",
        image: "/product12.png",
        rating: 4
    }
];
