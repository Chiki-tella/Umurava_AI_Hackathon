const pdfParse = require('pdf-parse');

// Common tech skills for matching
const COMMON_SKILLS = [
  // Programming Languages
  'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'Go', 'Rust', 'PHP', 'Ruby', 'Swift', 'Kotlin',
  // Frontend
  'React', 'Angular', 'Vue.js', 'HTML', 'CSS', 'SASS', 'Tailwind CSS', 'Bootstrap', 'Next.js', 'Redux',
  // Backend
  'Node.js', 'Express', 'Django', 'Flask', 'Spring Boot', 'Laravel', 'Ruby on Rails', 'ASP.NET',
  // Databases
  'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'Elasticsearch', 'Oracle', 'SQL Server',
  // Cloud & DevOps
  'AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes', 'Jenkins', 'GitLab CI', 'CircleCI', 'Terraform', 'Ansible',
  'CI/CD', 'Linux', 'Bash', 'PowerShell', 'Nginx', 'Apache',
  // Tools & Others
  'Git', 'GitHub', 'GitLab', 'Jira', 'Figma', 'Adobe XD', 'Sketch', 'Slack', 'Jest', 'Cypress', 'Selenium',
  'Webpack', 'Vite', 'Babel', 'ESLint', 'Prettier', 'Agile', 'Scrum',
  // Data Science
  'TensorFlow', 'PyTorch', 'Scikit-learn', 'Pandas', 'NumPy', 'R', 'Tableau', 'Power BI', 'Excel',
  // Mobile
  'React Native', 'Flutter', 'iOS', 'Android', 'Swift', 'Kotlin', 'Xamarin',
  // Other
  'REST APIs', 'GraphQL', 'Microservices', 'Serverless', 'Machine Learning', 'AI', 'Blockchain', 'IoT'
];

// Common languages for matching
const COMMON_LANGUAGES = [
  'English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Russian', 'Chinese', 'Japanese',
  'Korean', 'Arabic', 'Hindi', 'Dutch', 'Swedish', 'Norwegian', 'Danish', 'Finnish', 'Polish', 'Turkish'
];

export interface CVData {
  fullName?: string;
  email?: string;
  phone?: string;
  github?: string;
  linkedin?: string;
  portfolio?: string;
  skills: string[];
  education: EducationEntry[];
  experience: ExperienceEntry[];
  languages: string[];
  summary?: string;
  rawText: string;
}

export interface EducationEntry {
  degree: string;
  institution: string;
  year?: string;
  gpa?: string;
}

export interface ExperienceEntry {
  title: string;
  company: string;
  duration?: string;
  description?: string;
}

export async function extractSkillsFromCV(cvBuffer: Buffer): Promise<string[]> {
  try {
    console.log('📄 Parsing CV for skills extraction...');
    
    // Extract text from PDF
    const data = await pdfParse(cvBuffer);
    const text = data.text.toLowerCase();
    
    console.log('📊 CV text length:', text.length, 'characters');
    
    // Find skills mentioned in the CV
    const foundSkills: string[] = [];
    
    for (const skill of COMMON_SKILLS) {
      // Check for exact skill name or common variations
      const skillLower = skill.toLowerCase();
      const variations = [
        skillLower,
        skillLower.replace('.', '').replace(' ', ''),
        skillLower.replace('js', 'js'),
        skillLower.replace('ci', 'ci'),
        skillLower.replace('cd', 'cd')
      ];
      
      for (const variation of variations) {
        if (text.includes(variation)) {
          foundSkills.push(skill);
          break; // Avoid duplicates
        }
      }
    }
    
    console.log(`✅ Extracted ${foundSkills.length} skills from CV:`, foundSkills);
    return foundSkills;
    
  } catch (error) {
    console.error('❌ Error parsing CV:', error);
    return [];
  }
}

