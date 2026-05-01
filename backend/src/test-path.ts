import path from 'path';
const cwd = 'C:\\Projects\\backend';
const cvUrl = '/uploads/cvs/file.pdf';
console.log('Path join result:', path.join(cwd, cvUrl));
console.log('Path join result (removed leading slash):', path.join(cwd, cvUrl.startsWith('/') ? cvUrl.substring(1) : cvUrl));
