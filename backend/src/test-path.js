const path = require('path');
const cwd = 'D:\\Projects\\AI-Screening II\\Umurava_AI_Hackathon\\backend';
const cvUrl = '/uploads/cvs/file.pdf';
console.log('Path join result:', path.join(cwd, cvUrl));
console.log('Path join result (removed leading slash):', path.join(cwd, cvUrl.startsWith('/') ? cvUrl.substring(1) : cvUrl));
