import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Category from '../models/Category.js';
import User from '../models/User.js';
import Provider from '../models/Provider.js';
import Service from '../models/Service.js';
import connectDB from '../config/db.js';

dotenv.config();

const categories = [
  {
    name: 'Electrician',
    description: 'Home electrical repairs, installations, and wiring',
    icon: '⚡',
    sortOrder: 1,
  },
  {
    name: 'Plumber',
    description: 'Leak fixes, pipe installations, and water system repairs',
    icon: '🚰',
    sortOrder: 2,
  },
  {
    name: 'Carpenter',
    description: 'Furniture assembly, repair, and woodworking',
    icon: '🪚',
    sortOrder: 3,
  },
  {
    name: 'Painter',
    description: 'Interior and exterior house painting services',
    icon: '🎨',
    sortOrder: 4,
  },
  {
    name: 'Cleaner',
    description: 'Deep home cleaning, sanitation, and dusting services',
    icon: '🧹',
    sortOrder: 5,
  },
  {
    name: 'AC Repair',
    description: 'Air conditioner servicing, repair, and installation',
    icon: '❄️',
    sortOrder: 6,
  },
  {
    name: 'Water Supply',
    description: 'Emergency water tanker and bottle supply delivery',
    icon: '💧',
    sortOrder: 7,
  },
  {
    name: 'Vehicle Mechanic',
    description: 'Car and bike repairs, maintenance, and washes',
    icon: '🚗',
    sortOrder: 8,
  },
];

const seedDB = async () => {
  try {
    await connectDB();
    console.log('Database initialized for seeding...');

    // Clear existing data
    await Category.deleteMany();
    await User.deleteMany();
    await Provider.deleteMany();
    await Service.deleteMany();
    console.log('Existing database collections cleared.');

    // Seed Categories
    const seededCategories = [];
    for (const cat of categories) {
      const created = await Category.create(cat);
      seededCategories.push(created);
    }
    console.log('Categories seeded.');

    // Seed Users
    const adminUser = await User.create({
      name: 'Rozseva Admin',
      email: 'admin@rozseva.com',
      phone: '9999999999',
      password: 'admin123',
      role: 'admin',
      isVerified: true
    });

    const customerUser = await User.create({
      name: 'Amit Sharma',
      email: 'customer@rozseva.com',
      phone: '9876543210',
      password: 'customer123',
      role: 'customer',
      isVerified: true
    });

    const providerUser1 = await User.create({
      name: 'Ramesh Electrician',
      email: 'electrician@rozseva.com',
      phone: '9876543211',
      password: 'provider123',
      role: 'provider',
      isVerified: true
    });

    const providerUser2 = await User.create({
      name: 'Suresh Plumber',
      email: 'plumber@rozseva.com',
      phone: '9876543212',
      password: 'provider123',
      role: 'provider',
      isVerified: true
    });

    console.log('Users created.');

    // Seed Providers
    const provider1 = await Provider.create({
      user: providerUser1._id,
      skills: ['Electrician', 'Wiring', 'Inverter repair'],
      bio: 'Expert electrician with 8+ years of residential and commercial experience.',
      experience: 8,
      serviceArea: { city: 'Mumbai', radius: 10 },
      isApproved: true,
      status: 'approved',
      rating: 4.8,
      totalReviews: 12
    });

    const provider2 = await Provider.create({
      user: providerUser2._id,
      skills: ['Plumber', 'Leak detection', 'Pipe installation'],
      bio: 'Professional plumber specializing in emergency water leaks and fittings.',
      experience: 5,
      serviceArea: { city: 'Mumbai', radius: 15 },
      isApproved: true,
      status: 'approved',
      rating: 4.5,
      totalReviews: 8
    });

    console.log('Provider profiles created.');

    // Seed Services
    const electricianCategory = seededCategories.find(c => c.name === 'Electrician');
    const plumberCategory = seededCategories.find(c => c.name === 'Plumber');

    await Service.create({
      provider: provider1._id,
      category: electricianCategory._id,
      title: 'Full House Electrical Inspection & Wiring Repair',
      description: 'Comprehensive checkup of all fuses, switchboards, wiring systems, and earthing. Fixes short circuits, loose connections, and installs switchboards.',
      price: 499,
      priceType: 'fixed',
      duration: 90,
      isActive: true,
      isEmergency: false
    });

    await Service.create({
      provider: provider1._id,
      category: electricianCategory._id,
      title: 'Emergency Short Circuit Fix',
      description: 'Rapid dispatch electrician to locate and repair critical electrical faults, power outages, and tripped MCBs.',
      price: 799,
      priceType: 'fixed',
      duration: 45,
      isActive: true,
      isEmergency: true
    });

    await Service.create({
      provider: provider2._id,
      category: plumberCategory._id,
      title: 'Complete Bathroom Leak Repair & Pipe Fitting',
      description: 'Locates and plugs hidden water leaks under basins, tiling, and taps. Installs new pipes, showers, and water faucets.',
      price: 399,
      priceType: 'fixed',
      duration: 120,
      isActive: true,
      isEmergency: false
    });

    console.log('Services seeded.');
    console.log('Database seeding successfully finished!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedDB();
