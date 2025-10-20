// Script to create sample data for testing
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import models
const Post = require('./models/post');
const User = require('./models/user');

const createSampleData = async () => {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected');

    // Check if any posts already exist
    const existingPosts = await Post.find();
    console.log(`📊 Found ${existingPosts.length} existing posts`);

    if (existingPosts.length > 0) {
      console.log('📝 Posts already exist, skipping sample data creation');
      await mongoose.disconnect();
      return;
    }

    // Find or create a sample user
    let sampleUser = await User.findOne();
    if (!sampleUser) {
      console.log('👤 No users found, creating sample user...');
      sampleUser = await User.create({
        name: 'Sample User',
        email: 'sample@example.com',
        password: '$2a$10$xxxxxxxxxxxxxxxxxxx', // dummy hash
      });
    }
    
    console.log(`👤 Using user: ${sampleUser.name} (${sampleUser._id})`);

    // Create sample thoughts
    const sampleThoughts = [
      {
        user: sampleUser._id,
        content: 'Just had a wonderful day with my little one at the park! 🌳 Anyone else love those simple moments?',
        type: 'thought'
      },
      {
        user: sampleUser._id,
        content: 'Looking for advice on sleep training for a 6-month-old. Any tips from experienced parents?',
        type: 'thought'
      },
      {
        user: sampleUser._id,
        content: 'Feeling grateful for this amazing community of single parents. We support each other! 💪',
        type: 'thought'
      }
    ];

    console.log('💭 Creating sample thoughts...');
    for (const thoughtData of sampleThoughts) {
      await Post.create(thoughtData);
    }

    // Create sample jobs
    const sampleJobs = [
      {
        user: sampleUser._id,
        content: 'Great opportunity for remote work with flexible hours!',
        type: 'job',
        jobDetails: {
          position: 'Remote Customer Support Specialist',
          company: 'FlexWork Inc.',
          location: 'Remote',
          jobType: 'Part-time',
          jobDescription: 'We are looking for a friendly and patient customer support specialist to join our remote team. Perfect for parents who need flexible working hours. Requirements: Good communication skills, basic computer knowledge, and a quiet home office setup.',
          applicationLink: 'https://example.com/apply'
        }
      },
      {
        user: sampleUser._id,
        content: 'Local childcare center hiring. Family-friendly workplace!',
        type: 'job',
        jobDetails: {
          position: 'Early Childhood Educator',
          company: 'Little Steps Daycare',
          location: 'Downtown Community Center',
          jobType: 'Full-time',
          jobDescription: 'Join our team of dedicated childcare professionals. We offer competitive salary, health benefits, and employee childcare discounts. Looking for someone with ECE certification and a passion for working with children aged 2-5.',
          applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
          applicationLink: 'mailto:jobs@littlesteps.com'
        }
      }
    ];

    console.log('💼 Creating sample jobs...');
    for (const jobData of sampleJobs) {
      await Post.create(jobData);
    }

    console.log('✅ Sample data created successfully!');
    
    // Verify the data
    const thoughts = await Post.find({ type: 'thought' });
    const jobs = await Post.find({ type: 'job' });
    
    console.log(`📊 Created ${thoughts.length} thoughts and ${jobs.length} jobs`);
    
  } catch (error) {
    console.error('❌ Error creating sample data:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
};

// Run the script
createSampleData();