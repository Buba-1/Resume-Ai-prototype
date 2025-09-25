import React, { useState } from "react";

const EditablePage = ({ dataArray }) => {
  const [statuses, setStatuses] = useState(dataArray.map(() => "reviewing"));
  const [texts, setTexts] = useState(
    dataArray.map((item) => item.transcription)
  );
  const [confirmedData, setConfirmedData] = useState([]); // new array for confirmed data

  const handleConfirm = (index) => {
    const newStatuses = [...statuses];
    newStatuses[index] = "confirmed";
    setStatuses(newStatuses);

    const newEntry = {
      category: dataArray[index].category,
      fieldInput: texts[index],
    };

    setConfirmedData((prev) => {
      // update if category already exists, otherwise append
      const filtered = prev.filter(
        (item) => item.category !== newEntry.category
      );
      return [...filtered, newEntry];
    });
  };

  const handleEditAgain = (index) => {
    const newStatuses = [...statuses];
    newStatuses[index] = "reviewing";
    setStatuses(newStatuses);

    // Optional: remove entry from confirmedData when user edits again
    setConfirmedData((prev) =>
      prev.filter((item) => item.category !== dataArray[index].category)
    );
  };

  const handleTextChange = (index, value) => {
    const newTexts = [...texts];
    newTexts[index] = value;
    setTexts(newTexts);
  };

  const handleSubmit = () => {
    console.log("Confirmed Data:", confirmedData);
  };

  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "2rem auto",
        fontFamily: "'Segoe UI', sans-serif",
      }}
    >
      {dataArray.map((item, index) => (
        <div
          key={index}
          style={{
            border: "1px solid #ddd",
            borderRadius: "8px",
            padding: "1rem",
            marginBottom: "1.5rem",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            backgroundColor: "#fff",
            transition: "all 0.3s ease",
          }}
        >
          <h3 style={{ marginBottom: "0.75rem", color: "#333" }}>
            {item.category}
          </h3>

          <textarea
            value={texts[index]}
            onChange={(e) => handleTextChange(index, e.target.value)}
            style={{
              width: "100%",
              padding: "0.75rem",
              fontSize: "1rem",
              borderRadius: "6px",
              border: "1px solid #ccc",
              resize: "vertical",
              minHeight: "100px",
              maxHeight: "600px",
              marginBottom: "1rem",
              boxSizing: "border-box",
              fontFamily: "inherit",
            }}
          />

          {/* Conditional rendering */}
          {statuses[index] === "reviewing" && (
            <button
              onClick={() => handleConfirm(index)}
              style={{
                backgroundColor: "#007BFF",
                color: "#fff",
                border: "none",
                padding: "0.5rem 1.2rem",
                borderRadius: "5px",
                cursor: "pointer",
                fontWeight: "bold",
                transition: "background-color 0.3s ease",
              }}
            >
              Confirm
            </button>
          )}

          {statuses[index] === "confirmed" && (
            <>
              <div
                style={{
                  color: "green",
                  fontWeight: "bold",
                  marginBottom: "0.5rem",
                }}
              >
                Confirmed
              </div>
              <button
                onClick={() => handleEditAgain(index)}
                style={{
                  backgroundColor: "#FFA500",
                  color: "#fff",
                  border: "none",
                  padding: "0.5rem 1.2rem",
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontWeight: "bold",
                  transition: "background-color 0.3s ease",
                }}
              >
                Make More Edits
              </button>
            </>
          )}
        </div>
      ))}

      {/* Submit button */}
      <div style={{ textAlign: "center", marginTop: "2rem" }}>
        <button
          onClick={handleSubmit}
          style={{
            backgroundColor: "#28a745",
            color: "#fff",
            border: "none",
            padding: "0.75rem 2rem",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "1.1rem",
            fontWeight: "bold",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            transition: "background-color 0.3s ease",
          }}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default EditablePage;
