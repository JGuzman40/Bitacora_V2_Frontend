import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./EditarReflexionForm.css"; // ← asegúrate que esté importado

const API_URL = import.meta.env.VITE_API_URL;

function EditarReflexionForm() {
  const [texto, setTexto] = useState("");
  const [audioURL, setAudioURL] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const [grabando, setGrabando] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunks = useRef([]);
  const navigate = useNavigate();

  const reflexionId = localStorage.getItem("reflexionId"); // ← temporal

  useEffect(() => {
    const fetchReflexion = async () => {
      try {
        const res = await axios.get(`${API_URL}/reflexion/${reflexionId}`);
        setTexto(res.data.texto);
        setAudioURL(res.data.audio_url);
      } catch (error) {
        console.error("Error al cargar la reflexión:", error);
        alert("No se pudo cargar la reflexión");
      }
    };

    fetchReflexion();
  }, [reflexionId]);

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
      const newBlob = new Blob(audioChunks.current, { type: "audio/webm" });
      setAudioBlob(newBlob);
      setAudioURL(URL.createObjectURL(newBlob));
    };

    mediaRecorder.start();
  };

  const handleStopRecording = () => {
    setGrabando(false);
    mediaRecorderRef.current.stop();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    if (audioBlob) formData.append("audio", audioBlob);
    formData.append("texto", texto);
    formData.append("fecha", new Date().toISOString().split("T")[0]);

    try {
      await axios.put(`${API_URL}/reflexion/${reflexionId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Reflexión actualizada");
      navigate("/historial-reflexiones");
    } catch (error) {
      console.error("Error al actualizar reflexión:", error);
      alert("Error al guardar los cambios");
    }
  };

  return (
    <div className="editar-container">
      <header className="editar-header">
        <h2>Editar Reflexión</h2>
      </header>

      <form className="editar-form" onSubmit={handleSubmit}>
        <label>Texto:</label>
        <textarea
          rows="3"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
        />

        <div className="audio-controls">
          {!grabando ? (
            <button type="button" onClick={handleStartRecording}>
              🎙️ Regrabar Audio
            </button>
          ) : (
            <button type="button" onClick={handleStopRecording}>
              🛑 Detener Grabación
            </button>
          )}
        </div>

        {audioURL && (
          <div className="audio-preview">
            <p>🎧 Audio actual:</p>
            <audio controls src={audioURL}></audio>
          </div>
        )}

        <button type="submit">Guardar Cambios</button>
      </form>

      <footer className="editar-footer">
        <p>Desarrollado por Jesu Guzman</p>
      </footer>
    </div>
  );
}

export default EditarReflexionForm;
