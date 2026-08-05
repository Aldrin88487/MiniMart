require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const connectDB = require('./config/db');
const Product = require('./models/Product');
const User = require('./models/User');

// Initialize Express app
const app = express();

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(uploadsDir));

// Import Routes
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');

// Mount Routes
// Users: POST /api/register, POST /api/login, GET /api/me
app.use('/api', userRoutes); 

// Products: GET /api/products, POST /api/products, etc.
app.use('/api/products', productRoutes);

// Cart: GET /api/cart, POST /api/cart, etc.
app.use('/api/cart', cartRoutes);

// Seed function to pre-populate database with default products
const seedProducts = async () => {
  try {
    const count = await Product.countDocuments();
    if (count === 0) {
      // Existing product seeding

      const defaultProducts = [
        {
          name: "JavaScript: The Good Parts",
          price: 25.99,
          category: "Books",
          description: "A classic guide on JavaScript, focusing on its best parts and patterns.",
          image: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=500&auto=format&fit=crop&q=60"
        },
        {
          name: "Introduction to Algorithms",
          price: 89.99,
          category: "Books",
          description: "A comprehensive reference and text on modern algorithms, widely used in university classes.",
          image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=500&auto=format&fit=crop&q=60"
        },
        {
          name: "Logitech MX Master 3S",
          price: 99.99,
          category: "Electronics",
          description: "Ergonomic wireless precision mouse with hyper-fast scrolling and quiet clicks.",
          image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500&auto=format&fit=crop&q=60"
        },
        {
          name: "Keychron K2 Keyboard",
          price: 79.99,
          category: "Electronics",
          description: "Compact Bluetooth wireless mechanical keyboard with Gateron switches and aluminum body.",
          image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&auto=format&fit=crop&q=60"
        },
        {
          name: "Classic White T-Shirt",
          price: 19.99,
          category: "Apparel",
          description: "Premium quality 100% organic cotton white t-shirt, relaxed fit.",
          image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&auto=format&fit=crop&q=60"
        },
        {
          name: "Vintage Leather Backpack",
          price: 49.99,
          category: "Apparel",
          description: "Waterproof vintage style business canvas leather backpack, suitable for laptops up to 15.6 inches.",
          image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500&auto=format&fit=crop&q=60"
        }
      ];

      await Product.insertMany(defaultProducts);
      console.log('Database seeded with default products!');
    }
  } catch (error) {
    console.error('Error seeding products:', error);
  }
};

// Seed admin user if not present
const seedAdmin = async () => {
  try {
    const adminEmail = 'admin@minimart.com';
    const adminExists = await User.findOne({ email: adminEmail });
    if (!adminExists) {
      await User.create({
        name: 'Admin',
        email: adminEmail,
        password: 'admin123', // will be hashed by pre-save hook
        role: 'admin'
      });
      console.log('Admin user seeded');
    }
  } catch (error) {
    console.error('Error seeding admin user:', error);
  }
};

// Start Server after connecting to Database
const PORT = process.env.PORT || 5000;

connectDB().then(async () => {
  await seedProducts();
  await seedAdmin();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
