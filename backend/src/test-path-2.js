const path = require('path');
const cwd = 'D:\\Projects\\AI-Screening II\\Umurava_AI_Hackathon\\backend';
const cvUrl = '/uploads/cvs/file.pdf';
console.log('path.join(cwd, cvUrl):', path.join(cwd, cvUrl));
console.log('path.resolve(cwd, cvUrl):', path.resolve(cwd, cvUrl));
console.log('path.join(cwd, cvUrl.replace(/^\\/+/, "")):', path.join(cwd, cvUrl.replace(/^\/+/, '')));
