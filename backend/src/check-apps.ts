import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const ApplicationSchema = new mongoose.Schema({
    jobId: mongoose.Schema.Types.ObjectId,
    applicantId: mongoose.Schema.Types.ObjectId,
    cvUrl: String,
    score: Number,
    aiSummary: String
}, { strict: false });

const Application = mongoose.model('Application', ApplicationSchema);

async function checkApplications() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/talentai');
        console.log('Connected to MongoDB');

        const applications = await Application.find({}).limit(5);
        console.log(`Found ${applications.length} applications`);

        applications.forEach((app, i) => {
            console.log(`\nApplication ${i + 1}:`);
            console.log(`  ID: ${app._id}`);
            console.log(`  cvUrl: ${app.cvUrl}`);
            console.log(`  score: ${app.score}`);
            if (app.aiSummary) {
                console.log(`  aiSummary (first 100 chars): ${app.aiSummary.substring(0, 100)}...`);
            }
        });

        await mongoose.disconnect();
    } catch (error) {
        console.error('Error:', error);
    }
}

checkApplications();
