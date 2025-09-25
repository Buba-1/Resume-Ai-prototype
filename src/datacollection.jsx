import React from "react";
import SecondRecorder from "./secondrecorder";
import InstructionArray from "./sampledata";



const DataCollection = () => {
  return (
    <>
      <style>{`
        .resume-container {
          padding: 24px;
        }

        .resume-card {
          background: #ffffff;
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 20px;

          /* shadow on all 4 sides */
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1),
                      0 -2px 6px rgba(0, 0, 0, 0.05),
                      6px 0 6px rgba(0, 0, 0, 0.05),
                      -6px 0 6px rgba(0, 0, 0, 0.05);
        }

        .resume-title {
          font-size: 20px;
          font-weight: 600;
          margin-bottom: 8px;
          color: #333;
        }

        .resume-instruction {
          font-size: 16px;
          color: #555;
          line-height: 1.5;
        }
      `}</style>

      <div className="resume-container">
        {InstructionArray.map((section, index) => (
          <div key={index} className="resume-card">
            <h2 className="resume-title">{section.title}</h2>
            <p className="resume-instruction">{section.instruction}</p>
            <SecondRecorder />
          </div>
        ))}
      </div>
    </>
  );
};

export default DataCollection;
