// App.jsx
import React from "react";
import MyResume from "./resume";

const sampleData = {
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

const appStyle = {
  minHeight: "100vh",
  padding: "24px",
  backgroundColor: "#f3f3f3",
};

export default function App() {
  return (
    <div style={appStyle}>
      <MyResume data={sampleData} />
    </div>
  );
}
