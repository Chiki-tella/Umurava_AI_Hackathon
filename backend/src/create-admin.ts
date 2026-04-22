import dotenv from 'dotenv';
import { connectDatabase } from './config/db';
import { User } from './models/user.model';
import bcrypt from 'bcrypt';

dotenv.config();

const createAdmin = async () => {
  try {
    await connectDatabase();
    
    // Delete any existing admin to ensure clean creation
    await User.deleteMany({ role: 'admin' });
    console.log('🗑️ Cleared existing admin accounts');
    
    // Create admin with base User model
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const admin = new User({
      email: 'admin@talentai.com',
      fullName: 'Platform Administrator',
      password: hashedPassword,
      role: 'admin'
    });
    
    await admin.save();
    console.log('✅ Created admin account:');
    console.log('   Email: admin@talentai.com');
    console.log('   Password: admin123');
    console.log('   Role: admin');
    console.log('   ID:', admin._id);
    
    // Verify the admin was created
    const verifyAdmin = await User.findOne({ email: 'admin@talentai.com' });
    if (verifyAdmin) {
      console.log('✅ Admin account verified in database');
    } else {
      console.log('❌ Admin account not found in database');
    }
    
  } catch (error) {
    console.error('Error creating admin:', error);
  } finally {
    process.exit(0);
  }
};

createAdmin();
