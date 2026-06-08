const mongoose = require("mongoose");
require("dotenv").config();
const Food = require("./models/Food");
const Category = require("./models/Category");

const seedFoods = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    await Food.deleteMany({});
    await Category.deleteMany({});
    console.log("🗑️  Cleared existing foods and categories");

    // ── Create Categories ──────────────────────────────────────────
    const categoryData = [
      { name: "Burgers" },
      { name: "Pizza" },
      { name: "Sandwiches" },
      { name: "Drinks" },
      { name: "Desserts" },
      { name: "Beverages" },
      { name: "Pasta" },
      { name: "Salads" },
    ];

    const categories = await Category.insertMany(categoryData);
    const cat = {};
    categories.forEach((c) => { cat[c.name] = c._id; });

    // ── Seed Foods ─────────────────────────────────────────────────
    const foods = [
      // ── BURGERS ─────────────────────────────────────────────────
      {
        name: "Signature Chicken Burger",
        description: "Juicy grilled chicken with lettuce, tomato, and our secret sauce on a toasted brioche bun.",
        price: 450,
        oldPrice: 600,
        discount: 25,
        isOffer: true,
        rating: 4.5,
        calories: 620,
        prepTime: "20 min",
        category: cat["Burgers"],
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500",
        availability: true,
      },
      {
        name: "Beef Burger",
        description: "Loaded beef burger with cheese, caramelised onions and special sauce.",
        price: 550,
        oldPrice: 700,
        discount: 21,
        isOffer: true,
        rating: 4.7,
        calories: 750,
        prepTime: "20 min",
        category: cat["Burgers"],
        image: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=500",
        availability: true,
      },
      {
        name: "Double Smash Burger",
        description: "Two smashed beef patties with American cheese, pickles and special sauce.",
        price: 750,
        oldPrice: 950,
        discount: 21,
        isOffer: false,
        rating: 4.8,
        calories: 950,
        prepTime: "25 min",
        category: cat["Burgers"],
        image: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=500",
        availability: true,
      },
      {
        name: "Crispy Zinger Burger",
        description: "Crispy fried chicken fillet with coleslaw and zinger mayo.",
        price: 500,
        oldPrice: 650,
        discount: 23,
        isOffer: true,
        rating: 4.6,
        calories: 700,
        prepTime: "20 min",
        category: cat["Burgers"],
        image: "https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=500",
        availability: true,
      },

      // ── PIZZA ────────────────────────────────────────────────────
      {
        name: "Margherita Pizza (12\")",
        description: "Classic margherita with fresh mozzarella, basil and rich tomato sauce.",
        price: 1100,
        oldPrice: 1400,
        discount: 21,
        isOffer: true,
        rating: 4.8,
        calories: 980,
        prepTime: "30 min",
        category: cat["Pizza"],
        image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500",
        availability: true,
      },
      {
        name: "Spicy Chicken BBQ Pizza",
        description: "Spicy chicken chunks, BBQ drizzle, jalapeños and mozzarella.",
        price: 1300,
        oldPrice: 1700,
        discount: 24,
        isOffer: true,
        rating: 4.7,
        calories: 1100,
        prepTime: "32 min",
        category: cat["Pizza"],
        image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500",
        availability: true,
      },
      {
        name: "Chicken Fajita Pizza",
        description: "Grilled chicken, capsicum, onion and fajita sauce on a crispy base.",
        price: 1250,
        oldPrice: 1600,
        discount: 22,
        isOffer: false,
        rating: 4.6,
        calories: 1050,
        prepTime: "30 min",
        category: cat["Pizza"],
        image: "https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=500",
        availability: true,
      },
      {
        name: "BBQ Beef Pizza",
        description: "Minced beef, BBQ sauce, onions and double cheese.",
        price: 1400,
        oldPrice: 1800,
        discount: 22,
        isOffer: false,
        rating: 4.5,
        calories: 1200,
        prepTime: "35 min",
        category: cat["Pizza"],
        image: "https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=500",
        availability: true,
      },

      // ── SANDWICHES ───────────────────────────────────────────────
      {
        name: "Club Sandwich",
        description: "Triple layer sandwich with chicken, egg, lettuce and tomato.",
        price: 400,
        oldPrice: 550,
        discount: 27,
        isOffer: true,
        rating: 4.3,
        calories: 520,
        prepTime: "15 min",
        category: cat["Sandwiches"],
        image: "https://images.unsplash.com/photo-1481070414801-51fd732d7184?w=500",
        availability: true,
      },
      {
        name: "Beef Shawarma",
        description: "Tender beef with garlic sauce, pickles and fries wrapped in a soft paratha.",
        price: 350,
        oldPrice: 450,
        discount: 22,
        isOffer: true,
        rating: 4.7,
        calories: 600,
        prepTime: "15 min",
        category: cat["Sandwiches"],
        image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=500",
        availability: true,
      },
      {
        name: "Grilled Chicken Wrap",
        description: "Grilled chicken strips with fresh veggies and garlic mayo in a tortilla wrap.",
        price: 380,
        oldPrice: 500,
        discount: 24,
        isOffer: false,
        rating: 4.4,
        calories: 480,
        prepTime: "15 min",
        category: cat["Sandwiches"],
        image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=500",
        availability: true,
      },

      // ── DRINKS ───────────────────────────────────────────────────
      {
        name: "Mango Shake",
        description: "Fresh mango blended with creamy milk and a hint of sugar.",
        price: 250,
        oldPrice: 350,
        discount: 29,
        isOffer: true,
        rating: 4.9,
        calories: 320,
        prepTime: "5 min",
        category: cat["Drinks"],
        image: "https://images.unsplash.com/photo-1546173159-315724a31696?w=500",
        availability: true,
      },
      {
        name: "Strawberry Smoothie",
        description: "Fresh strawberries blended with yogurt and honey.",
        price: 280,
        oldPrice: 380,
        discount: 26,
        isOffer: false,
        rating: 4.6,
        calories: 280,
        prepTime: "5 min",
        category: cat["Drinks"],
        image: "https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=500",
        availability: true,
      },
      {
        name: "Fresh Lemonade",
        description: "Freshly squeezed lemons with mint and a pinch of salt.",
        price: 150,
        oldPrice: 200,
        discount: 25,
        isOffer: false,
        rating: 4.5,
        calories: 120,
        prepTime: "5 min",
        category: cat["Drinks"],
        image: "https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=500",
        availability: true,
      },

      // ── DESSERTS ─────────────────────────────────────────────────
      {
        name: "Triple Chocolate Cake",
        description: "Rich chocolate sponge layered with ganache and chocolate buttercream.",
        price: 350,
        oldPrice: 500,
        discount: 30,
        isOffer: true,
        rating: 4.9,
        calories: 540,
        prepTime: "5 min",
        category: cat["Desserts"],
        image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500",
        availability: true,
      },
      {
        name: "Gulab Jamun",
        description: "Soft khoya dumplings soaked in rose-flavoured sugar syrup. Served warm.",
        price: 180,
        oldPrice: 250,
        discount: 28,
        isOffer: false,
        rating: 4.8,
        calories: 380,
        prepTime: "5 min",
        category: cat["Desserts"],
        image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500",
        availability: true,
      },

      // ── PASTA ────────────────────────────────────────────────────
      {
        name: "Creamy Mushroom Pasta",
        description: "Penne in a rich garlic cream sauce with sautéed mushrooms and parmesan.",
        price: 650,
        oldPrice: 850,
        discount: 24,
        isOffer: true,
        rating: 4.6,
        calories: 780,
        prepTime: "25 min",
        category: cat["Pasta"],
        image: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=500",
        availability: true,
      },

      // ── SALADS ───────────────────────────────────────────────────
      {
        name: "Fresh Garden Salad",
        description: "Crisp lettuce, cherry tomatoes, cucumber, olives and house dressing.",
        price: 380,
        oldPrice: 500,
        discount: 24,
        isOffer: true,
        rating: 4.0,
        calories: 320,
        prepTime: "10 min",
        category: cat["Salads"],
        image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500",
        availability: true,
      },

      // ── BEVERAGES ────────────────────────────────────────────────
      {
        name: "Karak Tea",
        description: "Strong desi chai brewed with milk, cardamom and ginger.",
        price: 80,
        oldPrice: 120,
        discount: 33,
        isOffer: false,
        rating: 4.8,
        calories: 90,
        prepTime: "5 min",
        category: cat["Beverages"],
        image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500",
        availability: true,
      },
      {
        name: "Fresh Lime Soda",
        description: "Chilled sparkling water with fresh lime juice and a hint of salt.",
        price: 120,
        oldPrice: 170,
        discount: 29,
        isOffer: false,
        rating: 4.5,
        calories: 60,
        prepTime: "3 min",
        category: cat["Beverages"],
        image: "https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=500",
        availability: true,
      },
    ];

    await Food.insertMany(foods);

    console.log(`✅ Inserted ${foods.length} food items across ${categories.length} categories`);
    console.log("📋 Categories:");
    categories.forEach((c) => console.log(`   - ${c.name}`));
    console.log("🍽️  Run your frontend to see the updated menu!");

  } catch (err) {
    console.error("❌ Seed failed:", err.message);
  } finally {
    await mongoose.disconnect();
  }
};

seedFoods();