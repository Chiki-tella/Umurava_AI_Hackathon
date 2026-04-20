export interface Job {
  id: string
  title: string
  company: string
  status: 'open' | 'closed'
  startDate: string
  deadline: string
  description: string
  requiredSkills: string[]
  experienceLevel: string
  salary?: string
  location?: string
  type?: string
  applicants?: number
  websiteUrl?: string
}

export interface Candidate {
  id: string
  jobId: string
  firstName: string
  lastName: string
  email: string
  skills: string[]
  experience: string
  education: string
  matchScore: number
  strengths: string[]
  gaps: string[]
  recommendation: string
  avatar?: string
}

export const jobs: Job[] = [
  {
    id: '1',
    title: 'Senior Frontend Engineer',
    company: 'TechFlow AI',
    status: 'open',
    startDate: '2026-03-15',
    deadline: '2026-05-01',
    description: 'We are seeking an experienced Frontend Engineer to join our AI-powered SaaS platform team. You will work on building scalable, performant user interfaces using React, TypeScript, and modern frontend technologies. The ideal candidate has a passion for creating exceptional user experiences and writing clean, maintainable code.',
    requiredSkills: ['React', 'TypeScript', 'Tailwind CSS', 'Next.js', 'REST APIs'],
    experienceLevel: '5+ years',
    salary: '$140k - $180k',
    location: 'San Francisco, CA (Hybrid)',
    type: 'Full-time',
    websiteUrl: 'https://techflow.ai',
  },
  {
    id: '2',
    title: 'Product Designer',
    company: 'DesignStudio Pro',
    status: 'open',
    startDate: '2026-03-20',
    deadline: '2026-04-30',
    description: 'Looking for a creative Product Designer who can transform complex problems into elegant, user-friendly solutions. You will collaborate with product managers and engineers to design innovative features for our design collaboration platform.',
    requiredSkills: ['Figma', 'UI/UX Design', 'Prototyping', 'Design Systems', 'User Research'],
    experienceLevel: '3-5 years',
    salary: '$110k - $140k',
    location: 'Remote',
    type: 'Full-time',
    websiteUrl: 'https://designstudio.pro',
  },
  {
    id: '3',
    title: 'Full Stack Developer',
    company: 'CloudNative Inc',
    status: 'open',
    startDate: '2026-04-01',
    deadline: '2026-05-15',
    description: 'Join our engineering team to build cloud-native applications that scale. We need a versatile Full Stack Developer comfortable working across the entire technology stack, from database design to frontend implementation.',
    requiredSkills: ['Node.js', 'React', 'PostgreSQL', 'Docker', 'AWS', 'GraphQL'],
    experienceLevel: '4+ years',
    salary: '$130k - $160k',
    location: 'New York, NY (On-site)',
    type: 'Full-time',
    websiteUrl: 'https://cloudnative.io',
  },
  {
    id: '4',
    title: 'Data Scientist',
    company: 'Analytics Labs',
    status: 'open',
    startDate: '2026-03-10',
    deadline: '2026-04-25',
    description: 'We are looking for a Data Scientist to help us unlock insights from complex datasets. You will develop machine learning models, create data visualizations, and work closely with stakeholders to drive data-informed decisions.',
    requiredSkills: ['Python', 'Machine Learning', 'SQL', 'TensorFlow', 'Data Visualization'],
    experienceLevel: '3+ years',
    salary: '$120k - $155k',
    location: 'Austin, TX (Hybrid)',
    type: 'Full-time',
    websiteUrl: 'https://analytics.labs',
  },
  {
    id: '5',
    title: 'DevOps Engineer',
    company: 'Infrastructure Co',
    status: 'closed',
    startDate: '2026-02-15',
    deadline: '2026-03-30',
    description: 'Seeking a DevOps Engineer to manage and optimize our cloud infrastructure. You will design CI/CD pipelines, implement monitoring solutions, and ensure high availability of our services.',
    requiredSkills: ['Kubernetes', 'Docker', 'Terraform', 'CI/CD', 'Monitoring', 'AWS'],
    experienceLevel: '5+ years',
    salary: '$150k - $190k',
    location: 'Seattle, WA (Remote)',
    type: 'Full-time',
    websiteUrl: 'https://infrastructure.co',
  },
  {
    id: '6',
    title: 'Mobile App Developer',
    company: 'MobileFirst Labs',
    status: 'open',
    startDate: '2026-04-05',
    deadline: '2026-05-20',
    description: 'Build beautiful, high-performance mobile applications for iOS and Android. We are looking for someone who can craft pixel-perfect interfaces and optimize app performance.',
    requiredSkills: ['React Native', 'TypeScript', 'iOS', 'Android', 'Mobile UI/UX'],
    experienceLevel: '3-5 years',
    salary: '$115k - $145k',
    location: 'Los Angeles, CA (Hybrid)',
    type: 'Full-time',
    websiteUrl: 'https://mobilefirst.labs',
  },
]

