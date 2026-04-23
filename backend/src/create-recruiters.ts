import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { User } from './models/user.model';

dotenv.config();

const createRecruiters = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-screening');
    console.log('🔗 Connected to MongoDB');

    // Delete existing recruiters
    await User.deleteMany({ role: 'recruiter' });
    console.log('🗑️  Deleted existing recruiters');

    const recruiters = [
      { 
        email: 'techcorp@recruiter.com', 
        fullName: 'TechCorp HR', 
        password: 'recruiter123', 
        role: 'recruiter' as const,
        companyName: 'TechCorp Solutions'
      },
      { 
        email: 'designhub@recruiter.com', 
        fullName: 'DesignHub Hiring', 
        password: 'recruiter123', 
        role: 'recruiter' as const,
        companyName: 'DesignHub'
      },
      { 
        email: 'cloudtech@recruiter.com', 
        fullName: 'CloudTech Talent', 
        password: 'recruiter123', 
        role: 'recruiter' as const,
        companyName: 'CloudTech Inc'
      }
    ];

    console.log('\n📝 Creating Recruiter Accounts...');
    
    for (const recruiterData of recruiters) {
      const hashedPassword = await bcrypt.hash(recruiterData.password, 10);
      
      const recruiter = new User({
        email: recruiterData.email,
        fullName: recruiterData.fullName,
        password: hashedPassword,
        role: recruiterData.role,
        companyName: recruiterData.companyName
      });
      
      await recruiter.save();
      console.log(`✅ Recruiter created: ${recruiterData.email} / ${recruiterData.password}`);
    }

    console.log('\n🎉 Recruiter accounts created successfully!');
    console.log('\n📋 Recruiter Credentials:');
    console.log('1. techcorp@recruiter.com / recruiter123');
    console.log('2. designhub@recruiter.com / recruiter123');
    console.log('3. cloudtech@recruiter.com / recruiter123');

  } catch (error) {
    console.error('❌ Error creating recruiters:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Disconnected from MongoDB');
  }
};

createRecruiters();
