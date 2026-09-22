import fs from "fs";
import path from "path";
import mongoose from "mongoose";

// Safe fallback: load .env.local if MONGODB_URI is not set in environment
if (!process.env.MONGODB_URI) {
  const envPath = path.resolve(process.cwd(), ".env.local");
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, "utf-8").split("\n");
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith("#")) {
        const [key, ...rest] = trimmed.split("=");
        if (key && rest.length > 0) {
          process.env[key.trim()] = rest.join("=").replace(/^["']|["']$/g, "").trim();
        }
      }
    }
  }
}

// Import existing database connection and model
import connectDB from "../lib/mongodb.js";
import Product from "../lib/Product.js";

// 12 distinct, realistic products strictly matching the Product schema (name, price, description, image)
const seedProducts = [
  {
    name: "Wireless Active Noise-Cancelling Headphones",
    price: 129.99,
    description: "Premium over-ear wireless headphones with active noise cancellation, 40-hour battery life, and crystal-clear audio fidelity.",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80",
  },
  {
    name: "Minimalist Chronograph Leather Watch",
    price: 89.99,
    description: "Classic unisex wristwatch featuring a genuine leather band, scratch-resistant sapphire glass, and Japanese quartz movement.",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80",
  },
  {
    name: "Canvas Everyday Commuter Backpack",
    price: 64.99,
    description: "Water-resistant canvas backpack equipped with a padded 15-inch laptop sleeve, ergonomic straps, and quick-access pockets.",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80",
  },
  {
    name: "Compact Mechanical Gaming Keyboard",
    price: 109.99,
    description: "Compact 75% mechanical keyboard with hot-swappable switches, sound-dampening foam, and customizable RGB backlighting.",
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80",
  },
  {
    name: "Matte Ceramic Pour-Over Coffee Dripper",
    price: 28.5,
    description: "Artisan handcrafted ceramic dripper designed for optimal thermal stability and extraction of specialty coffee beans.",
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80",
  },
  {
    name: "Smart Fitness Tracker & Heart Rate Band",
    price: 49.99,
    description: "Sleek water-resistant activity band with 24/7 heart rate monitoring, sleep staging, and 14-day standby battery.",
    image: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=600&auto=format&fit=crop&q=80",
  },
  {
    name: "Nordic Minimalist Wood Desk Lamp",
    price: 44.99,
    description: "Dimmable minimalist LED desk lamp with solid wood base, touch sensor controls, and warm flicker-free illumination.",
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&auto=format&fit=crop&q=80",
  },
  {
    name: "Top-Grain Leather RFID Bi-Fold Wallet",
    price: 34.0,
    description: "Ultra-slim RFID-blocking pocket wallet crafted from vegetable-tanned full grain leather with 8 card slots.",
    image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&auto=format&fit=crop&q=80",
  },
  {
    name: "Insulated Stainless Steel Water Bottle (750ml)",
    price: 24.99,
    description: "Double-wall vacuum insulated flask keeping beverages cold for 24 hours or piping hot for 12 hours. BPA-free.",
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&auto=format&fit=crop&q=80",
  },
  {
    name: "Portable Waterproof Outdoor Bluetooth Speaker",
    price: 54.99,
    description: "Rugged IPX7 waterproof outdoor speaker delivering rich 360-degree bass and 16 hours of continuous playtime.",
    image: "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600&auto=format&fit=crop&q=80",
  },
  {
    name: "Classic Aviator Polarized Sunglasses",
    price: 39.5,
    description: "Timeless metal frame sunglasses featuring 100% UV400 polarized lenses for glare reduction and crystal clarity.",
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&auto=format&fit=crop&q=80",
  },
  {
    name: "Natural Scented Soy Aromatherapy Candle",
    price: 19.99,
    description: "Hand-poured non-toxic scented candle infused with lavender, amber, and cedar essential oils. 50-hour clean burn.",
    image: "https://images.unsplash.com/photo-1603006905003-be475563bc59?w=600&auto=format&fit=crop&q=80",
  },
];

async function seedDatabase() {
  console.log("Connecting to MongoDB via lib/mongodb.js...");
  await connectDB();
  console.log("Connected to MongoDB successfully.\n");

  // Step 1: Delete existing products
  const deleteResult = await Product.deleteMany({});
  console.log(`✓ Deleted ${deleteResult.deletedCount} old products from database.`);

  // Step 2: Insert new distinct products
  console.log(`Inserting ${seedProducts.length} unique products...`);
  const inserted = await Product.insertMany(seedProducts);
  console.log(`✓ Successfully inserted ${inserted.length} new products:\n`);

  inserted.forEach((p, idx) => {
    console.log(`  ${idx + 1}. [${p._id}] ${p.name} — $${p.price.toFixed(2)}`);
  });

  console.log("\nDatabase seeding completed successfully!");
}

seedDatabase()
  .catch((err) => {
    console.error("❌ Error seeding database:", err);
    process.exit(1);
  })
  .finally(async () => {
    await mongoose.connection.close();
    console.log("Database connection closed.");
    process.exit(0);
  });
