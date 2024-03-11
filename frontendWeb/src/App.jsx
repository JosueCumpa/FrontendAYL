// App.jsx
import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";
import PrivateRoute from "./privateRoute";
import MainContent from "./components/MainContent";
import Login from "./components/Login";
import Usuarios from "./components/usuario/Usuarios";
import Grifos from "./components/grifo/Grifos";
import Productos from "./components/producto/Productos";
import Conductores from "./components/conductor/Conductores";
import Camiones from "./components/Camion/Camiones";
import DataGeneral from "./components/DataGeneral/DataGeneral";
import Banco from "./components/Banco/Banco";
import Rendimiento from "./components/Rendimiento/Rendimiento";
import Dashboard from "./components/Dashboard";
import Ciudades from "./components/Ciudad/ciudades";
import NotFound from "./components/NotFound";

import { Toaster } from "react-hot-toast";

function App() {
  return (
    <BrowserRouter>
      <Toaster />
      <Routes>
        {/* Rutas públicas */}

        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />

        {/* Rutas privadas */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <MainContent />
            </PrivateRoute>
          }
        >
          {/* Ruta anidada protegida */}
          <Route path="dashboard" element={<Dashboard />} />

          <Route
            path="usuarios"
            element={
              <PrivateRoute requiredUserGroup="true">
                <Usuarios />
              </PrivateRoute>
            }
          />
          <Route
            path="grifo"
            element={
              <PrivateRoute opgroup="true">
                <Grifos />
              </PrivateRoute>
            }
          />
          <Route
            path="producto"
            element={
              <PrivateRoute opgroup="true">
                <Productos />
              </PrivateRoute>
            }
          />
          <Route
            path="conductor"
            element={
              <PrivateRoute opgroup="true">
                <Conductores />
              </PrivateRoute>
            }
          />
          <Route
            path="camion"
            element={
              <PrivateRoute opgroup="true">
                <Camiones />
              </PrivateRoute>
            }
          />
          <Route
            path="datageneral"
            element={
              <PrivateRoute opgroup="true">
                <DataGeneral />
              </PrivateRoute>
            }
          />
          <Route
            path="banco"
            element={
              <PrivateRoute opgroup="true">
                <Banco />
              </PrivateRoute>
            }
          />
          <Route
            path="rendimiento"
            element={
              <PrivateRoute opgroup="true">
                <Rendimiento />
              </PrivateRoute>
            }
          />
          <Route
            path="ciudad"
            element={
              <PrivateRoute opgroup="true">
                <Ciudades />
              </PrivateRoute>
            }
          />

          {/* Agrega la ruta comodín para páginas no encontradas */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
