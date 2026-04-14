export const SAMPLE_RESUMES = [
  {
    id: 'software-engineer',
    title: 'Software Engineer',
    industry: 'Technology',
    emoji: '💻',
    color: 'indigo',
    data: {
      personalInfo: { fullName: 'Alex Johnson', email: 'alex@email.com', phone: '(555) 123-4567', location: 'San Francisco, CA', linkedin: 'linkedin.com/in/alexjohnson', website: 'alexjohnson.dev', summary: 'Results-driven Software Engineer with 5+ years building scalable web applications. Expert in React, Node.js, and cloud technologies.' },
      experience: [
        { id: '1', title: 'Senior Software Engineer', company: 'TechCorp', location: 'San Francisco, CA', startDate: 'Jan 2022', endDate: 'Present', current: true, bullets: ['Led microservices architecture serving 2M+ daily active users', 'Reduced API response time by 40% through caching', 'Mentored 4 junior engineers and conducted 100+ code reviews'] },
        { id: '2', title: 'Software Engineer', company: 'StartupXYZ', location: 'Remote', startDate: 'Jun 2019', endDate: 'Dec 2021', current: false, bullets: ['Built React dashboards for 50,000+ enterprise customers', 'Increased test coverage from 20% to 85% using Jest'] }
      ],
      education: [{ id: '1', degree: 'B.Sc. Computer Science', school: 'UC Berkeley', location: 'Berkeley, CA', graduationDate: 'May 2019', gpa: '3.8' }],
      skills: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'AWS', 'Docker', 'PostgreSQL'],
      certifications: ['AWS Certified Developer', 'Google Cloud Professional'],
      template: 'modern'
    }
  },
  {
    id: 'marketing-manager',
    title: 'Marketing Manager',
    industry: 'Marketing',
    emoji: '📢',
    color: 'pink',
    data: {
      personalInfo: { fullName: 'Sarah Chen', email: 'sarah@email.com', phone: '(555) 987-6543', location: 'New York, NY', linkedin: 'linkedin.com/in/sarahchen', website: '', summary: 'Creative Marketing Manager with 7 years driving brand growth. Expert in SEO, content strategy, and data-driven campaigns with proven revenue impact.' },
      experience: [
        { id: '1', title: 'Marketing Manager', company: 'BrandCo', location: 'New York, NY', startDate: 'Mar 2020', endDate: 'Present', current: true, bullets: ['Grew organic traffic 180% through targeted SEO strategy', 'Managed $2M annual budget with 320% ROI', 'Led rebranding that increased brand awareness by 45%'] },
        { id: '2', title: 'Digital Marketing Specialist', company: 'AgencyPlus', location: 'New York, NY', startDate: 'Jul 2017', endDate: 'Feb 2020', current: false, bullets: ['Managed 15+ client accounts with $500K/month ad spend', 'Achieved average 4.2x ROAS across paid social campaigns'] }
      ],
      education: [{ id: '1', degree: 'B.A. Marketing', school: 'NYU Stern', location: 'New York, NY', graduationDate: 'May 2017', gpa: '3.6' }],
      skills: ['Google Analytics', 'HubSpot', 'SEO/SEM', 'Meta Ads', 'Google Ads', 'Mailchimp', 'Figma', 'Salesforce'],
      certifications: ['Google Analytics Certified', 'HubSpot Content Marketing'],
      template: 'classic'
    }
  },
  {
    id: 'data-analyst',
    title: 'Data Analyst',
    industry: 'Analytics',
    emoji: '📊',
    color: 'teal',
    data: {
      personalInfo: { fullName: 'Marcus Williams', email: 'marcus@email.com', phone: '(555) 456-7890', location: 'Chicago, IL', linkedin: 'linkedin.com/in/marcuswilliams', website: '', summary: 'Detail-oriented Data Analyst with 4 years transforming complex datasets into actionable insights. Proficient in SQL, Python, and Tableau.' },
      experience: [
        { id: '1', title: 'Senior Data Analyst', company: 'FinanceCorp', location: 'Chicago, IL', startDate: 'Sep 2021', endDate: 'Present', current: true, bullets: ['Built automated dashboards reducing reporting time by 60%', 'Identified $3.2M in savings through predictive churn modeling', 'Developed A/B testing framework used across 5 product teams'] },
        { id: '2', title: 'Data Analyst', company: 'RetailCo', location: 'Chicago, IL', startDate: 'Jun 2019', endDate: 'Aug 2021', current: false, bullets: ['Analyzed sales data for 500+ stores to optimize inventory', 'Created executive dashboards tracking $50M in revenue'] }
      ],
      education: [{ id: '1', degree: 'B.Sc. Statistics', school: 'University of Illinois', location: 'Chicago, IL', graduationDate: 'May 2019', gpa: '3.7' }],
      skills: ['SQL', 'Python', 'R', 'Tableau', 'Power BI', 'Excel', 'Pandas', 'Machine Learning'],
      certifications: ['Google Data Analytics', 'Tableau Desktop Specialist'],
      template: 'minimal'
    }
  },
  {
    id: 'nurse',
    title: 'Registered Nurse',
    industry: 'Healthcare',
    emoji: '🏥',
    color: 'green',
    data: {
      personalInfo: { fullName: 'Emily Rodriguez', email: 'emily@email.com', phone: '(555) 321-9876', location: 'Houston, TX', linkedin: '', website: '', summary: 'Compassionate Registered Nurse with 6 years of ICU experience. Skilled in critical care, patient advocacy, and interdisciplinary collaboration.' },
      experience: [
        { id: '1', title: 'ICU Registered Nurse', company: 'Houston Medical Center', location: 'Houston, TX', startDate: 'Aug 2020', endDate: 'Present', current: true, bullets: ['Managed care for 4-6 critically ill patients per shift in 20-bed ICU', 'Reduced patient readmission rates by 15% through discharge education', 'Trained 10+ new nursing staff on ICU protocols'] },
        { id: '2', title: 'Staff Nurse', company: 'Memorial Hospital', location: 'Houston, TX', startDate: 'Jun 2018', endDate: 'Jul 2020', current: false, bullets: ['Delivered high-quality care to 8-10 patients per shift on med-surg floor', 'Received Patient Satisfaction Award 3 consecutive quarters'] }
      ],
      education: [{ id: '1', degree: 'B.Sc. Nursing', school: 'University of Texas', location: 'Austin, TX', graduationDate: 'May 2018', gpa: '3.9' }],
      skills: ['Critical Care', 'ACLS/BLS', 'Ventilator Management', 'IV Therapy', 'Epic EHR', 'Patient Education', 'Wound Care'],
      certifications: ['RN License', 'CCRN Certified', 'ACLS', 'BLS'],
      template: 'classic'
    }
  },
  {
    id: 'project-manager',
    title: 'Project Manager',
    industry: 'Management',
    emoji: '📋',
    color: 'amber',
    data: {
      personalInfo: { fullName: 'David Park', email: 'david@email.com', phone: '(555) 654-3210', location: 'Seattle, WA', linkedin: 'linkedin.com/in/davidpark', website: '', summary: 'PMP-certified Project Manager with 8 years delivering complex technology projects. Expert in Agile, risk management, and stakeholder communication.' },
      experience: [
        { id: '1', title: 'Senior Project Manager', company: 'Enterprise Solutions', location: 'Seattle, WA', startDate: 'Feb 2019', endDate: 'Present', current: true, bullets: ['Delivered 12 enterprise software projects totaling $15M on time and budget', 'Managed cross-functional teams of 20+ members across 3 time zones', 'Implemented Agile transformation reducing delivery time by 35%'] },
        { id: '2', title: 'Project Manager', company: 'TechSystems', location: 'Seattle, WA', startDate: 'Jan 2016', endDate: 'Jan 2019', current: false, bullets: ['Led ERP implementation for 500-person organization', 'Maintained 98% on-time delivery rate across 25+ projects'] }
      ],
      education: [{ id: '1', degree: 'B.B.A. Business Administration', school: 'University of Washington', location: 'Seattle, WA', graduationDate: 'Dec 2015', gpa: '3.5' }],
      skills: ['Agile/Scrum', 'JIRA', 'MS Project', 'Risk Management', 'Budgeting', 'Stakeholder Management', 'PMP', 'Confluence'],
      certifications: ['PMP Certified', 'Certified Scrum Master', 'PRINCE2'],
      template: 'executive'
    }
  }
]

export const RESUME_TEMPLATES = [
  { id: 'modern', name: 'Modern', description: 'Clean with accent sidebar', preview: '🎨' },
  { id: 'classic', name: 'Classic', description: 'Traditional professional', preview: '📄' },
  { id: 'minimal', name: 'Minimal', description: 'Simple and clean', preview: '✨' },
  { id: 'executive', name: 'Executive', description: 'Bold leadership style', preview: '💼' },
]
