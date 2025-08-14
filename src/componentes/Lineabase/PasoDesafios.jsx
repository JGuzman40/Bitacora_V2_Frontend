import { useState, useRef } from "react";

const PasoDesafios = ({ lineaBase, setLineaBase, siguientePaso, pasoAnterior }) => {
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
            desafios: prev.desafios + transcript + " ",
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
    <div className="paso-desafios">
      <h2>Línea Base – Estos son tus desafíos:</h2>
      <textarea
        value={lineaBase.desafios}
        onChange={(e) => setLineaBase({ ...lineaBase, desafios: e.target.value })}
        rows={4}
        placeholder="Describe tus desafíos o usa la grabación"
      />
      <div className="grabacion-controls">
        {!grabando ? (
          <button onClick={handleStartRecording}>🎙️ Grabar</button>
        ) : (
          <button onClick={handleStopRecording}>🛑 Detener</button>
        )}
      </div>
      {audioBlob && <audio controls src={URL.createObjectURL(audioBlob)} />}
      <div className="paso-buttons">
        <button onClick={pasoAnterior}>Anterior</button>
        <button onClick={siguientePaso}>Siguiente</button>
      </div>
    </div>
  );
};

export default PasoDesafios;
