import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import LineaBaseService from "../LineaBase/LineBaseService";
import "./DashboardParticipante.css";

// ---------- INTENCIÓN DESPLEGABLE ----------
const IntencionAccordion = ({ lineaBase }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="accordion-item">
      <button className="accordion-button" onClick={() => setOpen(!open)}>
        Intención {open ? "▲" : "▼"}
      </button>
      {open && (
        <div className="accordion-content">
          <p><strong>Intención:</strong> {lineaBase.intencion}</p>
          <p><strong>Desafíos:</strong> {lineaBase.desafios}</p>
          <p><strong>Beneficios:</strong> {lineaBase.beneficios}</p>
        </div>
      )}
    </div>
  );
};

// ---------- ELEMENTOS ----------
const ElementosAccordion = ({ elementos }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="accordion-item">
      <button className="accordion-button" onClick={() => setOpen(!open)}>
        Elementos {open ? "▲" : "▼"}
      </button>
      {open && (
        <div className="accordion-content">
          {elementos.map((el, index) => (
            <div className="elemento-card" key={index}>
              <p className="elemento-pregunta">{el.respuesta?.nombre || el.nombre}</p>
              <p className="elemento-respuesta">{el.respuesta?.respuesta || el.respuesta}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ---------- GRÁFICO RADIAL DE ESTADOS ----------
const EstadosRadial = ({ estados }) => {
  const radius = 80;
  const center = 100;
  const angleStep = (2 * Math.PI) / estados.length;

  return (
    <svg width={220} height={220} className="radial-chart">
      {estados.map((e, i) => {
        const angle = i * angleStep - Math.PI / 2;
        const x = center + Math.cos(angle) * radius * (e.valor / 5); // escala 0-5
        const y = center + Math.sin(angle) * radius * (e.valor / 5);
        return (
          <line
            key={i}
            x1={center}
            y1={center}
            x2={x}
            y2={y}
            stroke="#06D6A0"
            strokeWidth={2}
          />
        );
      })}
      <circle cx={center} cy={center} r={radius} fill="none" stroke="#ccc" strokeWidth={1} />
    </svg>
  );
};

// ---------- DASHBOARD PARTICIPANTE ----------
function DashboardParticipante() {
  const [participante, setParticipante] = useState(null);
  const [lineaBase, setLineaBase] = useState(null);
  const [audioText, setAudioText] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || user.role !== "participante") navigate("/login");
    else {
      setParticipante(user);
      const fetchLineaBase = async () => {
        try {
          const response = await LineaBaseService.getLineaBasePorUsuario(user.id, user.token);
          if (response?.lineaBase) setLineaBase(response.lineaBase);
        } catch (err) {
          console.error("Error al cargar línea base:", err);
        }
      };
      fetchLineaBase();
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
        <p>Estamos contentos de acompañarte en este proceso personal 🙏</p>
      </header>

      <main className="participante-main">
        {/* PREGUNTA DEL DÍA */}
        <div className="pregunta-dia">
          <h2>¿Cómo te has sentido hoy?</h2>
          <input
            type="text"
            placeholder="Escribe o graba tu reflexión"
            value={audioText}
            onChange={(e) => setAudioText(e.target.value)}
          />
        </div>

        {lineaBase && (
          <div className="linea-base-dashboard">
            {/* Intención desplegable */}
            <IntencionAccordion lineaBase={lineaBase} />

            {/* Elementos desplegable */}
            <ElementosAccordion elementos={lineaBase.elementos} />

            {/* Gráfico radial */}
            <div className="estados-radial-container">
              <h3>Estados</h3>
              <EstadosRadial estados={lineaBase.estados} />
            </div>
          </div>
        )}

        {/* Bitácora */}
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