export async function parseComprehensiveCV(cvBuffer: Buffer): Promise<CVData> {
  try {
    console.log('📄 Comprehensive CV parsing...');
    
    // Extract text from PDF
    const data = await pdfParse(cvBuffer);
    const text = data.text;
    const textLower = text.toLowerCase();
    
    console.log('📊 CV text length:', text.length, 'characters');
    
    const cvData: CVData = {
      skills: [],
      education: [],
      experience: [],
      languages: [],
      rawText: text
    };
    
    // Extract basic contact info
    cvData.fullName = extractFullName(text);
    cvData.email = extractEmail(text);
    cvData.phone = extractPhone(text);
    cvData.github = extractGitHub(text);
    cvData.linkedin = extractLinkedIn(text);
    cvData.portfolio = extractPortfolio(text);
    
    // Extract skills
    cvData.skills = await extractSkillsFromText(text);
    
    // Extract languages
    cvData.languages = extractLanguages(text);
    
    // Extract education
    cvData.education = extractEducation(text);
    
    // Extract experience
    cvData.experience = extractExperience(text);
    
    // Extract summary/objective
    cvData.summary = extractSummary(text);
    
    console.log('✅ Comprehensive CV parsing complete:', {
      name: cvData.fullName,
      github: cvData.github,
      skillsCount: cvData.skills.length,
      educationCount: cvData.education.length,
      experienceCount: cvData.experience.length,
      languagesCount: cvData.languages.length
    });
    
    return cvData;
    
  } catch (error) {
    console.error('❌ Error parsing CV:', error);
    return {
      skills: [],
      education: [],
      experience: [],
      languages: [],
      rawText: ''
    };
  }
}

// Helper functions for extracting specific information
function extractFullName(text: string): string | undefined {
  const lines = text.split('\n').filter(line => line.trim().length > 0);
  if (lines.length > 0) {
    const firstLine = lines[0].trim();
    // Check if it looks like a name (no numbers, reasonable length)
    if (firstLine.length < 50 && !/\d/.test(firstLine) && firstLine.split(' ').length >= 2 && firstLine.split(' ').length <= 4) {
      return firstLine;
    }
  }
  return undefined;
}

function extractEmail(text: string): string | undefined {
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
  const matches = text.match(emailRegex);
  return matches ? matches[0] : undefined;
}

function extractPhone(text: string): string | undefined {
  const phoneRegex = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g;
  const matches = text.match(phoneRegex);
  return matches ? matches[0] : undefined;
}

function extractGitHub(text: string): string | undefined {
  const githubRegex = /(?:github\.com\/|github:)([a-zA-Z0-9_-]+)/gi;
  const matches = text.match(githubRegex);
  if (matches) {
    // Extract just the username
    const usernameMatch = matches[0].match(/github\.com\/([a-zA-Z0-9_-]+)/i);
    if (usernameMatch) {
      return `https://github.com/${usernameMatch[1]}`;
    }
  }
  return undefined;
}

function extractLinkedIn(text: string): string | undefined {
  const linkedinRegex = /(?:linkedin\.com\/in\/|linkedin:)([a-zA-Z0-9_-]+)/gi;
  const matches = text.match(linkedinRegex);
  if (matches) {
    const usernameMatch = matches[0].match(/linkedin\.com\/in\/([a-zA-Z0-9_-]+)/i);
    if (usernameMatch) {
      return `https://linkedin.com/in/${usernameMatch[1]}`;
    }
  }
  return undefined;
}

