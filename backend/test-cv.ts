import fs from 'fs';
import path from 'path';
import { parseComprehensiveCV } from './src/utils/cvParser';

async function test() {
    const cvPath = 'uploads/cvs/cv-1777630378867-894483642.pdf';
    const fullPath = path.resolve(process.cwd(), cvPath);
    
    if (!fs.existsSync(fullPath)) {
        console.error('File not found:', fullPath);
        return;
    }
    
    const buffer = fs.readFileSync(fullPath);
    const data = await parseComprehensiveCV(buffer);
    
    console.log('--- EXTRACTED DATA ---');
    console.log('Portfolio:', data.portfolio);
    console.log('GitHub:', data.github);
    console.log('Education:', JSON.stringify(data.education, null, 2));
    console.log('Skills:', data.skills.join(', '));
    console.log('--- RAW TEXT PREVIEW ---');
    console.log(data.rawText.substring(0, 1000));
}

test().catch(console.error);
