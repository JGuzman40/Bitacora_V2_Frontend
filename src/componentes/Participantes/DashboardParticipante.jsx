import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./DashboardParticipante.css";

function DashboardParticipante() {
  const [participante, setParticipante] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || user.role !== "participante") {
      navigate("/login");
    } else {
      setParticipante(user);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="participante-container">
      <header className="participante-header">
        <h1>Bienvenido, {participante?.name}</h1>
      </header>

      <main className="participante-main">
        <p>Estamos contentos de acompañarte en este proceso personal 🙏</p>
        <h2>Tu Bitácora</h2>

        <div className="acciones-participante">
          <Link to="/registro-reflexion">
            <button>Grabar Reflexión</button>
          </Link>
          <Link to="/historial-reflexiones">
            <button>Ver Proceso</button>
          </Link>
        </div>
        <button onClick={handleLogout}>Cerrar sesión</button>
      </main>

      <footer className="participante-footer">
        <p>Desarrollado por Jesu Guzman</p>
      </footer>
    </div>
  );
}

export default DashboardParticipante;
