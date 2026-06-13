export interface ExperienceItem {
  company: string;
  role: string;
  period: string;
  bullets: string[];
  url?: string;
}

export interface ProjectItem {
  name: string;
  description: string;
  tags: string[];
  links?: { label: string; url: string }[];
  highlight?: string;
  type: 'professional' | 'personal';
}

export interface SkillGroup {
  category: string;
  skills: string[];
}

export interface EducationItem {
  school: string;
  degree: string;
  graduation: string;
  gpa: string;
  minor?: string;
  coursework?: string;
}

export interface ActivityItem {
  name: string;
  date: string;
  bullets: string[];
  url?: string;
  highlight?: string;
}

export interface Social {
  label: string;
  url: string;
  icon: 'github' | 'linkedin' | 'twitter' | 'kaggle' | 'gitlab' | 'email' | 'blog';
}

export interface Profile {
  name: string;
  nameShort: string;
  location: string;
  email: string;
  phone: string;
  tagline: string;
  resumeUrl: string;
  socials: Social[];
  experience: ExperienceItem[];
  projects: ProjectItem[];
  skillGroups: SkillGroup[];
  education: EducationItem[];
  activities: ActivityItem[];
}

export const profile: Profile = {
  name: 'Louie Cai',
  nameShort: 'LC',
  location: 'Seattle, WA',
  email: 'me@louiecai.com',
  phone: '(475) 298-7585',
  tagline: 'Software Engineer at Stripe. I build systems that scale.',
  resumeUrl: '/resume.pdf',
  socials: [
    { label: 'GitHub',    url: 'https://github.com/louiecai',               icon: 'github'   },
    { label: 'LinkedIn',  url: 'https://www.linkedin.com/in/louie-cai/',    icon: 'linkedin' },
    { label: 'Twitter',   url: 'https://twitter.com/Tensorflow719',         icon: 'twitter'  },
    { label: 'Kaggle',    url: 'https://www.kaggle.com/louiec',             icon: 'kaggle'   },
    { label: 'GitLab',    url: 'https://gitlab.com/louie-cai',              icon: 'gitlab'   },
    { label: 'Blog',      url: 'https://blog.louiecai.com/',                icon: 'blog'     },
    { label: 'Email',     url: 'mailto:me@louiecai.com',                    icon: 'email'    },
  ],
  experience: [
    {
      company: 'Stripe',
      role: 'Software Engineer',
      period: 'Feb 2025 – Present',
      url: 'https://stripe.com',
      bullets: [
        'Build software infrastructure, including creation, modification, and testing of source code in Ruby, JavaScript, and JVM languages.',
        'Monitor production web services for abnormal behavior and respond to incidents.',
      ],
    },
    {
      company: 'Amazon',
      role: 'Software Development Engineer Intern',
      period: 'Jun – Sep 2024',
      url: 'https://amazon.com',
      bullets: [
        'Developed a full-stack portal with React front-end and AWS serverless back-end (Lambda, Step Functions, DynamoDB), automating internal experiment creation and tracking — cut deployment time from 2–3 days to minutes.',
        'Built unified portal enabling experiment creation and access to historical data.',
        'Managed infrastructure with AWS CDK and CloudFormation for seamless deployment and monitoring.',
      ],
    },
    {
      company: 'Amazon',
      role: 'Software Development Engineer Intern',
      period: 'Jun – Sep 2023',
      url: 'https://amazon.com',
      bullets: [
        'Built a React + TypeScript internal tool that streamlined backend database onboarding, reducing the process from 2–3 days to several hours.',
        'Collaborated in an Agile team to deliver responsive, user-friendly interfaces.',
      ],
    },
    {
      company: 'UC San Diego',
      role: 'CSE Tutor',
      period: 'Sep 2023 – Dec 2024',
      url: 'https://ucsd.edu',
      bullets: [
        'Held office hours for CSE 8A and CSE 140L; assisted students with coursework.',
        'Automated calculation of class grades with Python scripts.',
        'Performed TA duties: designed and created programming assignments and exams.',
      ],
    },
  ],
  projects: [
    {
      name: 'Experiment Tracking Portal',
      description:
        'Full-stack portal automating creation and tracking of internal experiments at Amazon. React front-end + AWS serverless back-end (Lambda, Step Functions, DynamoDB). Cut deployment time from 2–3 days to minutes.',
      tags: ['React', 'TypeScript', 'AWS Lambda', 'DynamoDB', 'AWS CDK'],
      type: 'professional',
    },
    {
      name: 'Database Onboarding Tool',
      description:
        'React + TypeScript internal tool at Amazon that streamlined backend database onboarding workflows, reducing the process from 2–3 days to several hours.',
      tags: ['React', 'TypeScript', 'Agile'],
      type: 'professional',
    },
    {
      name: 'Minecraft Netherite Horse Armor Mod',
      description:
        'Minecraft mod that adds Netherite Horse Armor, expanding vanilla gameplay. Built with Java and Minecraft Forge. Organically grew to over 2.8 million downloads on CurseForge.',
      highlight: '2.8M+ downloads',
      tags: ['Java', 'Gradle', 'Minecraft Forge'],
      links: [
        { label: 'CurseForge', url: 'https://www.curseforge.com/minecraft/mc-mods/netherite-horse-armor-mod' },
        { label: 'GitHub', url: 'https://github.com/louiecai/Netherite-Horse-Armor-Mod' },
      ],
      type: 'personal',
    },
    {
      name: 'Twitter Sentiment Analysis API',
      description:
        'Configurable LSTM model for tweet sentiment classification, served via FastAPI. Trained 1,000 LSTM variants with grid search to find optimal hyperparameters.',
      tags: ['Python', 'PyTorch', 'FastAPI', 'LSTM'],
      links: [{ label: 'GitHub', url: 'https://github.com/louiecai/Sentiment-Analysis-API' }],
      type: 'personal',
    },
    {
      name: 'TikTok Reddit Video Automator',
      description:
        'Python script that pulls trending videos from subreddits via Reddit API and uploads them to TikTok using Selenium. Configurable for server deployment with adjustable rest intervals and target subreddit.',
      tags: ['Python', 'Selenium', 'Reddit API'],
      links: [{ label: 'GitHub', url: 'https://github.com/louiecai/tiktok-reddit-post-automator' }],
      type: 'personal',
    },
    {
      name: 'CNN Food Image Classifier',
      description:
        'Custom convolutional neural network in PyTorch for classifying 20 food categories. Trained with CUDA; analyzed feature maps and filters with matplotlib.',
      tags: ['Python', 'PyTorch', 'CUDA', 'CNN'],
      type: 'personal',
    },
    {
      name: 'iOS Air Hockey Game',
      description:
        'Touch-based air hockey game in Unity with C#. Full game mechanics, scoring, UI animations, and an AI opponent trained via reinforcement learning with Unity ML-Agents. 3D models made in Blender.',
      tags: ['C#', 'Unity', 'ML-Agents', 'Blender'],
      type: 'personal',
    },
    {
      name: 'Raspberry Pi Stock Checker',
      description:
        'Configurable Python web scraper that monitors Raspberry Pi stock availability from verified resellers and prints formatted, color-coded results to the terminal.',
      tags: ['Python', 'BeautifulSoup4', 'Requests'],
      links: [{ label: 'GitHub', url: 'https://github.com/louiecai/raspberry-pi-stock-checker' }],
      type: 'personal',
    },
  ],
  skillGroups: [
    {
      category: 'Languages',
      skills: ['Python', 'TypeScript', 'JavaScript', 'Ruby', 'Java', 'C', 'C++', 'C#', 'R', 'SQL', 'Bash', 'SystemVerilog'],
    },
    {
      category: 'Web',
      skills: ['React', 'Vite', 'FastAPI', 'Spring Boot', 'HTML', 'CSS', 'React Hook Form', 'React Router DOM'],
    },
    {
      category: 'ML / Data',
      skills: ['PyTorch', 'pandas', 'NumPy', 'scikit-learn', 'matplotlib', 'Selenium', 'Jupyter'],
    },
    {
      category: 'Cloud / DevOps',
      skills: ['AWS Lambda', 'AWS Step Functions', 'AWS DynamoDB', 'AWS CDK', 'AWS CloudFormation', 'Docker'],
    },
    {
      category: 'Tools',
      skills: ['Git', 'Linux', 'Vim', 'Unity', 'Blender', 'Gradle', 'JavaFX', 'Valgrind', 'Verilator'],
    },
  ],
  education: [
    {
      school: 'University of California, San Diego',
      degree: 'B.S. Data Science',
      graduation: 'Dec 2024',
      gpa: '3.7',
      minor: 'Computer Engineering',
      coursework:
        'Machine Learning, Deep Learning, NLP, Data Analysis, Computer Organization and Systems Programming, Data Structures & OOP, Differential Equations, Linear Algebra, Probability and Statistics, Discrete Mathematics, Digital Systems Design',
    },
  ],
  activities: [
    {
      name: 'IEEE F1TENTH IV2023 Robotics Championship',
      date: 'Jun 2023',
      url: 'https://f1tenth.org/',
      highlight: '4th Place',
      bullets: [
        'Constructed two autonomous 1/10-scale RC cars equipped with LiDAR sensors and cameras for precise racetrack navigation.',
        'Led development of advanced navigation algorithms using ROS2 and DonkeyCar frameworks.',
        'Represented UC San Diego at the international championship in Anchorage, AK — placed 4th.',
      ],
    },
  ],
};
