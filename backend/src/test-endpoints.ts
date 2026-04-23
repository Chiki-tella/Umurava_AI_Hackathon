import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { User } from './models/user.model';
import { Job } from './models/job.model';
import { Application } from './models/application.model';

dotenv.config();

const testEndpoints = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-screening');
    console.log('🔗 Connected to MongoDB');

    // Test 1: Check if users exist
    console.log('\n🔍 Checking Users...');
    const users = await User.find({});
    console.log(`Found ${users.length} users:`);
    users.forEach((user, index) => {
      console.log(`  ${index + 1}. ${user.fullName} (${user.email}) - Role: ${user.role}`);
    });

    // Test 2: Check if jobs exist
    console.log('\n🔍 Checking Jobs...');
    const jobs = await Job.find({}).populate('createdBy', 'fullName email');
    console.log(`Found ${jobs.length} jobs:`);
    jobs.forEach((job, index) => {
      console.log(`  ${index + 1}. ${job.title} - ${job.companyName} - Owner: ${(job.createdBy as any)?.fullName}`);
    });

    // Test 3: Check if applications exist
    console.log('\n🔍 Checking Applications...');
    const applications = await Application.find({})
      .populate('jobId', 'title companyName')
      .populate('applicantId', 'fullName email');
    console.log(`Found ${applications.length} applications:`);
    applications.forEach((app, index) => {
      console.log(`  ${index + 1}. ${(app.applicantId as any)?.fullName} → ${(app.jobId as any)?.title} - Status: ${app.status}`);
    });

    // Test 4: Create a test application manually
    console.log('\n🧪 Creating Test Application...');
    const jobSeeker = await User.findOne({ role: 'jobseeker' });
    const job = await Job.findOne({});

    if (jobSeeker && job) {
      console.log(`Using job seeker: ${jobSeeker.fullName}`);
      console.log(`Using job: ${job.title}`);

      // Check if already applied
      const existingApp = await Application.findOne({
        jobId: job._id,
        applicantId: jobSeeker._id
      });

      if (existingApp) {
        console.log('❌ Already applied for this job');
      } else {
        const newApplication = await Application.create({
          jobId: job._id,
          applicantId: jobSeeker._id,
          cvUrl: 'test_cv.pdf'
        });
        console.log('✅ Test application created:', newApplication._id);

        // Verify it was saved
        const verifyApp = await Application.findById(newApplication._id)
          .populate('jobId', 'title')
          .populate('applicantId', 'fullName');
        
        console.log('📋 Verification:', {
          applicant: (verifyApp?.applicantId as any)?.fullName,
          job: (verifyApp?.jobId as any)?.title,
          status: verifyApp?.status
        });
      }
    } else {
      console.log('❌ Missing job seeker or job for testing');
    }

    console.log('\n🎉 Endpoint test completed!');

  } catch (error) {
    console.error('❌ Error testing endpoints:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Disconnected from MongoDB');
  }
};

testEndpoints();
