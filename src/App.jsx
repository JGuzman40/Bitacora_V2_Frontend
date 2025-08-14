import { Routes, Route } from "react-router-dom";
import Landing from "./componentes/Landing/Landing";
import CrearAdmin from "./componentes/CrearAdmin";
import LoginForm from "./componentes/Login/LoginForm";
import DashboardAdministrador from "./componentes/Administradores/DashboardAdmin";
import DashboardParticipante from "./componentes/Participantes/DashboardParticipante";
import PrivateRoute from "./componentes/PrivateRoute";
import ParticipanteForm from "./componentes/Administradores/PartipanteForm/ParticipanteForm";
import ReflexionForm from "./componentes/Participantes/ReflexionForm/ReflexionForm";
import HistorialReflexiones from "./componentes/Participantes/Proceso/HistorialReflexiones";
import EditarReflexionForm from "./componentes/Participantes/ReflexionForm/EditarReflexionForm/EditarReflexionForm";
import LineaBaseForm from "./componentes/Lineabase/LineabaseForm";

function App() {
  return (
    <div className="app-container">
      <main>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/crear-admin" element={<CrearAdmin />} />
          <Route path="/login" element={<LoginForm />} />
          
          <Route
            path="/dashboard-administrador"
            element={
              <PrivateRoute requiredRole="admin"> 
                <DashboardAdministrador />
              </PrivateRoute>
            }
          />
          <Route path="/registro-participante" element={<ParticipanteForm/>}/>

          <Route
            path="/dashboard-participante"
            element={
              <PrivateRoute requiredRole="participante">
                <DashboardParticipante />
              </PrivateRoute>
            }
          />
          <Route path="/linea-base" element={<LineaBaseForm/>}/>
           <Route path="/registro-reflexion" element={<ReflexionForm/>}/>
           <Route path="/historial-reflexiones" element={<HistorialReflexiones/>}/>
           <Route path="/editar-reflexiones/:id" element={<EditarReflexionForm/>}/>
        </Routes>
      </main>
    </div>
  );
}

export default App;
