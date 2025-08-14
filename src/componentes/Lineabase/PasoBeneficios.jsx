import { useState, useRef } from "react";

const PasoBeneficios = ({ lineaBase, setLineaBase, siguientePaso, pasoAnterior }) => {
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
    if (!SpeechRecognition) {
      alert("Tu navegador no soporta transcripción en tiempo real.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "es-PE";

    recognition.onresult = (event) => {
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          setLineaBase((prev) => ({ ...prev, beneficios: prev.beneficios + transcript + " " }));
        } else {
          interim += transcript;
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
    <div>
      <h2>Estos son tus beneficios:</h2>
      <textarea
        value={lineaBase.beneficios}
        onChange={(e) => setLineaBase({ ...lineaBase, beneficios: e.target.value })}
        rows={4}
        placeholder="Describe tus beneficios o usa la grabación"
      />
      <div>
        {!grabando ? (
          <button onClick={handleStartRecording}>🎙️ Grabar</button>
        ) : (
          <button onClick={handleStopRecording}>🛑 Detener</button>
        )}
      </div>
      {audioBlob && <audio controls src={URL.createObjectURL(audioBlob)} />}
      <div>
        <button onClick={pasoAnterior}>Anterior</button>
        <button onClick={siguientePaso}>Siguiente</button>
      </div>
    </div>
  );
};

export default PasoBeneficios;
