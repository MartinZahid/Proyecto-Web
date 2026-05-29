import { BrowserRouter, Routes, Route } from "react-router-dom"
import Navbar from "./components/Navbar"
import ClientManager from "./components/ClientManager"
import ServiceManager from "./components/ServiceManager"
import Habitaciones from "./pages/Habitaciones"
import Dashboard from "./pages/Dashboard"


// Placeholders 
function Pendiente({ titulo }) {
  return (
    <div style={{ textAlign: "center", padding: "60px", color: "#9ca3af" }}>
      <div style={{ fontSize: "48px" }}>🚧</div>
      <h2 style={{ color: "#6b7280" }}>{titulo}</h2>
      <p style={{ fontSize: "13px" }}>Vista en desarrollo</p>
    </div>
  )
}

function NotFound() {
  return (
    <div style={{ textAlign: "center", padding: "60px" }}>
      <h1 style={{ fontSize: "72px", color: "#e5e7eb", margin: 0 }}>404</h1>
      <p style={{ color: "#6b7280" }}>Página no encontrada</p>
      <a href="/" style={{ color: "#2563eb" }}>Volver al inicio</a>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "24px 16px" }}>
        <Routes>
          <Route path="/habitaciones" element={<Habitaciones />} />
<Route path="/" element={<Dashboard />} />
          <Route path="/"              element={<Pendiente titulo="Dashboard – Indicadores del Hotel" />} />
          <Route path="/habitaciones"  element={<Pendiente titulo="Gestión de Habitaciones" />} />
          <Route path="/clientes"      element={<ClientManager />} />
          <Route path="/servicios"     element={<ServiceManager />} />


          <Route path="/reservaciones" element={<Pendiente titulo="Módulo de Reservaciones" />} />
          <Route path="/checkout"      element={<Pendiente titulo="Check-Out y Facturación" />} />
          <Route path="*"              element={<NotFound />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}