import dotenv from 'dotenv';
import { connectDatabase } from './config/db';
import Job from './models/job.model';
import User from './models/user.model';

dotenv.config();

const seedJobs = async () => {
  try {
    await connectDatabase();
    
    // Check if we already have jobs
    const existingJobs = await Job.countDocuments();
    if (existingJobs > 0) {
      console.log(`Database already has ${existingJobs} jobs`);
      return;
    }

    // Find a recruiter user or create one
    let recruiter = await User.findOne({ role: 'recruiter' });
    if (!recruiter) {
      recruiter = new User({
        email: 'recruiter@demo.com',
        fullName: 'Demo Recruiter',
        password: 'password123',
        role: 'recruiter',
        companyName: 'TechCorp Solutions'
      });
      await recruiter.save();
    }

    // Create sample jobs
    const sampleJobs = [
      {
        title: 'Senior Frontend Developer',
        description: 'We are looking for an experienced Frontend Developer to join our team. You will be responsible for building responsive web applications using React, TypeScript, and modern CSS frameworks.',
        requiredSkills: ['React', 'TypeScript', 'JavaScript', 'CSS', 'HTML', 'Git'],
        location: 'Remote',
        createdBy: recruiter._id,
        status: 'open'
      },
      {
        title: 'Backend Engineer',
        description: 'Join our backend team to build scalable APIs and services. Experience with Node.js, Express, and MongoDB required.',
        requiredSkills: ['Node.js', 'Express', 'MongoDB', 'JavaScript', 'REST APIs'],
        location: 'San Francisco',
        createdBy: recruiter._id,
        status: 'open'
      },
      {
        title: 'Full Stack Developer',
        description: 'Looking for a versatile Full Stack Developer who can work on both frontend and backend applications. Experience with MERN stack preferred.',
        requiredSkills: ['React', 'Node.js', 'Express', 'MongoDB', 'TypeScript', 'JavaScript'],
        location: 'New York',
        createdBy: recruiter._id,
        status: 'open'
      },
      {
        title: 'Product Designer',
        description: 'We need a creative Product Designer to design beautiful and functional user interfaces. Experience with Figma and design systems required.',
        requiredSkills: ['Figma', 'UI Design', 'UX Design', 'Prototyping', 'Design Systems'],
        location: 'Remote',
        createdBy: recruiter._id,
        status: 'open'
      },
      {
        title: 'DevOps Engineer',
        description: 'Seeking a DevOps Engineer to manage our cloud infrastructure and CI/CD pipelines. Experience with AWS, Docker, and Kubernetes required.',
        requiredSkills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Linux', 'Python'],
        location: 'Austin',
        createdBy: recruiter._id,
        status: 'open'
      }
    ];

    await Job.insertMany(sampleJobs);
    console.log(`Successfully created ${sampleJobs.length} sample jobs`);
    
  } catch (error) {
    console.error('Error seeding jobs:', error);
  } finally {
    process.exit(0);
  }
};

seedJobs();
