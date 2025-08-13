import { useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

function CrearAdmin() {
  const [formData, setFormData] = useState({
    name: "Admin",
    email: "admin@bitacora.com",
    password: "admin123",
    imageUrl: "",
  });
  const [mensaje, setMensaje] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCrear = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/user`, {
        ...formData,
        role: "admin",
        isActive: true,
      });
      setMensaje("✅ Admin creado correctamente");
    } catch (err) {
      setMensaje(err.response?.data?.error || "❌ Error al crear admin");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Crear Admin (temporal)</h2>
      <form onSubmit={handleCrear}>
        <input name="name" placeholder="Nombre" onChange={handleChange} /><br />
        <input name="email" placeholder="Email" onChange={handleChange} /><br />
        <input name="password" type="password" placeholder="Contraseña" onChange={handleChange} /><br />
        <input name="imageUrl" placeholder="Imagen (opcional)" onChange={handleChange} /><br />
        <button type="submit">Crear Admin</button>
      </form>
      <p>{mensaje}</p>
    </div>
  );
}

export default CrearAdmin;
