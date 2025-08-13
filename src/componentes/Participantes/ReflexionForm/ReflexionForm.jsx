import { useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./ReflexionForm.css";

const API_URL= import.meta.env.VITE_API_URL;

function ReflexionForm() {
  const [texto, setTexto] = useState("");
  const [grabando, setGrabando] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunks = useRef([]);
  const navigate = useNavigate();

  const handleStartRecording = async () => {
    setGrabando(true);
    audioChunks.current = [];

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunks.current.push(event.data);
      }
    };

    mediaRecorder.onstop = () => {
      const audioBlob = new Blob(audioChunks.current, { type: "audio/ogg" });
      setAudioBlob(audioBlob);
      setAudioURL(URL.createObjectURL(audioBlob));
    };

    mediaRecorder.start();
  };

  const handleStopRecording = () => {
    setGrabando(false);
    mediaRecorderRef.current.stop();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem("user"));
    const formData = new FormData();

    if (audioBlob) formData.append("audio", audioBlob);
    formData.append("texto", texto);
    formData.append("usuarioId", user?.id);
    formData.append("fecha", new Date().toISOString().split("T")[0]);

    try {
      await axios.post(`${API_URL}/reflexion`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Reflexión guardada con éxito 🙌");
      setTexto("");
      setAudioBlob(null);
      setAudioURL(null);
      navigate("/historial-reflexiones");
    } catch (error) {
      console.error("Error al guardar reflexión:", error);
      alert("Hubo un problema al guardar la reflexión");
    }
  };

  return (
    <div className="reflexion-container">
      <header className="reflexion-header">
        <h2>Registrar Reflexión</h2>
      </header>

      <main className="reflexion-main">
        <form className="reflexion-form" onSubmit={handleSubmit}>
            <div className="audio-controls">
            {!grabando ? (
              <button type="button" onClick={handleStartRecording}>
                🎙️ Iniciar Grabación
              </button>
            ) : (
              <button type="button" onClick={handleStopRecording}>
                🛑 Detener Grabación
              </button>
            )}
          </div>
          <label htmlFor="texto"></label>
          <textarea
            id="texto"
            name="texto"
            rows="2"
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
          />

          {audioURL && (
            <div className="audio-preview">
              <p>🎧 Audio grabado:</p>
              <audio controls src={audioURL}></audio>
               <button type="button" onClick={() => {
      setAudioBlob(null);
      setAudioURL(null);
    }}>
      🔄 Regrabar
    </button>
            </div>
          )}

          <button type="submit">Guardar Reflexión</button>
        </form>

        <Link to="/dashboard-participante">
          <button className="volver-btn">Regresar</button>
        </Link>
      </main>

      <footer className="reflexion-footer">
        <p>Desarrollado por Jesu Guzman</p>
      </footer>
    </div>
  );
}

export default ReflexionForm;
