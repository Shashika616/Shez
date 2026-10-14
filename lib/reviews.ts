// Sample reviews for the prototype. Replace with genuine customer reviews before launch.
export type Review = {
  name: string;
  city: string;
  rating: number;
  title: string;
  body: string;
  product: string;
  image?: string;
};

export const reviews: Review[] = [
  {
    name: "Nethmi P.",
    city: "Colombo",
    rating: 5,
    title: "Felt like it was made for me",
    body: "The Azure mini fits like it was tailored. The tie straps are genius and the cotton feels expensive. Cash on delivery made it so easy.",
    product: "Azure Tiered Mini",
    image: "/images/d1.jpg",
  },
  {
    name: "Amaya R.",
    city: "Kandy",
    rating: 5,
    title: "The ruffle is everything",
    body: "I've worn the Céleste bardot three times in one week. It moves beautifully and doesn't slip down. Packaging was gorgeous too.",
    product: "Céleste Ruffle Bardot",
    image: "/images/t4.jpg",
  },
  {
    name: "Dilini S.",
    city: "Galle",
    rating: 5,
    title: "Quality I didn't expect",
    body: "Ordered via bank transfer. They confirmed on WhatsApp within the hour and it arrived in two days. The linen is so soft.",
    product: "Flax Rope-Belt Dress",
  },
  {
    name: "Sarah K.",
    city: "Negombo",
    rating: 4,
    title: "Gorgeous satin",
    body: "The mocha wrap dress photographs beautifully. I sized up for a relaxed fit, and their sizing advice on chat was spot on.",
    product: "Mocha Satin Wrap",
    image: "/images/d9.jpg",
  },
  {
    name: "Ishara W.",
    city: "Colombo",
    rating: 5,
    title: "My new everyday hoops",
    body: "Light, chunky and they haven't tarnished. I bought a second pair as a gift for my sister.",
    product: "Twisted Gold Hoops",
  },
  {
    name: "Tharushi M.",
    city: "Kurunegala",
    rating: 5,
    title: "Stripes done right",
    body: "The Riviera top is the perfect weight, not see-through at all. It looks even better in person than on the site.",
    product: "Riviera Stripe Bardot",
    image: "/images/rv1.jpg",
  },
  {
    name: "Hannah D.",
    city: "Matara",
    rating: 5,
    title: "Wedding guest approved",
    body: "Wore the Noir column to a wedding and got stopped five times. The bias cut is incredibly flattering.",
    product: "Noir Satin Column",
  },
  {
    name: "Rashmi F.",
    city: "Colombo",
    rating: 5,
    title: "Thoughtful, start to finish",
    body: "A handwritten note, tissue wrap and a dried flower in the box. It felt like opening a gift to myself.",
    product: "Ivory Eyelet Blouse",
    image: "/images/t6.jpg",
  },
];

export const ratingSummary = { average: 4.9, count: 1240 };
