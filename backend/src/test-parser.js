const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');

async function extractSkillsFromText(text) {
    const COMMON_SKILLS = ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Express', 'MongoDB'];
    const textLower = text.toLowerCase();
    const foundSkills = [];
    for (const skill of COMMON_SKILLS) {
        if (textLower.includes(skill.toLowerCase())) {
            foundSkills.push(skill);
        }
    }
    return foundSkills;
}

async function parseComprehensiveCV(cvBuffer) {
    try {
        const data = await pdfParse(cvBuffer);
        const text = data.text;
        const cvData = {
            skills: await extractSkillsFromText(text),
            rawText: text
        };
        return cvData;
    } catch (error) {
        console.error('Error parsing CV:', error);
        return { skills: [], rawText: '' };
    }
}

async function testParser() {
    try {
        // Simple fake PDF buffer
        const buffer = Buffer.from('%PDF-1.4\n1 0 obj\n<< /Title (Test CV) >>\nendobj\ntrailer\n<< /Root 1 0 R >>\n%%EOF');
        const data = await parseComprehensiveCV(buffer);
        console.log('Parsed data:', data);
    } catch (error) {
        console.error('Parser error:', error);
    }
}

testParser();
