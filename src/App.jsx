// App.jsx
import React from "react";
import MyResume from "./resume";
import InstructionArray from "./sampledata";
import { sampleUserData } from "./sampledata";
import DataCollection from "./datacollection";
import AudioRecorder from "./recorder";
import SecondRecorder from "./secondrecorder";

const appStyle = {
  minHeight: "100vh",
  padding: "24px",
  backgroundColor: "#f3f3f3",
};

export default function App() {
  return (
    <div style={appStyle}>
      <MyResume data={sampleUserData} />
      <h1>Below is the data collection section.</h1>
      <DataCollection />
      <h1>Below is the recoder testing </h1>
      <AudioRecorder />
    </div>
  );
}
