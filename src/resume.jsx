// MyResume.jsx
import React from "react";

// Styles
const containerStyle = {
  maxWidth: "800px",
  margin: "0 auto",
  padding: "32px",
  backgroundColor: "#fff",
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  borderRadius: "12px",
};

const headerStyle = {
  textAlign: "center",
  marginBottom: "24px",
};

const nameStyle = {
  fontSize: "2rem",
  fontWeight: "bold",
};

const contactStyle = {
  color: "#555",
};

const summaryStyle = {
  marginTop: "8px",
  color: "#333",
};

const sectionStyle = {
  marginBottom: "24px",
};

const sectionHeaderStyle = {
  fontSize: "1.25rem",
  fontWeight: "600",
  borderBottom: "1px solid #ccc",
  paddingBottom: "4px",
  marginBottom: "12px",
};

const listItemStyle = {
  marginBottom: "4px",
};

const skillStyle = {
  backgroundColor: "#ddd",
  padding: "4px 12px",
  borderRadius: "8px",
  fontSize: "0.875rem",
  marginRight: "6px",
  marginBottom: "6px",
  display: "inline-block",
};

// Components
function Header({ name, email, phone, summary }) {
  return (
    <div style={headerStyle}>
      <h1 style={nameStyle}>{name}</h1>
      <p style={contactStyle}>
        {email} | {phone}
      </p>
      <p style={summaryStyle}>{summary}</p>
    </div>
  );
}

function ExperienceSection({ experience }) {
  return (
    <div style={sectionStyle}>
      <h2 style={sectionHeaderStyle}>Experience</h2>
      {experience.map((exp, i) => (
        <div key={i} style={{ marginBottom: "16px" }}>
          <h3 style={{ fontWeight: "bold" }}>
            {exp.title} – {exp.company}
          </h3>
          <p style={{ color: "#555", fontSize: "0.875rem" }}>
            {exp.start} – {exp.end}
          </p>
          <ul>
            {exp.bullets.map((b, j) => (
              <li key={j} style={listItemStyle}>
                {b}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function EducationSection({ education }) {
  return (
    <div style={sectionStyle}>
      <h2 style={sectionHeaderStyle}>Education</h2>
      {education.map((edu, i) => (
        <div key={i}>
          <h3 style={{ fontWeight: "bold" }}>{edu.degree}</h3>
          <p>
            {edu.school} – {edu.year}
          </p>
        </div>
      ))}
    </div>
  );
}

function ProjectsSection({ projects }) {
  return (
    <div style={sectionStyle}>
      <h2 style={sectionHeaderStyle}>Projects</h2>
      {projects.map((proj, i) => (
        <div key={i} style={{ marginBottom: "12px" }}>
          <h3 style={{ fontWeight: "bold" }}>{proj.name}</h3>
          <p>{proj.description}</p>
        </div>
      ))}
    </div>
  );
}

function SkillsSection({ skills }) {
  return (
    <div style={sectionStyle}>
      <h2 style={sectionHeaderStyle}>Skills</h2>
      <div>
        {skills.map((s, i) => (
          <span key={i} style={skillStyle}>
            {s}
          </span>
        ))}
      </div>
    </div>
  );
}

// Parent Resume Component
export default function MyResume({ data }) {
  return (
    <div style={containerStyle}>
      <Header
        name={data.name}
        email={data.email}
        phone={data.phone}
        summary={data.summary}
      />
      <ExperienceSection experience={data.experience} />
      <EducationSection education={data.education} />
      <ProjectsSection projects={data.projects} />
      <SkillsSection skills={data.skills} />
    </div>
  );
}
