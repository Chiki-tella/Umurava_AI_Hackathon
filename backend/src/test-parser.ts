import fs from 'fs';
import path from 'path';
import { parseComprehensiveCV } from './utils/cvParser';

async function testParser() {
    try {
        // We don't have a real PDF, but let's see what happens with an empty buffer or a fake one
        const buffer = Buffer.from('%PDF-1.4\n1 0 obj\n<< /Title (Test CV) >>\nendobj\ntrailer\n<< /Root 1 0 R >>\n%%EOF');
        const data = await parseComprehensiveCV(buffer);
        console.log('Parsed data:', data);
    } catch (error) {
        console.error('Parser error:', error);
    }
}

testParser();
