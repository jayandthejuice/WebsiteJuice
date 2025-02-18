require('dotenv').config(); // Load .env variables
const mongoose = require('mongoose');
const Classes = require('./models/Classes'); // Adjust the path if necessary

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB connected for seeding!');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

const seedData = async () => {
  try {
    await Classes.deleteMany(); // Clear existing data
    await Classes.create({
      title: 'Sample Class',
      chapters: [
        {
          name: 'Introduction',
          lessons: [
            { title: 'Welcome to the Course', content: 'This is the first lesson' },
            { title: 'Getting Started', content: 'Basics of the course' },
          ],
        },
      ],
    });
    console.log('Data seeded successfully!');
    mongoose.connection.close();
  } catch (err) {
    console.error('Seeding error:', err);
    mongoose.connection.close();
  }
};

seedData();
