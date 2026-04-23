import mongoose from 'mongoose';
import { JobSeeker } from './models/user.model';
require('dotenv').config();

async function updateSkills() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/talentai');
        console.log('Connected to MongoDB');

        // Find all job seekers and update their skills with DevOps skills
        const jobSeekers = await JobSeeker.find({});
        console.log(`Found ${jobSeekers.length} job seekers`);

        for (const seeker of jobSeekers) {
            const devOpsSkills = [
                'AWS', 'Docker', 'Kubernetes', 'CI/CD', 
                'Jenkins', 'GitLab CI', 'Terraform', 'Ansible',
                'Linux', 'Bash scripting', 'Python', 'Node.js'
            ];
            
            await JobSeeker.findByIdAndUpdate(
                seeker._id,
                { skills: devOpsSkills },
                { new: true }
            );
            
            console.log(`✅ Updated skills for: ${seeker.fullName}`);
        }

        console.log('🎉 All job seekers updated with DevOps skills!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error updating skills:', error);
        process.exit(1);
    }
}

updateSkills();
