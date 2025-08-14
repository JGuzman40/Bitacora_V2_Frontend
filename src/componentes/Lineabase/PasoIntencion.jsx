import { useState, useRef } from "react";

const PasoIntencion = ({ lineaBase, setLineaBase, siguientePaso }) => {
  const [grabando, setGrabando] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunks = useRef([]);
  const recognitionRef = useRef(null);

  const handleStartRecording = async () => {
    setGrabando(true);
    audioChunks.current = [];

    // --- Grabación ---
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) audioChunks.current.push(event.data);
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(audioChunks.current, { type: "audio/webm" });
      setAudioBlob(blob);
    };

    mediaRecorder.start();

    // --- Transcripción en tiempo real ---
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "es-PE";

    recognition.onresult = (event) => {
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          setLineaBase((prev) => ({
            ...prev,
            intencion: prev.intencion + transcript + " ",
          }));
        }
      }
    };

    recognition.start();
  };

  const handleStopRecording = () => {
    setGrabando(false);
    mediaRecorderRef.current.stop();
    if (recognitionRef.current) recognitionRef.current.stop();
  };

  return (
    <div className="paso-intencion">
      <h2>Línea Base – Esta es tu intención:</h2>
      <textarea
        value={lineaBase.intencion}
        onChange={(e) => setLineaBase({ ...lineaBase, intencion: e.target.value })}
        rows={4}
        placeholder="Escribe tu intención o usa la grabación"
      />
      <div className="grabacion-controls">
        {!grabando ? (
          <button onClick={handleStartRecording}>🎙️ Grabar</button>
        ) : (
          <button onClick={handleStopRecording}>🛑 Detener</button>
        )}
      </div>
      {audioBlob && <audio controls src={URL.createObjectURL(audioBlob)} />}
      <button onClick={siguientePaso}>Siguiente</button>
    </div>
  );
};

export default PasoIntencion;
