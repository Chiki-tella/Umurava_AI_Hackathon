import dotenv from 'dotenv';
import { connectDatabase } from './config/db';
import { Job } from './models/job.model';
import { User, Recruiter } from './models/user.model';

dotenv.config();

const resetAndSeed = async () => {
  try {
    await connectDatabase();
    
    // Delete all existing jobs
    await Job.deleteMany({});
    console.log('🗑️ Deleted all existing jobs');
    
    // Create admin account if it doesn't exist
    let admin = await User.findOne({ role: 'admin' });
    if (!admin) {
      admin = new User({
        email: 'admin@talentai.com',
        fullName: 'Platform Administrator',
        password: 'admin123',
        role: 'admin'
      });
      await admin.save();
      console.log('✅ Created admin account: admin@talentai.com / admin123');
    }

    // Create multiple test users for different companies
    const recruiters = [
      { email: 'techcorp@recruiter.com', fullName: 'TechCorp HR', password: 'recruiter123', companyName: 'TechCorp Solutions' },
      { email: 'designhub@recruiter.com', fullName: 'DesignHub Hiring', password: 'recruiter123', companyName: 'DesignHub' },
      { email: 'cloudtech@recruiter.com', fullName: 'CloudTech Talent', password: 'recruiter123', companyName: 'CloudTech Inc' }
    ];

    const createdRecruiters = [];
    for (const recruiterData of recruiters) {
      let recruiter = await Recruiter.findOne({ email: recruiterData.email });
      if (!recruiter) {
        recruiter = new Recruiter({
          email: recruiterData.email,
          fullName: recruiterData.fullName,
          password: recruiterData.password,
          role: 'recruiter',
          companyName: recruiterData.companyName
        });
        await recruiter.save();
        console.log(`✅ Created recruiter: ${recruiterData.email} / ${recruiterData.password}`);
      } else {
        console.log(`📋 Found existing recruiter: ${recruiterData.email}`);
      }
      createdRecruiters.push(recruiter);
    }

    // Create job seeker accounts for testing
    const jobSeekers = [
      { email: 'john.developer@email.com', fullName: 'John Developer', password: 'seeker123' },
      { email: 'sarah.designer@email.com', fullName: 'Sarah Designer', password: 'seeker123' },
      { email: 'mike.backend@email.com', fullName: 'Mike Backend', password: 'seeker123' },
      { email: 'emma.fullstack@email.com', fullName: 'Emma Fullstack', password: 'seeker123' },
      { email: 'alex.devops@email.com', fullName: 'Alex DevOps', password: 'seeker123' }
    ];

    for (const seekerData of jobSeekers) {
      let seeker = await User.findOne({ email: seekerData.email });
      if (!seeker) {
        seeker = new User({
          email: seekerData.email,
          fullName: seekerData.fullName,
          password: seekerData.password,
          role: 'jobseeker'
        });
        await seeker.save();
        console.log(`✅ Created job seeker: ${seekerData.email} / ${seekerData.password}`);
      }
    }

    // Create sample jobs assigned to specific company recruiters
    const techCorpRecruiter = createdRecruiters.find(r => r.companyName === 'TechCorp Solutions');
    const designHubRecruiter = createdRecruiters.find(r => r.companyName === 'DesignHub');
    const cloudTechRecruiter = createdRecruiters.find(r => r.companyName === 'CloudTech Inc');

    // Ensure all required recruiters exist
    if (!techCorpRecruiter || !designHubRecruiter || !cloudTechRecruiter) {
      throw new Error('Missing required recruiters for job creation');
    }

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
        experience: '5+ years of frontend development experience with React and TypeScript',
        education: 'Bachelor\'s degree in Computer Science or related field',
        createdBy: techCorpRecruiter._id,
        status: 'open'
      },
      {
        title: 'Backend Engineer',
        description: 'Join our backend team to build scalable APIs and services. Experience with Node.js, Express, and MongoDB required.',
        requiredSkills: ['Node.js', 'Express', 'MongoDB', 'JavaScript', 'REST APIs'],
        location: 'San Francisco',
        companyName: 'TechCorp Solutions',
        companyWebsite: 'https://techcorp.com',
        salary: '$130,000 - $170,000',
        employmentType: 'full-time',
        experience: '4+ years of backend development experience',
        education: 'Bachelor\'s degree in Computer Science or Engineering',
        createdBy: techCorpRecruiter._id,
        status: 'open'
      },
      {
        title: 'Full Stack Developer',
        description: 'Looking for a versatile Full Stack Developer who can work on both frontend and backend applications. Experience with MERN stack preferred.',
        requiredSkills: ['React', 'Node.js', 'Express', 'MongoDB', 'TypeScript', 'JavaScript'],
        location: 'New York',
        companyName: 'TechCorp Solutions',
        companyWebsite: 'https://techcorp.com',
        salary: '$140,000 - $180,000',
        employmentType: 'full-time',
        experience: '3+ years of full stack development experience',
        education: 'Bachelor\'s degree in Computer Science or related field',
        createdBy: techCorpRecruiter._id,
        status: 'open'
      },
      {
        title: 'Product Designer',
        description: 'We need a creative Product Designer to design beautiful and functional user interfaces. Experience with Figma and design systems required.',
        requiredSkills: ['Figma', 'UI Design', 'UX Design', 'Prototyping', 'Design Systems'],
        location: 'Remote',
        companyName: 'DesignHub',
        companyWebsite: 'https://designhub.io',
        salary: '$90,000 - $120,000',
        employmentType: 'remote',
        experience: '3+ years of product design experience',
        education: 'Bachelor\'s degree in Design, HCI, or related field',
        createdBy: designHubRecruiter._id,
        status: 'open'
      },
      {
        title: 'DevOps Engineer',
        description: 'Seeking a DevOps Engineer to manage our cloud infrastructure and CI/CD pipelines. Experience with AWS, Docker, and Kubernetes required.',
        requiredSkills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Linux', 'Python'],
        location: 'Austin',
        companyName: 'CloudTech Inc',
        companyWebsite: 'https://cloudtech.com',
        salary: '$125,000 - $165,000',
        employmentType: 'full-time',
        experience: '4+ years of DevOps experience',
        education: 'Bachelor\'s degree in Computer Science or Information Technology',
        createdBy: cloudTechRecruiter._id,
        status: 'open'
      }
    ];

    await Job.insertMany(sampleJobs);
    console.log(`✅ Successfully created ${sampleJobs.length} sample jobs with rich data`);
    
  } catch (error) {
    console.error('Error in reset and seed:', error);
  } finally {
    process.exit(0);
  }
};

resetAndSeed();
