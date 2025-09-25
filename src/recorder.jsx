import React, { useEffect, useRef, useState } from "react";

/**
 * AudioRecorder component
 * - states: "notRecording" | "isRecording" | "doneRecording"
 * - startRecording -> set isRecording, hide start button, show timer+buttons
 * - cancel -> set notRecording, stop & discard
 * - send -> set notRecording and show "Audio is being processed"
 *
 * NOTE: Uses MediaRecorder API (browser support required).
 */

const MAX_SECONDS = 9 * 60 + 59; // 9:59 => 599 seconds

export default function AudioRecorder() {
  const [recordingState, setRecordingState] = useState("notRecording");
  const [secondsLeft, setSecondsLeft] = useState(MAX_SECONDS);
  const [audioProcessing, setAudioProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);

  const mediaRecorderRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const chunksRef = useRef([]);
  const intervalRef = useRef(null);

  // Helper: format seconds to M:SS
  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${String(sec).padStart(2, "0")}`;
  };

  // Start recording: request mic, create MediaRecorder, start interval countdown
  const startRecording = async () => {
    setError(null);
    setAudioProcessing(false);

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setError("Your browser doesn't support audio recording.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      // create MediaRecorder with best available mimeType
      let options = {};
      if (typeof MediaRecorder !== "undefined") {
        if (
          MediaRecorder.isTypeSupported &&
          MediaRecorder.isTypeSupported("audio/webm")
        ) {
          options.mimeType = "audio/webm";
        } else if (
          MediaRecorder.isTypeSupported &&
          MediaRecorder.isTypeSupported("audio/ogg")
        ) {
          options.mimeType = "audio/ogg";
        }
      }

      const mediaRecorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        // create blob/url for preview (if needed)
        const blob = new Blob(chunksRef.current, {
          type: chunksRef.current[0]?.type || "audio/webm",
        });
        if (audioUrl) {
          URL.revokeObjectURL(audioUrl);
        }
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
      };

      mediaRecorder.start();
      setRecordingState("isRecording");
      setSecondsLeft(MAX_SECONDS);

      // start countdown
      intervalRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
            // auto stop when hits 0
            stopRecordingAuto();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      console.error("startRecording error:", err);
      setError("Microphone permission denied or unavailable.");
      cleanupStream();
      setRecordingState("notRecording");
    }
  };

  // Auto-stop when timer reaches 0
  const stopRecordingAuto = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
    }
    cleanupStream();
    setRecordingState("doneRecording");
  };

  // Cancel: stop, discard recording, reset UI
  const cancelRecording = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    try {
      if (
        mediaRecorderRef.current &&
        mediaRecorderRef.current.state !== "inactive"
      ) {
        mediaRecorderRef.current.stop();
      }
    } catch (e) {
      // ignore
    }

    cleanupStream();

    // discard
    chunksRef.current = [];
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }

    setSecondsLeft(MAX_SECONDS);
    setRecordingState("notRecording");
    setAudioProcessing(false);
  };

  // Send: stop recording (if running), set user-visible processing message, set state to notRecording
  const sendRecording = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    try {
      if (
        mediaRecorderRef.current &&
        mediaRecorderRef.current.state !== "inactive"
      ) {
        mediaRecorderRef.current.stop();
      }
    } catch (e) {
      // ignore
    }

    cleanupStream();

    setSecondsLeft(MAX_SECONDS);
    setRecordingState("notRecording");

    // show processing message (you can hook this into an upload routine)
    setAudioProcessing(true);

    // Example: if you have to actually upload, do it here and then setAudioProcessing(false) when done.
    // For demo we keep it visible until further UI action by the consumer.
    // Optionally: setTimeout(() => setAudioProcessing(false), 3000);
  };

  // cleanup media stream + recorder refs
  const cleanupStream = () => {
    try {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((t) => t.stop());
        mediaStreamRef.current = null;
      }
    } catch (e) {
      // ignore
    }
    mediaRecorderRef.current = null;
  };

  // cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      cleanupStream();
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <style>{`
        .audio-recorder {
          max-width: 520px;
          margin: 18px auto;
          font-family: Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
        }

        .recorder-card {
          background: #fff;
          border: 1px solid #e6e6e6;
          border-radius: 10px;
          padding: 18px;
          box-shadow:
             0 8px 18px rgba(0,0,0,0.08),
             0 -4px 10px rgba(0,0,0,0.03),
             8px 0 10px rgba(0,0,0,0.03),
             -8px 0 10px rgba(0,0,0,0.03);
        }

        .start-btn {
          display: inline-block;
          background: #2563eb;
          color: white;
          border: none;
          padding: 10px 16px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          font-size: 15px;
        }

        .start-btn:active { transform: translateY(1px); }

        .record-panel {
          margin-top: 12px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }

        .timer-box {
          display:flex;
          align-items:center;
          gap:12px;
        }

        .red-dot {
          width:12px;
          height:12px;
          border-radius:50%;
          background: #ef4444;
          box-shadow: 0 0 6px rgba(239,68,68,0.5);
        }

        .timer {
          font-size: 18px;
          font-weight: 700;
          color: #111827;
        }

        .controls {
          display:flex;
          gap:8px;
        }

        .cancel-btn {
          background: #efefef;
          border: 1px solid #ddd;
          padding: 8px 12px;
          border-radius: 8px;
          cursor: pointer;
        }

        .send-btn {
          background: #10b981;
          border: none;
          color: white;
          padding: 8px 12px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
        }

        .info {
          margin-top: 12px;
          color: #374151;
          font-size: 14px;
        }

        .processing {
          margin-top: 12px;
          color: #064e3b;
          background: #ecfdf5;
          border: 1px solid #d1fae5;
          padding: 10px;
          border-radius: 8px;
        }

        .error {
          margin-top: 12px;
          color: #7f1d1d;
          background: #fff1f2;
          border: 1px solid #fecaca;
          padding: 10px;
          border-radius: 8px;
        }

        .audio-preview {
          margin-top: 12px;
        }
      `}</style>

      <div className="audio-recorder">
        <div className="recorder-card">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
            }}
          >
            <div>
              <div style={{ fontSize: 16, fontWeight: 700 }}>
                Voice Recording
              </div>
              <div style={{ fontSize: 13, color: "#6b7280", marginTop: 4 }}>
                Record a short voice note (up to 9:59). Use{" "}
                <strong>Send</strong> to submit or <strong>Cancel</strong> to
                discard.
              </div>
            </div>

            {recordingState === "notRecording" && (
              <button className="start-btn" onClick={startRecording}>
                Start Recording
              </button>
            )}
          </div>

          {/* Recording panel (visible while recording or if recording finished) */}
          {(recordingState === "isRecording" ||
            recordingState === "doneRecording") && (
            <div className="record-panel" style={{ marginTop: 16 }}>
              <div className="timer-box">
                <div className="red-dot" aria-hidden />
                <div className="timer">
                  {recordingState === "isRecording"
                    ? `Recording — ${formatTime(secondsLeft)}`
                    : "Recording finished"}
                </div>
              </div>

              <div className="controls">
                <button className="cancel-btn" onClick={cancelRecording}>
                  Cancel
                </button>
                <button className="send-btn" onClick={sendRecording}>
                  Send
                </button>
              </div>
            </div>
          )}

          {error && <div className="error">{error}</div>}

          {audioProcessing && (
            <div className="processing">Audio is being processed</div>
          )}

          {/* optional preview when a recording exists and we're not currently processing */}
          {audioUrl && !audioProcessing && (
            <div className="audio-preview">
              <div className="info">Preview:</div>
              <audio
                controls
                src={audioUrl}
                style={{ marginTop: 8, width: "100%" }}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
