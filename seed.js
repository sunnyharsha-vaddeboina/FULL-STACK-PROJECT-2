const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Event = require('./models/Event');
const User = require('./models/User');
const Booking = require('./models/Booking');

dotenv.config();

const sampleEvents = [
  {
    eventName: 'TechFest 2025',
    department: 'Computer Science',
    dateTime: new Date('2025-08-15T10:00:00'),
    venue: 'Main Auditorium, Block A',
    ticketPrice: 199,
    availableTickets: 50,
  },
  {
    eventName: 'AI & ML Seminar',
    department: 'Data Science',
    dateTime: new Date('2025-09-05T14:00:00'),
    venue: 'Seminar Hall 3, Block C',
    ticketPrice: 99,
    availableTickets: 8,
  },
  {
    eventName: 'Cultural Night 2025',
    department: 'Student Affairs',
    dateTime: new Date('2025-10-20T18:00:00'),
    venue: 'Open Air Theatre',
    ticketPrice: 149,
    availableTickets: 120,
  },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB for seeding');

    // Clear existing data
    await Booking.deleteMany({});
    console.log('🗑️  Cleared existing bookings');
    await Event.deleteMany({});
    console.log('🗑️  Cleared existing events');
    await User.deleteMany({});
    console.log('🗑️  Cleared existing users');

    // Seed events
    const createdEvents = await Event.insertMany(sampleEvents);
    console.log(`🌱 Seeded ${createdEvents.length} events:`);
    createdEvents.forEach((e) => {
      console.log(`   • ${e.eventName} (${e.department}) — ₹${e.ticketPrice} — ${e.availableTickets} tickets`);
    });

    // Seed admin user
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@eduticket.com',
      password: 'admin123',
      role: 'admin',
      department: 'Administration',
    });
    console.log(`👑 Admin created: ${admin.email} / admin123`);

    // Seed sample student
    const student = await User.create({
      name: 'John Student',
      email: 'student@eduticket.com',
      password: 'student123',
      role: 'student',
      department: 'Computer Science',
    });
    console.log(`🎓 Student created: ${student.email} / student123`);

    await mongoose.connection.close();
    console.log('✅ Seeding complete. Connection closed.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
};

seedDB();