function extractPortfolio(text: string): string | undefined {
  // Catch URLs with http/https
  const urlRegex = /https?:\/\/(?!github|linkedin)[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?:\/[^\s]*)?/gi;
  const matches = text.match(urlRegex);
  
  if (matches) return matches[0];

  // Fallback: Catch common portfolio domains even without protocol
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

function extractLanguages(text: string): string[] {
  const foundLanguages: string[] = [];
  const textLower = text.toLowerCase();
  
  for (const language of COMMON_LANGUAGES) {
    if (textLower.includes(language.toLowerCase())) {
      foundLanguages.push(language);
    }
  }
  
  return [...new Set(foundLanguages)];
}

function extractEducation(text: string): EducationEntry[] {
  const education: EducationEntry[] = [];
  const lines = text.split('\n');
  
  // Look for education patterns
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].toLowerCase();
    
    // Education keywords including abbreviations
    if (line.includes('bachelor') || line.includes('master') || line.includes('phd') || 
        line.includes('degree') || line.includes('university') || line.includes('college') ||
        line.includes('b.sc') || line.includes('m.sc') || line.includes('b.a') || 
        line.includes('m.a') || line.includes('hnd') || line.includes('diploma') ||
        line.includes('certification') || line.includes('certificate')) {
      
      const degree = lines[i].trim();
      let institution = '';
      let year = '';
      
      // Look for institution in next few lines
      for (let j = i + 1; j < Math.min(i + 3, lines.length); j++) {
        const nextLine = lines[j].trim();
        if (nextLine && !nextLine.toLowerCase().includes('gpa')) {
          institution = nextLine;
          break;
        }
      }
      
      // Look for year
      const yearMatch = text.match(/\b(19|20)\d{2}\b/g);
      if (yearMatch) {
        year = yearMatch[yearMatch.length - 1]; // Get the most recent year
      }
      
      if (degree || institution) {
        education.push({ degree, institution, year });
      }
    }
  }
  
  return education;
}

function extractExperience(text: string): ExperienceEntry[] {
  const experience: ExperienceEntry[] = [];
  const lines = text.split('\n');
  
  // Look for experience patterns
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Skip empty lines and education
    if (!line || line.toLowerCase().includes('education') || line.toLowerCase().includes('degree')) {
      continue;
    }
    
    // Look for job titles (common patterns)
    const jobTitlePatterns = [
      /(?:senior|junior|lead|principal|staff)?\s*(developer|engineer|designer|manager|analyst|consultant|specialist|coordinator|director|vp|architect)/i,
      /(?:software|frontend|backend|full[-\s]?stack|devops|data|machine learning|product|ui|ux)/i
    ];
    
    let isJobTitle = false;
    for (const pattern of jobTitlePatterns) {
      if (pattern.test(line)) {
        isJobTitle = true;
        break;
      }
    }
    
    if (isJobTitle) {
      const title = line;
      let company = '';
      let duration = '';
      
      // Look for company in next line
      if (i + 1 < lines.length) {
        const nextLine = lines[i + 1].trim();
        if (nextLine && !jobTitlePatterns.some(p => p.test(nextLine))) {
          company = nextLine;
          
          // Look for duration in the same or next line
          const durationMatch = nextLine.match(/\b(\d{1,2}\s*(years?|months?)\s*(at|@|in)?\s*[^\n]*)\b/i) ||
                               line.match(/\b(\d{1,2}\s*(years?|months?)\s*(at|@|in)?\s*[^\n]*)\b/i);
          if (durationMatch) {
            duration = durationMatch[1];
          }
        }
      }
      
      if (title) {
        experience.push({ title, company, duration });
      }
    }
  }
  
  return experience;
}

function extractSummary(text: string): string | undefined {
  // Look for summary/objective sections
  const summaryPatterns = [
    /summary[:\s\n]([^\n]*(?:\n[^ \n]*){0,3})/i,
    /objective[:\s\n]([^\n]*(?:\n[^ \n]*){0,3})/i,
    /profile[:\s\n]([^\n]*(?:\n[^ \n]*){0,3})/i
  ];
  
  for (const pattern of summaryPatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      return match[1].trim();
    }
  }
  
  return undefined;
}

export async function extractSkillsFromText(text: string): Promise<string[]> {
  try {
    console.log('📄 Analyzing text for skills extraction...');
    const textLower = text.toLowerCase();
    
    const foundSkills: string[] = [];
    
    for (const skill of COMMON_SKILLS) {
      const skillLower = skill.toLowerCase();
      if (textLower.includes(skillLower)) {
        foundSkills.push(skill);
      }
    }
    
    console.log(`✅ Extracted ${foundSkills.length} skills from text:`, foundSkills);
    return foundSkills;
    
  } catch (error) {
    console.error('❌ Error extracting skills from text:', error);
    return [];
  }
}
