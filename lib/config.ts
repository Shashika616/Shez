// Store-wide settings. Replace the placeholder contact and bank details before launch.
export const store = {
  name: "Shez",
  tagline: "Wear your story",
  currency: "LKR",
  locale: "en-LK",
  deliveryFee: 450,
  freeDeliveryOver: 25000,
  deliveryArea: "within Colombo",
  dispatchDays: "7 to 10 business days",
  dispatchShort: "7 to 10 days",
  contact: {
    whatsapp: "+94 77 000 0000", // placeholder: replace with the real WhatsApp number
    email: "Shezclothing73@gmail.com",
    instagram: "@__shezzz_clothing",
    studio: "Colombo, Sri Lanka",
  },
  // Tracking parameters from the share links are dropped; these are the clean profile URLs.
  social: {
    instagram: "https://instagram.com/__shezzz_clothing",
    facebook: "https://www.facebook.com/share/19fs5L8QYS/",
    tiktok: "https://www.tiktok.com/@shez.clothing",
  },
  bank: {
    bankName: "Your Bank PLC",
    branch: "Colombo 07",
    accountName: "Shez (Pvt) Ltd",
    accountNumber: "0000 0000 0000",
  },
} as const;
