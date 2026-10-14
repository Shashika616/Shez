// Store-wide settings. Replace the placeholder contact and bank details before launch.
export const store = {
  name: "Shez",
  tagline: "Wear your story",
  currency: "LKR",
  locale: "en-LK",
  deliveryFee: 450,
  freeDeliveryOver: 25000,
  dispatchDays: "2–4 working days island-wide",
  contact: {
    whatsapp: "+94 77 000 0000",
    email: "hello@shez.store",
    instagram: "@shez.store",
    studio: "Studio Shez, Colombo",
  },
  bank: {
    bankName: "Your Bank PLC",
    branch: "Colombo 07",
    accountName: "Shez (Pvt) Ltd",
    accountNumber: "0000 0000 0000",
  },
} as const;
