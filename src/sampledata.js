import e from "cors";

const InstructionArray = [
  {
    title: "Personal Information",
    instruction:
      "Provide your full name, contact details (email, phone, address if you want), links to LinkedIn/GitHub/portfolio, your professional title, and a short career summary or objective.",
  },
  {
    title: "Work Experience",
    instruction:
      "List each job you’ve had. Include job title, company name and location, start and end dates, your main responsibilities, key achievements (with metrics if possible), and tools or technologies used.",
  },
  {
    title: "Education",
    instruction:
      "Add your degrees or certifications. Mention the degree or certification name, institution, graduation (or expected) date, GPA if relevant, and any honors or awards.",
  },
  {
    title: "Skills",
    instruction:
      "List your technical skills (e.g., programming languages, tools, frameworks), soft skills (e.g., leadership, problem-solving), and any languages you speak with proficiency levels.",
  },
  {
    title: "Projects",
    instruction:
      "Share notable projects. Provide the project title, a short description, your role/contribution, the technologies used, and links (GitHub/demo/portfolio) if available.",
  },
  {
    title: "Certifications & Training",
    instruction:
      "Include certifications or training programs. State the certification name, issuing organization, and date earned or validity period.",
  },
  {
    title: "Awards & Achievements",
    instruction:
      "Add any awards, honors, or recognitions. Include the award name, issuing organization, and year received.",
  },
  {
    title: "Volunteer Work / Extracurriculars",
    instruction:
      "Mention volunteer roles or extracurricular activities. Provide the role, organization name, and a brief description of your contributions or impact.",
  },
  {
    title: "Resume Preferences",
    instruction:
      "Tell us about your career goals. Specify industries or roles you’re targeting, what section you’d like to emphasize (work experience, education, or projects), and your preferred resume style (modern, minimalist, creative).",
  },
];


const sampleUserData = {
  name: "John Doe",
  email: "john@example.com",
  phone: "+1 (555) 123-4567",
  summary:
    "Full-stack developer with 5+ years of experience building scalable web apps.",
  experience: [
    {
      title: "Software Engineer",
      company: "XYZ Corp",
      start: "2020",
      end: "2023",
      bullets: [
        "Built REST APIs in Node.js and Express",
        "Led migration from monolith to microservices",
        "Improved API response time by 30%",
      ],
    },
    {
      title: "Frontend Developer",
      company: "ABC Solutions",
      start: "2018",
      end: "2020",
      bullets: [
        "Developed React dashboards for enterprise clients",
        "Integrated Tailwind CSS for design system",
      ],
    },
  ],
  education: [
    {
      degree: "BSc Computer Science",
      school: "University of Somewhere",
      year: "2018",
    },
  ],
  projects: [
    {
      name: "AI Resume Builder",
      description:
        "A web app that generates tailored resumes using AI and Puppeteer.",
    },
    {
      name: "E-commerce Dashboard",
      description:
        "React-based admin dashboard with analytics and order tracking.",
    },
  ],
  skills: ["JavaScript", "React", "Node.js", "CSS", "MongoDB"],
};

const transcriptArray = [
  { category: "Introduction", transcription: "Hey, I am such and such" },
  { category: "Experience", transcription: "I worked at XYZ company" },
  { category: "Skills", transcription: "JavaScript, React, Node.js" },
];




export default InstructionArray;
export { sampleUserData };
export { transcriptArray };