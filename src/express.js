// server.js
import express from "express";
import puppeteer from "puppeteer";

import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

// Sample resume data (you can later pass this from frontend)
const sampleData = {
  name: "John Doe",
  email: "john@example.com",
  phone: "+1 (555) 123-4567",
  summary:
    "Full-stack developer with 10+ years of experience building scalable web apps and leading teams across multiple projects. Extensive experience with React, Node.js, MongoDB, and cloud infrastructure.",
  experience: Array.from({ length: 10 }, (_, i) => ({
    title: `Software Engineer Level ${i + 1}`,
    company: `Company ${i + 1}`,
    start: `20${10 + i}`,
    end: `20${11 + i}`,
    bullets: Array.from(
      { length: 5 },
      (_, j) => `Worked on task ${j + 1} for Company ${i + 1}`
    ),
  })),
  education: [
    {
      degree: "BSc Computer Science",
      school: "University of Somewhere",
      year: "2010",
    },
    {
      degree: "MSc Computer Science",
      school: "University of Anywhere",
      year: "2012",
    },
  ],
  projects: Array.from({ length: 5 }, (_, i) => ({
    name: `Project ${i + 1}`,
    description: `This is a detailed description of Project ${
      i + 1
    }, showing what was done and technologies used.`,
  })),
  skills: [
    "JavaScript",
    "React",
    "Node.js",
    "CSS",
    "MongoDB",
    "AWS",
    "Docker",
    "Kubernetes",
  ],
};

// Endpoint to generate PDF
app.get("/generate-pdf", async (req, res) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Create HTML content dynamically using the sample data
 const htmlContent = `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; padding: 32px; line-height: 1.4; }
          h1 { font-size: 28px; font-weight: bold; text-align: center; }
          h2 { font-size: 22px; border-bottom: 1px solid #ccc; padding-bottom: 4px; margin-top: 32px;  }
          h3 { font-weight: bold; margin: 8px 0 4px 0; }
          p, li { color: #333; }
          ul { list-style-type: disc; padding-left: 20px; }
          .skills span { display: inline-block; margin: 4px; padding: 4px 12px; background-color: #ddd; border-radius: 8px; font-size: 0.875rem; }
          section { page-break-inside: avoid; }
        </style>
      </head>
      <body>
        <h1>${sampleData.name}</h1>
        <p style="text-align:center;">${sampleData.email} | ${
   sampleData.phone
 }</p>
        <p style="text-align:center;">${sampleData.summary}</p>

        <h2>Experience</h2>
        ${sampleData.experience
          .map(
            (exp) => `
          <section>
            <h3>${exp.title} – ${exp.company}</h3>
            <p>${exp.start} – ${exp.end}</p>
            <ul>${exp.bullets.map((b) => `<li>${b}</li>`).join("")}</ul>
          </section>
        `
          )
          .join("")}

        <h2>Education</h2>
        ${sampleData.education
          .map(
            (edu) => `
          <section>
            <h3>${edu.degree}</h3>
            <p>${edu.school} – ${edu.year}</p>
          </section>
        `
          )
          .join("")}

        <h2>Projects</h2>
        ${sampleData.projects
          .map(
            (p) => `
          <section>
            <h3>${p.name}</h3>
            <p>${p.description}</p>
          </section>
        `
          )
          .join("")}

        <h2>Skills</h2>
        <section class="skills">
          ${sampleData.skills.map((s) => `<span>${s}</span>`).join("")}
        </section>
      </body>
    </html>
  `;

  await page.setContent(htmlContent, { waitUntil: "networkidle0" });

  const pdf = await page.pdf({
    format: "A4",
    printBackground: true,
    margin: { top: "20px", bottom: "20px", left: "20px", right: "20px" },
  });

  await browser.close();

  res.contentType("application/pdf");
  res.send(pdf);
});

app.listen(4000, () =>
  console.log("PDF server running on http://localhost:4000")
);
