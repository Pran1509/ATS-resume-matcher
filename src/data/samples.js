export const TEMPLATES = [
  { id: 'modern', name: 'Modern', desc: 'Clean with indigo accents' },
  { id: 'classic', name: 'Classic', desc: 'Traditional with serif header' },
  { id: 'minimal', name: 'Minimal', desc: 'Simple and elegant' },
  { id: 'executive', name: 'Executive', desc: 'Bold dark header' },
]

export const SAMPLES = [
  {
    id: 'software-engineer', title: 'Software Engineer', industry: 'Technology', emoji: '💻',
    data: {
      template: 'modern',
      personalInfo: { fullName: 'Alex Johnson', title: 'Senior Software Engineer', email: 'alex@email.com', phone: '(555) 123-4567', location: 'San Francisco, CA', linkedin: 'linkedin.com/in/alexjohnson', website: 'alexjohnson.dev', summary: 'Results-driven Software Engineer with 5+ years building scalable web applications. Expert in React, Node.js, and cloud technologies. Passionate about clean code and developer experience.' },
      experience: [
        { id: '1', title: 'Senior Software Engineer', company: 'TechCorp Inc.', location: 'San Francisco, CA', startDate: 'Jan 2022', endDate: '', current: true, bullets: ['Led microservices architecture serving 2M+ daily active users', 'Reduced API response time by 40% through intelligent caching', 'Mentored 4 junior engineers and conducted 100+ code reviews', 'Implemented CI/CD pipelines cutting deployment time from 2hrs to 15min'] },
        { id: '2', title: 'Software Engineer', company: 'StartupXYZ', location: 'Remote', startDate: 'Jun 2019', endDate: 'Dec 2021', current: false, bullets: ['Built React dashboards used by 50,000+ enterprise customers', 'Designed REST APIs with Node.js and Express', 'Increased test coverage from 20% to 85% with Jest and Cypress'] }
      ],
      education: [{ id: '1', degree: 'B.Sc. Computer Science', school: 'UC Berkeley', location: 'Berkeley, CA', graduationDate: 'May 2019', gpa: '3.8' }],
      skills: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'AWS', 'Docker', 'PostgreSQL', 'GraphQL', 'Kubernetes'],
      certifications: ['AWS Certified Developer', 'Google Cloud Professional']
    }
  },
  {
    id: 'marketing', title: 'Marketing Manager', industry: 'Marketing', emoji: '📢',
    data: {
      template: 'classic',
      personalInfo: { fullName: 'Sarah Chen', title: 'Marketing Manager', email: 'sarah@email.com', phone: '(555) 987-6543', location: 'New York, NY', linkedin: 'linkedin.com/in/sarahchen', website: '', summary: 'Creative Marketing Manager with 7 years driving brand growth. Expert in SEO, content strategy, and data-driven campaigns with proven $2M+ revenue impact.' },
      experience: [
        { id: '1', title: 'Marketing Manager', company: 'BrandCo', location: 'New York, NY', startDate: 'Mar 2020', endDate: '', current: true, bullets: ['Grew organic traffic 180% through targeted SEO and content strategy', 'Managed $2M annual budget delivering 320% ROI', 'Led rebranding initiative increasing brand awareness by 45%', 'Built and managed team of 6 content creators'] },
        { id: '2', title: 'Digital Marketing Specialist', company: 'AgencyPlus', location: 'New York, NY', startDate: 'Jul 2017', endDate: 'Feb 2020', current: false, bullets: ['Managed 15+ client accounts with $500K/month combined ad spend', 'Achieved average 4.2x ROAS across paid social campaigns'] }
      ],
      education: [{ id: '1', degree: 'B.A. Marketing', school: 'NYU Stern', location: 'New York, NY', graduationDate: 'May 2017', gpa: '3.6' }],
      skills: ['Google Analytics', 'HubSpot', 'SEO/SEM', 'Meta Ads', 'Google Ads', 'Mailchimp', 'Figma', 'Salesforce'],
      certifications: ['Google Analytics Certified', 'HubSpot Content Marketing']
    }
  },
  {
    id: 'data-analyst', title: 'Data Analyst', industry: 'Analytics', emoji: '📊',
    data: {
      template: 'minimal',
      personalInfo: { fullName: 'Marcus Williams', title: 'Senior Data Analyst', email: 'marcus@email.com', phone: '(555) 456-7890', location: 'Chicago, IL', linkedin: 'linkedin.com/in/marcuswilliams', website: '', summary: 'Detail-oriented Data Analyst with 4 years transforming complex datasets into actionable insights. Proficient in SQL, Python, and Tableau.' },
      experience: [
        { id: '1', title: 'Senior Data Analyst', company: 'FinanceCorp', location: 'Chicago, IL', startDate: 'Sep 2021', endDate: '', current: true, bullets: ['Built automated dashboards reducing reporting time by 60%', 'Identified $3.2M in savings through predictive churn modeling', 'Developed A/B testing framework across 5 product teams'] },
        { id: '2', title: 'Data Analyst', company: 'RetailCo', location: 'Chicago, IL', startDate: 'Jun 2019', endDate: 'Aug 2021', current: false, bullets: ['Analyzed sales data for 500+ stores to optimize inventory', 'Created executive dashboards tracking $50M in revenue'] }
      ],
      education: [{ id: '1', degree: 'B.Sc. Statistics', school: 'University of Illinois', location: 'Chicago, IL', graduationDate: 'May 2019', gpa: '3.7' }],
      skills: ['SQL', 'Python', 'R', 'Tableau', 'Power BI', 'Excel', 'Pandas', 'Machine Learning'],
      certifications: ['Google Data Analytics', 'Tableau Desktop Specialist']
    }
  },
  {
    id: 'nurse', title: 'Registered Nurse', industry: 'Healthcare', emoji: '🏥',
    data: {
      template: 'classic',
      personalInfo: { fullName: 'Emily Rodriguez', title: 'ICU Registered Nurse', email: 'emily@email.com', phone: '(555) 321-9876', location: 'Houston, TX', linkedin: '', website: '', summary: 'Compassionate RN with 6 years of ICU experience. Skilled in critical care, patient advocacy, and interdisciplinary collaboration with a 98% patient satisfaction rate.' },
      experience: [
        { id: '1', title: 'ICU Registered Nurse', company: 'Houston Medical Center', location: 'Houston, TX', startDate: 'Aug 2020', endDate: '', current: true, bullets: ['Managed care for 4-6 critically ill patients per shift in 20-bed ICU', 'Reduced patient readmission rates by 15% through discharge education', 'Trained 10+ new nursing staff on ICU protocols and procedures'] },
        { id: '2', title: 'Staff Nurse', company: 'Memorial Hospital', location: 'Houston, TX', startDate: 'Jun 2018', endDate: 'Jul 2020', current: false, bullets: ['Delivered high-quality care for 8-10 patients per shift', 'Received Patient Satisfaction Award 3 consecutive quarters'] }
      ],
      education: [{ id: '1', degree: 'B.Sc. Nursing', school: 'University of Texas', location: 'Austin, TX', graduationDate: 'May 2018', gpa: '3.9' }],
      skills: ['Critical Care', 'ACLS/BLS', 'Ventilator Management', 'IV Therapy', 'Epic EHR', 'Patient Education', 'Wound Care'],
      certifications: ['RN License', 'CCRN Certified', 'ACLS', 'BLS']
    }
  },
  {
    id: 'project-manager', title: 'Project Manager', industry: 'Management', emoji: '📋',
    data: {
      template: 'executive',
      personalInfo: { fullName: 'David Park', title: 'Senior Project Manager', email: 'david@email.com', phone: '(555) 654-3210', location: 'Seattle, WA', linkedin: 'linkedin.com/in/davidpark', website: '', summary: 'PMP-certified Project Manager with 8 years delivering complex $15M+ technology projects on time and budget. Expert in Agile, risk management, and cross-functional team leadership.' },
      experience: [
        { id: '1', title: 'Senior Project Manager', company: 'Enterprise Solutions', location: 'Seattle, WA', startDate: 'Feb 2019', endDate: '', current: true, bullets: ['Delivered 12 enterprise software projects totaling $15M on time and budget', 'Managed cross-functional teams of 20+ across 3 time zones', 'Implemented Agile transformation reducing delivery time by 35%', 'Maintained 98% on-time delivery rate across all projects'] },
        { id: '2', title: 'Project Manager', company: 'TechSystems', location: 'Seattle, WA', startDate: 'Jan 2016', endDate: 'Jan 2019', current: false, bullets: ['Led ERP implementation for 500-person organization', 'Managed portfolio of 25+ concurrent projects'] }
      ],
      education: [{ id: '1', degree: 'B.B.A. Business Administration', school: 'University of Washington', location: 'Seattle, WA', graduationDate: 'Dec 2015', gpa: '3.5' }],
      skills: ['Agile/Scrum', 'JIRA', 'MS Project', 'Risk Management', 'Budgeting', 'Stakeholder Management', 'Confluence'],
      certifications: ['PMP Certified', 'Certified Scrum Master', 'PRINCE2']
    }
  }
]
