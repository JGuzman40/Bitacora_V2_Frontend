import { useState } from "react";

const estadosIniciales = [
  "Ánimo",
  "Creatividad",
  "Conexión",
  "Autoeficacia",
  "Tranquilidad",
  "Contemplación",
  "Foco",
  "Energía",
  "Gratitud",
  "Motivación",
  "Confianza",
  "Relajación",
  "Intuición"
];

const PasoEstados = ({ lineaBase, setLineaBase, pasoAnterior, handleGuardar, loading }) => {
  const [estadosLocal, setEstadosLocal] = useState(
    lineaBase.estados?.length
      ? lineaBase.estados
      : estadosIniciales.map((nombre) => ({ nombre, valor: 3 }))
  );

  const handleCambioValor = (index, valor) => {
    const nuevosEstados = [...estadosLocal];
    nuevosEstados[index].valor = valor;
    setEstadosLocal(nuevosEstados);
    setLineaBase({ ...lineaBase, estados: nuevosEstados });
  };

  return (
    <div>
      <h2>Escala de Estados</h2>
      {estadosLocal.map((estado, index) => (
        <div key={index} style={{ marginBottom: "1rem" }}>
          <label>{estado.nombre}</label>
          <input
            type="range"
            min="1"
            max="5"
            value={estado.valor}
            onChange={(e) => handleCambioValor(index, parseInt(e.target.value))}
          />
          <span>{estado.valor}</span>
        </div>
      ))}

      <div style={{ marginTop: "1rem" }}>
        <button onClick={pasoAnterior} style={{ marginRight: "1rem" }}>Anterior</button>
        <button onClick={handleGuardar} disabled={loading}>
          {loading ? "Guardando..." : "Guardar Línea Base"}
        </button>
      </div>
    </div>
  );
};

export default PasoEstados;
