import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import Cart from '../models/Cart.js';

dotenv.config();

const sampleProducts = [
  {
    name: 'AeroSound Pro Wireless ANC Headphones',
    description: 'Industry-leading noise cancellation with spatial audio, ultra-plush memory foam earcups, and up to 40 hours of continuous high-fidelity playback. Features crystal-clear voice beamforming microphones.',
    price: 349.99,
    compareAtPrice: 399.99,
    category: 'Audio',
    brand: 'AeroCraft',
    stock: 24,
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&q=80'
    ],
    rating: 4.9,
    numReviews: 86,
    featured: true,
    tags: ['wireless', 'anc', 'bluetooth', 'audio', 'premium'],
    specs: {
      'Battery Life': '40 Hours',
      'Connectivity': 'Bluetooth 5.3 & 3.5mm Aux',
      'Weight': '250g',
      'Charging': 'USB-C Fast Charging (10m for 5h)'
    }
  },
  {
    name: 'Chronos Ultra Smartwatch Titanium',
    description: 'Forged aerospace-grade titanium chassis with scratch-resistant sapphire crystal display. Always-on AMOLED screen, precision dual-frequency GPS, ECG monitor, sleep stage tracking, and 100m water resistance.',
    price: 499.00,
    compareAtPrice: 549.00,
    category: 'Wearables',
    brand: 'Chronos',
    stock: 18,
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&q=80'
    ],
    rating: 4.8,
    numReviews: 64,
    featured: true,
    tags: ['smartwatch', 'fitness', 'gps', 'titanium'],
    specs: {
      'Display': '1.43" AMOLED 466x466',
      'Water Resistance': '10 ATM (100 meters)',
      'Battery': 'Up to 14 days typical use',
      'Sensors': 'Optical Heart Rate, SpO2, Barometer, ECG'
    }
  },
  {
    name: 'Lumix Mechanical Tactile Keyboard',
    description: 'Custom hot-swappable mechanical switches with south-facing RGB per-key illumination, CNC machined aluminum case, gasket mount system, and wireless Tri-Mode connectivity.',
    price: 189.50,
    compareAtPrice: 219.00,
    category: 'Gaming',
    brand: 'AeroCraft',
    stock: 35,
    images: [
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80',
      'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800&q=80'
    ],
    rating: 4.7,
    numReviews: 42,
    featured: true,
    tags: ['keyboard', 'mechanical', 'rgb', 'gaming'],
    specs: {
      'Layout': '75% Compact (84 keys)',
      'Switches': 'Pre-lubed Tactile Yellow',
      'Battery': '4000mAh Lithium Ion',
      'Connection': '2.4GHz Wireless, Bluetooth 5.1, Type-C'
    }
  },
  {
    name: 'Horizon Minimalist Leather Laptop Sleeve',
    description: 'Handcrafted full-grain vegetable-tanned Italian leather with soft microfiber fleece interior. Includes magnetic flap closure and external stylus/cable pocket. Fits laptops up to 16 inches.',
    price: 79.00,
    compareAtPrice: 95.00,
    category: 'Accessories',
    brand: 'Horizon Craft',
    stock: 45,
    images: [
      'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&q=80',
      'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&q=80'
    ],
    rating: 4.6,
    numReviews: 31,
    featured: false,
    tags: ['leather', 'laptop', 'case', 'minimal'],
    specs: {
      'Material': 'Full-grain Italian Leather',
      'Compatibility': 'MacBook Pro 14"/16", XPS 15',
      'Color': 'Caramel Cognac',
      'Closure': 'Secure Magnetic Snap'
    }
  },
  {
    name: 'Nova Pro Studio 4K Webcam & Ring Light',
    description: 'Crisp 4K 60FPS sensor with AI facial auto-framing, dual noise-reducing stereo microphones, and built-in adjustable soft diffuse ring light for pristine conference calls and streaming.',
    price: 159.99,
    compareAtPrice: 199.99,
    category: 'Electronics',
    brand: 'NovaTech',
    stock: 15,
    images: [
      'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&q=80'
    ],
    rating: 4.7,
    numReviews: 53,
    featured: false,
    tags: ['webcam', '4k', 'streaming', 'work from home'],
    specs: {
      'Resolution': '4K UHD at 60 FPS',
      'Field of View': '90° Wide Angle',
      'Lighting': '3 Color Temp Dimmable LED',
      'Mount': 'Universal Monitor Clip & 1/4" Thread'
    }
  },
  {
    name: 'Apex Precision Ergonomic Wireless Mouse',
    description: 'Natural 57° vertical ergonomic grip that reduces muscle strain by 10%. Equipped with 8,000 DPI Darkfield glass tracking sensor, silent electromagnetic scroll wheel, and multi-device pairing.',
    price: 99.99,
    compareAtPrice: 119.99,
    category: 'Electronics',
    brand: 'AeroCraft',
    stock: 30,
    images: [
      'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&q=80'
    ],
    rating: 4.8,
    numReviews: 78,
    featured: true,
    tags: ['mouse', 'ergonomic', 'office', 'wireless'],
    specs: {
      'DPI': '200 to 8000 DPI adjustable',
      'Battery': '70 days on full charge',
      'Connectivity': 'Bluetooth Low Energy & USB Receiver',
      'Weight': '135g'
    }
  },
  {
    name: 'SoundPulse Portable Hi-Res Waterproof Speaker',
    description: 'Rugged IP67 waterproof and dustproof cylinder speaker packing 360-degree immersive acoustic drivers, punchy dual passive bass radiators, and 24-hour battery endurance.',
    price: 129.00,
    compareAtPrice: 149.00,
    category: 'Audio',
    brand: 'AeroCraft',
    stock: 22,
    images: [
      'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&q=80'
    ],
    rating: 4.5,
    numReviews: 39,
    featured: false,
    tags: ['speaker', 'audio', 'waterproof', 'portable'],
    specs: {
      'Power Output': '30W RMS Stereo',
      'Waterproof Rating': 'IP67 Submersible',
      'Battery': '24 Hours Playtime',
      'Pairing': 'True Wireless Stereo Party Mode'
    }
  },
  {
    name: 'Zenith Magnetic Fast Wireless Charging Stand',
    description: 'Sleek anodized aluminum 3-in-1 wireless dock capable of simultaneously fast-charging your smartphone, smartwatch, and wireless earbuds with integrated thermal dissipation.',
    price: 69.99,
    compareAtPrice: 89.99,
    category: 'Accessories',
    brand: 'Zenith',
    stock: 40,
    images: [
      'https://images.unsplash.com/photo-1622445262464-84b1456045b6?w=800&q=80'
    ],
    rating: 4.7,
    numReviews: 92,
    featured: false,
    tags: ['charging', 'wireless', 'accessories', 'desk'],
    specs: {
      'Output': '15W Phone + 5W Watch + 5W Buds',
      'Input': 'USB-C PD 30W Adapter included',
      'Safety': 'Foreign Object & Over-temp Protection',
      'Material': 'Machined Matte Aluminum'
    }
  },
  {
    name: 'Kanto Solid Walnut Minimalist Desk Shelf',
    description: 'Elevate your monitor to healthy eye level while storing your keyboard and accessories underneath. Handcrafted from solid American Walnut timber with aircraft-grade aluminum legs.',
    price: 149.00,
    compareAtPrice: 179.00,
    category: 'Home Office',
    brand: 'Kanto Studio',
    stock: 12,
    images: [
      'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800&q=80'
    ],
    rating: 4.9,
    numReviews: 47,
    featured: false,
    tags: ['desk', 'wood', 'home office', 'minimalist'],
    specs: {
      'Dimensions': '46" L x 9" W x 4.2" H',
      'Material': 'Solid American Walnut & Aluminum',
      'Load Capacity': 'Up to 75 lbs',
      'Finish': 'Natural Matte Satin Oil'
    }
  },
  {
    name: 'Pulse Pro Fitness Tracker HR Smart Band',
    description: 'Featherlight 24/7 fitness tracker with AMOLED touch display, SpO2 sensor, continuous heart rate monitoring, 120 sports modes, and sleep analysis.',
    price: 59.99,
    compareAtPrice: 79.99,
    category: 'Wearables',
    brand: 'Chronos',
    stock: 4, // low stock test
    images: [
      'https://images.unsplash.com/photo-1576243345690-4e4b79b63288?w=800&q=80'
    ],
    rating: 4.4,
    numReviews: 28,
    featured: false,
    tags: ['fitness', 'tracker', 'wearable', 'health'],
    specs: {
      'Battery': '14 days battery life',
      'Water Resistance': '5 ATM (50 meters)',
      'Display': '1.1" AMOLED',
      'Weight': '21g ultralight'
    }
  }
];

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce_db';
    console.log(`Connecting to MongoDB at: ${mongoUri}`);
    await mongoose.connect(mongoUri);

    console.log('Clearing existing database records...');
    await User.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});
    await Cart.deleteMany({});

    console.log('Creating Admin and Demo Users...');
    const adminUser = await User.create({
      name: 'Store Administrator',
      email: 'admin@store.com',
      password: 'Admin@123',
      role: 'admin',
      addresses: [{
        street: '100 Silicon Blvd, Suite 400',
        city: 'San Francisco',
        state: 'CA',
        postalCode: '94107',
        country: 'United States',
        isDefault: true
      }]
    });

    const demoUser = await User.create({
      name: 'Alex Rivera',
      email: 'alex@store.com',
      password: 'User@123',
      role: 'user',
      addresses: [{
        street: '742 Evergreen Terrace',
        city: 'Springfield',
        state: 'OR',
        postalCode: '97477',
        country: 'United States',
        isDefault: true
      }]
    });

    console.log('Seeding products...');
    const createdProducts = await Product.insertMany(sampleProducts);
    console.log(`✅ Seeded ${createdProducts.length} products`);

    console.log('Creating sample orders for Alex...');
    // Create an order for demo user
    const order1 = await Order.create({
      user: demoUser._id,
      orderItems: [
        {
          product: createdProducts[0]._id,
          name: createdProducts[0].name,
          image: createdProducts[0].images[0],
          price: createdProducts[0].price,
          quantity: 1
        },
        {
          product: createdProducts[3]._id,
          name: createdProducts[3].name,
          image: createdProducts[3].images[0],
          price: createdProducts[3].price,
          quantity: 1
        }
      ],
      shippingAddress: {
        fullName: demoUser.name,
        street: '742 Evergreen Terrace',
        city: 'Springfield',
        state: 'OR',
        postalCode: '97477',
        country: 'United States',
        phone: '+1 (555) 234-5678'
      },
      paymentMethod: 'Credit Card',
      paymentResult: {
        id: 'PAY-SAMPLE-9901',
        status: 'Completed',
        email_address: demoUser.email
      },
      itemsPrice: createdProducts[0].price + createdProducts[3].price,
      shippingPrice: 0,
      taxPrice: Number(((createdProducts[0].price + createdProducts[3].price) * 0.08).toFixed(2)),
      totalPrice: Number(((createdProducts[0].price + createdProducts[3].price) * 1.08).toFixed(2)),
      isPaid: true,
      paidAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      orderStatus: 'Shipped',
      trackingNumber: 'TRK-98214-4910'
    });

    const order2 = await Order.create({
      user: demoUser._id,
      orderItems: [
        {
          product: createdProducts[1]._id,
          name: createdProducts[1].name,
          image: createdProducts[1].images[0],
          price: createdProducts[1].price,
          quantity: 1
        }
      ],
      shippingAddress: {
        fullName: demoUser.name,
        street: '742 Evergreen Terrace',
        city: 'Springfield',
        state: 'OR',
        postalCode: '97477',
        country: 'United States',
        phone: '+1 (555) 234-5678'
      },
      paymentMethod: 'PayPal',
      paymentResult: {
        id: 'PAY-SAMPLE-9902',
        status: 'Completed',
        email_address: demoUser.email
      },
      itemsPrice: createdProducts[1].price,
      shippingPrice: 0,
      taxPrice: Number((createdProducts[1].price * 0.08).toFixed(2)),
      totalPrice: Number((createdProducts[1].price * 1.08).toFixed(2)),
      isPaid: true,
      paidAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
      orderStatus: 'Delivered',
      deliveredAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      trackingNumber: 'TRK-74190-3321'
    });

    // Seed Cart for Alex
    await Cart.create({
      user: demoUser._id,
      items: [
        {
          product: createdProducts[2]._id,
          quantity: 1,
          price: createdProducts[2].price
        }
      ]
    });

    console.log('\n=========================================');
    console.log('🎉 Database Seeding Completed Successfully!');
    console.log('=========================================');
    console.log('Demo Credentials:');
    console.log('👑 Admin:');
    console.log('   Email:    admin@store.com');
    console.log('   Password: Admin@123');
    console.log('👤 Customer:');
    console.log('   Email:    alex@store.com');
    console.log('   Password: User@123');
    console.log('=========================================\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedDatabase();
