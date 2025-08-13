// src/componentes/Administradores/DashboardAdministrador.jsx
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./DashboardAdmin.css";

const API_URL = import.meta.env.VITE_API_URL;

function DashboardAdministrador() {
  const [admin, setAdmin] = useState(null);
  const [participantes, setParticipantes] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  const salir = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const fetchParticipantes = async (adminId) => {
    try {
      const { data } = await axios.get(
        `${API_URL}/user/admin/${adminId}/participantes`
      );

      const participantesConEstado = await Promise.all(
        data.map(async (p) => {
          try {
            const { data: reflexiones } =await axios.get(
              `${API_URL}/reflexion/usuario/${p.id}`
            );
            const comparte = reflexiones.some((r) => r.compartirConTerapeuta);
            return { ...p, comparte };
          } catch (err) {
            console.error("Error reflexiones usuario", p.id, err);
            return { ...p, comparte: false };
          }
        })
      );

      setParticipantes(participantesConEstado);
    } catch (err) {
      console.error("Error al obtener participantes:", err);
    }
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.id) {
      setAdmin(user);
      fetchParticipantes(user.id);
    }
  }, [location.pathname]);

  return (
    <div className="admin-container">
      {/* ───── Header con imagen ───── */}
      <header className="admin-header">
        <div className="admin-header__left">
          {admin?.imageUrl && (
            <img
              src={admin.imageUrl}
              alt="avatar admin"
              className="avatar avatar--lg"
            />
          )}
          <div>
            <h2>{admin?.name}</h2>
            <small>{admin?.email}</small>
          </div>
        </div>

        <div className="admin-header__right">
          <Link to="/registro-participante">
            <button className="btn btn--primary">Registrar participante</button>
          </Link>
          <button className="btn btn--secondary" onClick={salir}>
            Cerrar sesión
          </button>
        </div>
      </header>

      {/* ───── Tabla de participantes ───── */}
      <section className="admin-table-wrapper">
        <h3>Participantes registrados</h3>

        {participantes.length === 0 ? (
          <p>No hay participantes registrados todavía.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Foto</th>
                <th>Nombre</th>
                <th>Email</th>
                <th>Comparte</th>
              </tr>
            </thead>
            <tbody>
              {participantes.map((p) => (
                <tr key={p.id}>
                  <td>
                    <img
                      src={
                        p.imageUrl ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(p.name)}`
                      }
                      alt="avatar participante"
                      className="avatar"
                    />
                  </td>
                  <td>{p.name}</td>
                  <td>{p.email}</td>
                  <td className={p.comparte ? "ok" : "ko"}>
                    {p.comparte ? "Sí" : "No"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* ───── Footer ───── */}
      <footer className="admin-footer">
        <p>Desarrollado por Jesu Guzman</p>
      </footer>
    </div>
  );
}

export default DashboardAdministrador;
