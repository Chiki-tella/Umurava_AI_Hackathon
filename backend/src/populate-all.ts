import dotenv from 'dotenv';
import { connectDatabase } from './config/db';
import { Job } from './models/job.model';
import { User, Recruiter, IRecruiter } from './models/user.model';
import bcrypt from 'bcrypt';

dotenv.config();

const populateAllAccounts = async () => {
  try {
    await connectDatabase();
    
    console.log('🚀 Starting to populate all test accounts...');
    
    // 1. Create Admin Account
    console.log('\n📝 Creating Admin Account...');
    await User.deleteMany({ role: 'admin' });
    const adminHashedPassword = await bcrypt.hash('admin123', 10);
    const admin = new User({
      email: 'admin@talentai.com',
      fullName: 'Platform Administrator',
      password: adminHashedPassword,
      role: 'admin'
    });
    await admin.save();
    console.log('✅ Admin created: admin@talentai.com / admin123');
    
    // 2. Create Recruiter Accounts
    console.log('\n📝 Creating Recruiter Accounts...');
    await User.deleteMany({ role: 'recruiter' });
    
    const recruiters = [
      { email: 'techcorp@recruiter.com', fullName: 'TechCorp HR', password: 'recruiter123', companyName: 'TechCorp Solutions' },
      { email: 'designhub@recruiter.com', fullName: 'DesignHub Hiring', password: 'recruiter123', companyName: 'DesignHub' },
      { email: 'cloudtech@recruiter.com', fullName: 'CloudTech Talent', password: 'recruiter123', companyName: 'CloudTech Inc' }
    ];
    
    const createdRecruiters: IRecruiter[] = [];
    for (const recruiterData of recruiters) {
      const hashedPassword = await bcrypt.hash(recruiterData.password, 10);
      const recruiter = new Recruiter({
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
    
    // 3. Create Job Seeker Accounts
    console.log('\n📝 Creating Job Seeker Accounts...');
    await User.deleteMany({ role: 'jobseeker' });
    
    const jobSeekers = [
      { email: 'john.developer@email.com', fullName: 'John Developer', password: 'seeker123' },
      { email: 'sarah.designer@email.com', fullName: 'Sarah Designer', password: 'seeker123' },
      { email: 'mike.backend@email.com', fullName: 'Mike Backend', password: 'seeker123' },
      { email: 'emma.fullstack@email.com', fullName: 'Emma Fullstack', password: 'seeker123' },
      { email: 'alex.devops@email.com', fullName: 'Alex DevOps', password: 'seeker123' }
    ];
    
    for (const seekerData of jobSeekers) {
      const hashedPassword = await bcrypt.hash(seekerData.password, 10);
      const seeker = new User({
        email: seekerData.email,
        fullName: seekerData.fullName,
        password: hashedPassword,
        role: 'jobseeker'
      });
      await seeker.save();
      console.log(`✅ Job seeker created: ${seekerData.email} / ${seekerData.password}`);
    }
    
    // 4. Delete existing jobs and create new ones
    console.log('\n📝 Creating Jobs...');
    await Job.deleteMany({});
    
    // Find specific recruiters for job assignment
    const techCorpRecruiter = createdRecruiters.find(r => r.companyName === 'TechCorp Solutions');
    const designHubRecruiter = createdRecruiters.find(r => r.companyName === 'DesignHub');
    const cloudTechRecruiter = createdRecruiters.find(r => r.companyName === 'CloudTech Inc');
    
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
    console.log(`✅ Created ${sampleJobs.length} jobs`);
    
    // 5. Summary
    console.log('\n🎉 All accounts and jobs created successfully!');
    console.log('\n📋 Login Credentials:');
    console.log('\n👑 ADMIN:');
    console.log('   Email: admin@talentai.com');
    console.log('   Password: admin123');
    
    console.log('\n🏢 RECRUITERS:');
    console.log('   TechCorp: techcorp@recruiter.com / recruiter123');
    console.log('   DesignHub: designhub@recruiter.com / recruiter123');
    console.log('   CloudTech: cloudtech@recruiter.com / recruiter123');
    
    console.log('\n👥 JOB SEEKERS:');
    console.log('   John: john.developer@email.com / seeker123');
    console.log('   Sarah: sarah.designer@email.com / seeker123');
    console.log('   Mike: mike.backend@email.com / seeker123');
    console.log('   Emma: emma.fullstack@email.com / seeker123');
    console.log('   Alex: alex.devops@email.com / seeker123');
    
    console.log('\n📊 Jobs Created:');
    console.log('   TechCorp: 3 jobs (Frontend, Backend, Full Stack)');
    console.log('   DesignHub: 1 job (Product Designer)');
    console.log('   CloudTech: 1 job (DevOps Engineer)');
    
  } catch (error) {
    console.error('❌ Error populating accounts:', error);
  } finally {
    process.exit(0);
  }
};

populateAllAccounts();