export const candidates: Candidate[] = [
  {
    id: '1',
    jobId: '1',
    firstName: 'Sarah',
    lastName: 'Chen',
    email: 'sarah.chen@email.com',
    skills: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'GraphQL', 'Redux'],
    experience: '6 years building scalable frontend applications at high-growth startups. Led the migration from Vue to React for a B2B SaaS platform serving 100k+ users.',
    education: 'BS Computer Science, Stanford University',
    matchScore: 95,
    strengths: ['Extensive React/TypeScript experience', 'Next.js expertise', 'Leadership in large-scale migrations', 'Strong communication skills'],
    gaps: [],
    recommendation: 'Exceptional candidate — strong technical match with proven leadership. Recommend immediate interview.',
  },
  {
    id: '2',
    jobId: '1',
    firstName: 'Marcus',
    lastName: 'Johnson',
    email: 'marcus.j@email.com',
    skills: ['React', 'JavaScript', 'CSS', 'HTML', 'Node.js', 'MongoDB'],
    experience: '5 years of frontend development. Built e-commerce platforms and marketing websites. Comfortable with modern JavaScript frameworks.',
    education: 'BA Digital Media, UCLA',
    matchScore: 88,
    strengths: ['Solid React foundation', 'Full stack capabilities', 'E-commerce domain expertise'],
    gaps: ['Limited TypeScript experience', 'No Next.js background'],
    recommendation: 'Strong candidate with slight skill gaps. Recommend technical interview to assess TypeScript proficiency.',
  },
  {
    id: '3',
    jobId: '1',
    firstName: 'Emily',
    lastName: 'Rodriguez',
    email: 'e.rodriguez@email.com',
    skills: ['React', 'TypeScript', 'Tailwind CSS', 'Vite', 'Testing Library', 'Storybook'],
    experience: '7 years in frontend engineering. Specialized in component libraries and design systems. Advocate for accessibility and performance.',
    education: 'MS Human-Computer Interaction, Carnegie Mellon',
    matchScore: 92,
    strengths: ['Expert-level TypeScript', 'Design systems experience', 'Strong testing practices', 'Accessibility focus'],
    gaps: ['Limited Next.js experience'],
    recommendation: 'Excellent candidate with complementary design systems expertise. Highly recommend.',
  },
  {
    id: '4',
    jobId: '1',
    firstName: 'David',
    lastName: 'Kim',
    email: 'david.kim@email.com',
    skills: ['React', 'TypeScript', 'Redux', 'Material-UI', 'REST APIs'],
    experience: '4 years developing enterprise dashboards and admin tools. Experience with complex state management and data visualization.',
    education: 'BS Software Engineering, MIT',
    matchScore: 82,
    strengths: ['Strong React fundamentals', 'Complex state management', 'Enterprise software experience'],
    gaps: ['Below required 5+ years experience', 'No Tailwind CSS background', 'Limited Next.js knowledge'],
    recommendation: 'Competent candidate but falls short on years of experience. Consider for mid-level role instead.',
  },
  {
    id: '5',
    jobId: '1',
    firstName: 'Jessica',
    lastName: 'Martinez',
    email: 'j.martinez@email.com',
    skills: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Framer Motion', 'Vercel'],
    experience: '5 years building modern web applications. Created multiple Next.js projects from scratch with focus on performance and SEO.',
    education: 'BS Computer Science, UC Berkeley',
    matchScore: 94,
    strengths: ['Perfect skill match', 'Next.js expertise', 'Performance optimization focus', 'Modern tooling proficiency'],
    gaps: [],
    recommendation: 'Outstanding candidate with ideal technical profile. Strong recommend for next round.',
  },
  {
    id: '6',
    jobId: '1',
    firstName: 'Michael',
    lastName: 'Brown',
    email: 'm.brown@email.com',
    skills: ['Vue.js', 'JavaScript', 'CSS', 'Webpack', 'REST APIs'],
    experience: '6 years of frontend development primarily with Vue.js. Built several large-scale applications with complex routing and state management.',
    education: 'BS Information Technology, Georgia Tech',
    matchScore: 68,
    strengths: ['Strong frontend fundamentals', 'Extensive SPA experience', 'Good problem-solving skills'],
    gaps: ['No React experience', 'Missing TypeScript', 'Unfamiliar with required stack'],
    recommendation: 'Experienced developer but significant technology mismatch. Not recommended for this role.',
  },
  {
    id: '7',
    jobId: '1',
    firstName: 'Aisha',
    lastName: 'Patel',
    email: 'aisha.patel@email.com',
    skills: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'GraphQL', 'Apollo', 'Remix'],
    experience: '8 years in web development. Deep expertise in React ecosystem. Contributor to open-source projects including React Query and Tailwind UI.',
    education: 'MS Computer Science, University of Washington',
    matchScore: 97,
    strengths: ['Exceptional technical depth', 'Open-source contributor', 'Thought leader in React community', 'Perfect tech stack alignment'],
    gaps: [],
    recommendation: 'Top-tier candidate with industry recognition. Priority interview — strong hire signal.',
  },
  {
    id: '8',
    jobId: '1',
    firstName: 'Tom',
    lastName: 'Anderson',
    email: 'tom.anderson@email.com',
    skills: ['React', 'JavaScript', 'HTML', 'CSS', 'Bootstrap'],
    experience: '3 years building web applications. Primarily worked on marketing sites and simple web apps.',
    education: 'Bootcamp Graduate, General Assembly',
    matchScore: 58,
    strengths: ['React basics', 'Eager to learn', 'Good design sense'],
    gaps: ['Insufficient experience level', 'No TypeScript', 'Missing modern tooling', 'Below required years'],
    recommendation: 'Junior-level candidate not suitable for senior position. Pass.',
  },
  {
    id: '9',
    jobId: '1',
    firstName: 'Linda',
    lastName: 'Wu',
    email: 'linda.wu@email.com',
    skills: ['React', 'TypeScript', 'Next.js', 'Styled Components', 'Jest', 'Cypress'],
    experience: '5 years of frontend engineering. Led frontend for fintech startup. Expert in testing and quality assurance.',
    education: 'BS Mathematics & Computer Science, Harvard',
    matchScore: 90,
    strengths: ['Strong Next.js experience', 'Excellent testing practices', 'Fintech domain knowledge', 'Leadership experience'],
    gaps: ['Uses Styled Components vs Tailwind CSS (minor)'],
    recommendation: 'Excellent candidate with strong testing culture. Recommend interview.',
  },
  {
    id: '10',
    jobId: '1',
    firstName: 'James',
    lastName: 'Taylor',
    email: 'james.taylor@email.com',
    skills: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Zustand', 'React Query'],
    experience: '6 years building consumer-facing web applications. Led team of 4 developers. Experience with high-traffic applications (1M+ MAU).',
    education: 'BS Computer Engineering, Cornell University',
    matchScore: 93,
    strengths: ['Perfect skill alignment', 'Team leadership', 'High-scale experience', 'Modern state management'],
    gaps: [],
    recommendation: 'Strong technical and leadership profile. Recommend for senior-level discussion.',
  },
]
