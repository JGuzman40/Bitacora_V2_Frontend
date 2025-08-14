import { useState, useRef } from "react";

const preguntas = [
  "¿Has hecho, sentido o pensado algo distinto a lo habitual?",
  "¿Tuviste sueños o sincronicidades relevantes?",
  "¿Algún cambio en tu energía sexual?",
  "¿Cómo te has sentido hoy?",
  "¿Ha impactado tu alimentación/energía hoy?",
  "¿Mejoras en tu salud o medicación?",
];

const PasoElementos = ({ lineaBase, setLineaBase, siguientePaso, pasoAnterior }) => {
  const [grabandoIndex, setGrabandoIndex] = useState(null);
  const [audioBlobs, setAudioBlobs] = useState(Array(6).fill(null));
  const mediaRecorderRef = useRef(null);
  const audioChunks = useRef([]);
  const recognitionRef = useRef(null);

  const handleStartRecording = async (index) => {
    setGrabandoIndex(index);
    audioChunks.current = [];

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) audioChunks.current.push(event.data);
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(audioChunks.current, { type: "audio/webm" });
      setAudioBlobs((prev) => {
        const nuevos = [...prev];
        nuevos[index] = blob;
        return nuevos;
      });
    };

    mediaRecorder.start();

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
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
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          setLineaBase((prev) => {
            const nuevosElementos = [...prev.elementos];
            nuevosElementos[index] = {
              nombre: preguntas[index],
              respuesta: (nuevosElementos[index]?.respuesta || "") + transcript + " "
            };
            return { ...prev, elementos: nuevosElementos };
          });
        }
      }
    };

    recognition.start();
  };

  const handleStopRecording = () => {
    setGrabandoIndex(null);
    mediaRecorderRef.current.stop();
    if (recognitionRef.current) recognitionRef.current.stop();
  };

  const handleChange = (index, value) => {
    setLineaBase((prev) => {
      const nuevosElementos = [...prev.elementos];
      nuevosElementos[index] = {
        nombre: preguntas[index],
        respuesta: value
      };
      return { ...prev, elementos: nuevosElementos };
    });
  };

  return (
    <div>
      <h2>Basado en aspectos de Cuidado/Soporte:</h2>
      {preguntas.map((pregunta, index) => (
        <div key={index} style={{ marginBottom: "1rem" }}>
          <p>{pregunta}</p>
          <textarea
            value={lineaBase.elementos[index]?.respuesta || ""}
            onChange={(e) => handleChange(index, e.target.value)}
            rows={3}
            placeholder="Escribe tu respuesta o usa la grabación"
          />
          <div>
            {grabandoIndex !== index ? (
              <button onClick={() => handleStartRecording(index)}>🎙️ Grabar</button>
            ) : (
              <button onClick={handleStopRecording}>🛑 Detener</button>
            )}
          </div>
          {audioBlobs[index] && <audio controls src={URL.createObjectURL(audioBlobs[index])} />}
        </div>
      ))}

      <div>
        <button onClick={pasoAnterior}>Anterior</button>
        <button onClick={siguientePaso}>Siguiente</button>
      </div>
    </div>
  );
};

export default PasoElementos;
