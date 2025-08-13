// src/componentes/Administradores/RegistroParticipante.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

function ParticipanteForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    imageUrl: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const storedUser = JSON.parse(localStorage.getItem("user"));
    const adminId = storedUser?.id;

    const payload = {
      ...formData,
      role: "participante",
      isActive: true,
      adminId,
    };

    console.log("Payload enviado:", payload); // 🔍 Verificar datos

    try {
  const res = await axios.post(`${API_URL}/user`, payload);
  alert("Participante registrado correctamente.");
  navigate("/dashboard-administrador", { state: { recargar: true } });
} catch (err) {
  console.error("Error al registrar participante:", err.response?.data || err.message);
  setError(err.response?.data?.message || "Error al registrar participante");
}
  };

  return (
    <div className="container">
      <h2>Registrar nuevo participante</h2>
      <form onSubmit={handleSubmit} autoComplete="off">
        <div>
          <label htmlFor="name">Nombre completo</label>
          <input
            id="name"
            type="text"
            name="name"
            autoComplete="off"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="email">Correo electrónico</label>
          <input
            id="email"
            type="email"
            name="email"
            autoComplete="off"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="password">Contraseña</label>
          <input
            id="password"
            type="password"
            name="password"
            autoComplete="new-password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="imageUrl">Imagen (URL)</label>
          <input
            id="imageUrl"
            type="text"
            name="imageUrl"
            autoComplete="off"
            value={formData.imageUrl}
            onChange={handleChange}
          />
        </div>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Registrando..." : "Registrar Participante"}
        </button>
      </form>
    </div>
  );
}

export default ParticipanteForm;
