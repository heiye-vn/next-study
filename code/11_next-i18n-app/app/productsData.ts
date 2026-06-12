import { routing } from "@/i18n/routing";

export interface Product {
  id: string;
  image: string;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  specs: { display: string; processor: string; memory: string; storage: string };
  features: string[];
}

export const products: Product[] = [
  {
    id: "quantum-laptop",
    image: "💻",
    rating: 4.8,
    reviewCount: 342,
    inStock: true,
    specs: {
      display: '15.6" 4K OLED',
      processor: "Intel Core Ultra 9",
      memory: "32GB LPDDR5X",
      storage: "1TB NVMe SSD",
    },
    features: [
      "Thunderbolt 5",
      "Wi-Fi 7",
      "100W USB-C Charging",
      "Fingerprint Reader",
    ],
  },
  {
    id: "nebula-phone",
    image: "📱",
    rating: 4.6,
    reviewCount: 1287,
    inStock: true,
    specs: {
      display: '6.7" LTPO AMOLED',
      processor: "Snapdragon 8 Gen 4",
      memory: "16GB",
      storage: "256GB",
    },
    features: ["200MP Camera", "AI Photo Engine", "5500mAh Battery", "IP68"],
  },
  {
    id: "aurora-headphones",
    image: "🎧",
    rating: 4.7,
    reviewCount: 856,
    inStock: true,
    specs: {
      display: "N/A",
      processor: "Custom Audio DSP",
      memory: "N/A",
      storage: "N/A",
    },
    features: [
      "Active Noise Cancellation",
      "Spatial Audio",
      "40h Battery",
      "Multipoint",
    ],
  },
  {
    id: "stellar-watch",
    image: "⌚",
    rating: 4.5,
    reviewCount: 623,
    inStock: false,
    specs: {
      display: '1.9" Always-On AMOLED',
      processor: "S9 SiP",
      memory: "2GB",
      storage: "64GB",
    },
    features: [
      "Heart Rate + SpO2",
      "GPS + Cellular",
      "5ATM Water Resist",
      "Sleep Tracking",
    ],
  },
];
