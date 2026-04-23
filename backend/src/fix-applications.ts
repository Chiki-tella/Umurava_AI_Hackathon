import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { User } from './models/user.model';
import { Job } from './models/job.model';
import { Application } from './models/application.model';

dotenv.config();

const fixApplications = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-screening');
    console.log('🔗 Connected to MongoDB');

    // 1. Clean up and create recruiters using base User model
    console.log('\n📝 Creating Recruiter Accounts...');
    await User.deleteMany({ role: 'recruiter' });
    
    const recruiters = [
      { email: 'techcorp@recruiter.com', fullName: 'TechCorp HR', password: 'recruiter123', companyName: 'TechCorp Solutions' },
      { email: 'designhub@recruiter.com', fullName: 'DesignHub Hiring', password: 'recruiter123', companyName: 'DesignHub' },
      { email: 'cloudtech@recruiter.com', fullName: 'CloudTech Talent', password: 'recruiter123', companyName: 'CloudTech Inc' }
    ];

    const createdRecruiters: any[] = [];
    for (const recruiterData of recruiters) {
      const hashedPassword = await bcrypt.hash(recruiterData.password, 10);
      const recruiter = new User({
        email: recruiterData.email,
        fullName: recruiterData.fullName,
        password: hashedPassword,
        role: 'recruiter',
        companyName: recruiterData.companyName
      });
      await recruiter.save();
      createdRecruiters.push(recruiter);
      console.log(`✅ Recruiter created: ${recruiterData.email} / ${recruiterData.password}`);
    }

    // 2. Clean up and create jobs with the correct recruiter IDs
    console.log('\n📝 Creating Jobs...');
    await Job.deleteMany({});
    await Application.deleteMany({});

    const sampleJobs = [
      {
        title: 'Senior Frontend Developer',
        description: 'We are looking for an experienced Frontend Developer to join our team. You will be responsible for building responsive web applications using React, TypeScript, and modern CSS frameworks.',
        requiredSkills: ['React', 'TypeScript', 'JavaScript', 'CSS', 'HTML', 'Git'],
        location: 'Remote',
        companyName: 'TechCorp Solutions',
        companyWebsite: 'https://techcorp.com',
        salary: '$120,000 - $160,000',
        employmentType: 'remote',
        experience: '4+ years of frontend development experience',
        education: 'Bachelor\'s degree in Computer Science or related field',
        createdBy: createdRecruiters[0]._id, // TechCorp recruiter
        status: 'open'
      },
      {
        title: 'Product Designer',
        description: 'We need a creative Product Designer to design beautiful and functional user interfaces. Experience with Figma and design systems required.',
        requiredSkills: ['Figma', 'UI Design', 'UX Design', 'Prototyping', 'Design Systems'],
        location: 'Remote',
        companyName: 'DesignHub',
        companyWebsite: 'https://designhub.io',
        salary: '$100,000 - $140,000',
        employmentType: 'full-time',
        experience: '3+ years of product design experience',
        education: 'Bachelor\'s degree in Design or related field',
        createdBy: createdRecruiters[1]._id, // DesignHub recruiter
        status: 'open'
      },
      {
        title: 'Backend Engineer',
        description: 'Looking for a skilled Backend Engineer to build and maintain scalable server-side applications. Experience with Node.js and cloud platforms required.',
        requiredSkills: ['Node.js', 'Express', 'MongoDB', 'AWS', 'Docker', 'TypeScript'],
        location: 'San Francisco',
        companyName: 'CloudTech Inc',
        companyWebsite: 'https://cloudtech.com',
        salary: '$130,000 - $170,000',
        employmentType: 'full-time',
        experience: '4+ years of backend development experience',
        education: 'Bachelor\'s degree in Computer Science or Engineering',
        createdBy: createdRecruiters[2]._id, // CloudTech recruiter
        status: 'open'
      }
    ];

    const createdJobs: any[] = [];
    for (const jobData of sampleJobs) {
      const job = new Job(jobData);
      await job.save();
      createdJobs.push(job);
      console.log(`✅ Job created: ${jobData.title} for ${jobData.companyName}`);
    }

    // 3. Create job seekers
    console.log('\n📝 Creating Job Seeker Accounts...');
    await User.deleteMany({ role: 'jobseeker' });
    
    const jobSeekers = [
      { email: 'john.developer@email.com', fullName: 'John Developer', password: 'seeker123', skills: ['React', 'TypeScript', 'JavaScript', 'Node.js'] },
      { email: 'sarah.designer@email.com', fullName: 'Sarah Designer', password: 'seeker123', skills: ['Figma', 'UI Design', 'UX Design', 'Prototyping'] },
      { email: 'mike.backend@email.com', fullName: 'Mike Backend', password: 'seeker123', skills: ['Node.js', 'Express', 'MongoDB', 'AWS'] }
    ];

    const createdSeekers: any[] = [];
    for (const seekerData of jobSeekers) {
      const hashedPassword = await bcrypt.hash(seekerData.password, 10);
      const seeker = new User({
        email: seekerData.email,
        fullName: seekerData.fullName,
        password: hashedPassword,
        role: 'jobseeker',
        skills: seekerData.skills
      });
      await seeker.save();
      createdSeekers.push(seeker);
      console.log(`✅ Job seeker created: ${seekerData.email} / ${seekerData.password}`);
    }

    console.log('\n🎉 Database fixed successfully!');
    console.log('\n📋 Recruiter Credentials:');
    console.log('1. techcorp@recruiter.com / recruiter123');
    console.log('2. designhub@recruiter.com / recruiter123');
    console.log('3. cloudtech@recruiter.com / recruiter123');
    
    console.log('\n📋 Job Seeker Credentials:');
    console.log('1. john.developer@email.com / seeker123');
    console.log('2. sarah.designer@email.com / seeker123');
    console.log('3. mike.backend@email.com / seeker123');

    console.log('\n📊 Created Jobs:');
    createdJobs.forEach((job, index) => {
      console.log(`${index + 1}. ${job.title} - ${job.companyName} (ID: ${job._id})`);
    });

  } catch (error) {
    console.error('❌ Error fixing applications:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Disconnected from MongoDB');
  }
};

fixApplications();
