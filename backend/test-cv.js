const fs = require('fs');
const path = require('path');
// Since it's a TS project, I might need to require the compiled JS or use ts-node properly.
// But I can just use pdf-parse directly here to see what it sees.
const pdfParse = require('pdf-parse');

async function test() {
    const cvPath = 'uploads/cvs/cv-1777630378867-894483642.pdf';
    const fullPath = path.resolve(process.cwd(), cvPath);
    
    if (!fs.existsSync(fullPath)) {
        console.error('File not found:', fullPath);
        return;
    }
    
    const buffer = fs.readFileSync(fullPath);
    const data = await pdfParse(buffer);
    const text = data.text;
    
    console.log('--- RAW TEXT ---');
    console.log(text);
    
    // Improved portfolio detection logic
    function extractPortfolio(text) {
        const urlRegex = /https?:\/\/(?!github|linkedin)[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?:\/[^\s]*)?/gi;
        const matches = text.match(urlRegex);
        if (matches) return matches[0];

        const commonPortfolioDomains = [
            /(?:www\.)?behance\.net\/[a-zA-Z0-9._-]+/gi,
            /(?:www\.)?dribbble\.com\/[a-zA-Z0-9._-]+/gi,
            /(?:www\.)?adobeportfolio\.com\/[a-zA-Z0-9._-]+/gi,
            /(?:www\.)?carbonmade\.com\/[a-zA-Z0-9._-]+/gi,
            /(?:www\.)?wixsite\.com\/[a-zA-Z0-9._-]+/gi
        ];

        for (const domainRegex of commonPortfolioDomains) {
            const domainMatch = text.match(domainRegex);
            if (domainMatch) {
                return `https://${domainMatch[0]}`;
            }
        }
        return undefined;
    }

    const portfolio = extractPortfolio(text);
    console.log('--- DETECTED PORTFOLIO ---');
    console.log(portfolio);
}

test().catch(console.error);
