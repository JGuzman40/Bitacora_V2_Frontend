import { useState, useEffect } from "react";
import LineaBaseService from "./LineBaseService";
import PasoIntencion from "./PasoIntencion";
import PasoDesafios from "./PasoDesafios";
import PasoBeneficios from "./PasoBeneficios";
import PasoElementos from "./PasoElementos";
import PasoEstados from "./PasoEstados";
import { useNavigate } from "react-router-dom";
import "./LineaBase.css";

const LineaBaseForm = () => {
  const navigate = useNavigate();
  const [paso, setPaso] = useState(0);
  const [loading, setLoading] = useState(false);
  const [lineaBase, setLineaBase] = useState({
    intencion: "",
    desafios: "",
    beneficios: "",
    elementos: [],
    estados: [],
  });

  // Usuario y token desde localStorage
  const user = JSON.parse(localStorage.getItem("user"));
  const token = user?.token; // asumimos que guardaste token al loguear

  // Cargar línea base existente
  useEffect(() => {
    const fetchLineaBase = async () => {
      try {
        const response = await LineaBaseService.getLineaBasePorUsuario(user.id, token);
        if (response?.lineaBase) {
          setLineaBase(response.lineaBase);
        }
      } catch (err) {
        console.log("No se encontró línea base:", err);
      }
    };
    fetchLineaBase();
  }, [user.id, token]);

  const siguientePaso = () => setPaso((prev) => prev + 1);
  const pasoAnterior = () => setPaso((prev) => prev - 1);

  // Guardar o actualizar línea base en backend
 const handleGuardar = async () => {
  setLoading(true);

  try {
    // Crear el payload correcto para el backend
    const payload = {
      usuarioId: user.id, // asegúrate de incluir el id del usuario
      intencion: lineaBase.intencion || "",
      desafios: lineaBase.desafios || "",
      beneficios: lineaBase.beneficios || "",
      elementos: (lineaBase.elementos || []).map((resp, i) => ({
        nombre: `Elemento ${i + 1}`,
        respuesta: resp || ""
      })),
      estados: lineaBase.estados || []
    };

    console.log("Payload que se enviará al backend:", payload);

    // Crear o actualizar línea base según corresponda
    if (lineaBase.id) {
      await LineaBaseService.updateLineaBase(user.id, payload);
    } else {
      await LineaBaseService.createLineaBase(payload);
    }

    alert("Línea Base guardada exitosamente");
    navigate("/dashboard-participante");
  } catch (err) {
    console.error("Error al guardar la línea base:", err);
    alert("Error al guardar la Línea Base");
  } finally {
    setLoading(false);
  }
};


  // Renderiza el paso correspondiente
  const renderPaso = () => {
    switch (paso) {
      case 0:
        return <PasoIntencion lineaBase={lineaBase} setLineaBase={setLineaBase} siguientePaso={siguientePaso} />;
      case 1:
        return <PasoDesafios lineaBase={lineaBase} setLineaBase={setLineaBase} siguientePaso={siguientePaso} pasoAnterior={pasoAnterior} />;
      case 2:
        return <PasoBeneficios lineaBase={lineaBase} setLineaBase={setLineaBase} siguientePaso={siguientePaso} pasoAnterior={pasoAnterior} />;
      case 3:
        return <PasoElementos lineaBase={lineaBase} setLineaBase={setLineaBase} siguientePaso={siguientePaso} pasoAnterior={pasoAnterior} />;
      case 4:
        return <PasoEstados lineaBase={lineaBase} setLineaBase={setLineaBase} pasoAnterior={pasoAnterior} handleGuardar={handleGuardar} loading={loading} />;
      default:
        return null;
    }
  };

  return (
    <div className="linea-base-container">
      <h1>Línea Base</h1>
      {renderPaso()}
    </div>
  );
};

export default LineaBaseForm;
