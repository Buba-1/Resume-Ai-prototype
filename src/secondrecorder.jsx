import React, { useState, useEffect, useRef } from "react";

const SecondRecorder = () => {
  const [windowState, setWindowState] = useState("readyToRecord");
  const [timeLeft, setTimeLeft] = useState(599); // 9:59
  const [isPaused, setIsPaused] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [error, setError] = useState(null);

  const mediaRecorderRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const chunksRef = useRef([]);
  const audioRef = useRef(null);

  // -------------------- Timer effect --------------------
  useEffect(() => {
    let timer = null;
    if (windowState === "isRecording" && !isPaused && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [windowState, isPaused, timeLeft]);
  // -------------------- End Timer effect --------------------

  // -------------------- Recording Functions --------------------
  const startRecording = async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      chunksRef.current = [];

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        setWindowState("fetchRecord"); // move to fetch state

        // Simulate async processing (upload / processing)
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const audioFileUrl = URL.createObjectURL(blob);

        // Simulate network delay for processing
        setTimeout(() => {
          setAudioUrl(audioFileUrl);
          setWindowState("doneRecording");
        }, 2000);
      };

      mediaRecorder.start();
      setWindowState("isRecording");
      setTimeLeft(599);
      setIsPaused(false);
    } catch (err) {
      setError("Microphone access denied or unavailable.");
    }
  };

  const pauseRecording = () => {
    if (!mediaRecorderRef.current) return;

    if (mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
    } else if (mediaRecorderRef.current.state === "paused") {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
    }
  };

  const finishRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
    }
    stopStream();
  };

  const cancelRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
    }
    stopStream();
    setWindowState("readyToRecord");
    setAudioUrl(null);
    setTimeLeft(599);
    setIsPaused(false);
  };

  const sendRecording = () => {
    setWindowState("readyToRecord");
    setAudioUrl(null);
  };

  const stopStream = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
  };
  // -------------------- End Recording Functions --------------------

  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
  };

  return (
    <>
      <style>{`
        .recorder-container {
          padding: 24px;
          text-align: center;
          font-family: Arial, sans-serif;
          max-width: 420px;
          margin: 40px auto;
          background: #ffffff;
          border-radius: 16px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1),
                      0 -2px 6px rgba(0,0,0,0.05),
                      6px 0 6px rgba(0,0,0,0.05),
                      -6px 0 6px rgba(0,0,0,0.05);
        }

        .btn {
          margin: 8px;
          padding: 12px 24px;
          border: none;
          border-radius: 50px;
          font-size: 15px;
          cursor: pointer;
          background-color: #007bff;
          color: white;
          transition: all 0.2s ease;
          box-shadow: 0 2px 6px rgba(0,0,0,0.15);
        }

        .btn:hover { transform: translateY(-2px); }

        .btn-cancel { background-color: #dc3545; }
        .btn-cancel:hover { background-color: #a71d2a; }

        .btn-secondary { background-color: #6c757d; }
        .btn-secondary:hover { background-color: #565e64; }

        .timer { font-size: 28px; margin: 20px 0; font-weight: bold; color: #333; }

        .preview-controls { margin-top: 15px; }

        .info-message { font-size: 14px; color: #555; margin-top: 10px; }

        .loading {
          font-size: 16px;
          font-weight: 500;
          margin-top: 20px;
          color: #2563eb;
        }

        .dot {
          display: inline-block;
          width: 6px;
          height: 6px;
          margin-left: 4px;
          border-radius: 50%;
          background-color: #2563eb;
          animation: blink 1s infinite alternate;
        }

        .dot:nth-child(2) { animation-delay: 0.2s; }
        .dot:nth-child(3) { animation-delay: 0.4s; }

        @keyframes blink { 0% { opacity: 0; } 100% { opacity: 1; } }

        audio { margin-top: 12px; width: 100%; border-radius: 8px; }
      `}</style>

      <div className="recorder-container">
        {/* Ready to Record */}
        {windowState === "readyToRecord" && (
          <div>
            <button className="btn" onClick={startRecording}>
              Start Recording
            </button>
            <p className="info-message">
              Click the button to start recording your message. You can pause,
              cancel, or finish anytime.
            </p>
            {error && <p style={{ color: "red" }}>{error}</p>}
          </div>
        )}

        {/* Recording Panel */}
        {windowState === "isRecording" && (
          <div>
            <div className="timer">{formatTime(timeLeft)}</div>
            <button className="btn-cancel btn" onClick={cancelRecording}>
              Cancel
            </button>
            <button className="btn-secondary btn" onClick={pauseRecording}>
              {isPaused ? "Resume" : "Pause"}
            </button>
            <button className="btn" onClick={finishRecording}>
              Finish Recording
            </button>
          </div>
        )}

        {/* Fetch / processing */}
        {windowState === "fetchRecord" && (
          <div className="loading">
            Processing record
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
          </div>
        )}

        {/* Preview Panel */}
        {windowState === "doneRecording" && (
          <div>
            <h3>Preview Recording</h3>
            {audioUrl ? (
              <audio controls ref={audioRef} src={audioUrl}></audio>
            ) : (
              <p>No audio available</p>
            )}
            <div className="preview-controls">
              <button className="btn" onClick={sendRecording}>
                Send
              </button>
              <button className="btn-cancel btn" onClick={cancelRecording}>
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default SecondRecorder;
