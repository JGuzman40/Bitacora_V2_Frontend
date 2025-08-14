// src/pages/LineaBase/LineaBaseService.js
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL; // tu variable de entorno

const LineaBaseService = {
  // Crear nueva línea base
  createLineaBase: async (data, token) => {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const response = await axios.post(`${API_URL}/lineabase`, data, { headers });
    return response.data;
  },

  // Obtener línea base por usuario
  getLineaBasePorUsuario: async (usuarioId, token) => {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const response = await axios.get(`${API_URL}/lineabase/usuario/${usuarioId}`, { headers });
    return response.data;
  },

  // Actualizar línea base existente
  updateLineaBase: async (usuarioId, data, token) => {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const response = await axios.put(`${API_URL}/lineabase/${usuarioId}`, data, { headers });
    return response.data;
  },
};

export default LineaBaseService;
