import { useState, useEffect } from "react"
import dashboardService from "../services/dashboardService"

export default function Dashboard() {
  const [habitaciones,  setHabitaciones]  = useState([])
  const [reservaciones, setReservaciones] = useState([])
  const [clientes,      setClientes]      = useState([])
  const [servicios,     setServicios]     = useState([])
  const [cargando,      setCargando]      = useState(true)

  useEffect(() => {
    async function cargarTodo() {
      try {
        const data = await dashboardService.getDashboardData()
        setHabitaciones(data.habitaciones)
        setReservaciones(data.reservaciones)
        setClientes(data.clientes)
        setServicios(data.servicios)
      } catch {
        console.error("Error cargando datos del dashboard")
      } finally {
        setCargando(false)
      }
    }
    cargarTodo()
  }, [])

  if (cargando) return (
    <div style={{ textAlign: "center", padding: "60px", color: "#9ca3af" }}>
      Cargando dashboard...
    </div>
  )

  const libres        = habitaciones.filter(h => h.estado === "Libre").length
  const ocupadas      = habitaciones.filter(h => h.estado === "Ocupada").length
  const mantenimiento = habitaciones.filter(h => h.estado === "Mantenimiento").length
  const activas       = reservaciones.filter(r => r.estado === "Pendiente" || r.estado === "Confirmada").length
  const completadas   = reservaciones.filter(r => r.estado === "Completada").length
  const ingresos      = reservaciones
    .filter(r => r.estado !== "Cancelada")
    .reduce((sum, r) => sum + (r.totalPagar || 0), 0)

  const recientes = [...reservaciones]
    .sort((a, b) => new Date(b.fechaCreacion) - new Date(a.fechaCreacion))
    .slice(0, 5)

  const card = (titulo, valor, color, icono) => (
    <div style={{ background: "white", borderRadius: "10px", padding: "20px 24px",
      boxShadow: "0 1px 4px rgba(0,0,0,0.08)", borderLeft: `4px solid ${color}`, flex: 1, minWidth: "160px" }}>
      <div style={{ fontSize: "26px", marginBottom: "4px" }}>{icono}</div>
      <div style={{ fontSize: "30px", fontWeight: "700", color }}>{valor}</div>
      <div style={{ fontSize: "13px", color: "#64748b", marginTop: "4px" }}>{titulo}</div>
    </div>
  )

  const estadoColor = {
    Pendiente:  { background: "#fef3c7", color: "#92400e" },
    Confirmada: { background: "#d1fae5", color: "#065f46" },
    Cancelada:  { background: "#fee2e2", color: "#991b1b" },
    Completada: { background: "#e0e7ff", color: "#3730a3" },
  }

  return (
    <div>
      <h2 style={{ marginBottom: "24px" }}>🏨 Dashboard</h2>

      {/* Fila 1 - Habitaciones y reservaciones */}
      <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", marginBottom: "16px" }}>
        {card("Habitaciones Libres",     libres,             "#10b981", "🛏️")}
        {card("Habitaciones Ocupadas",   ocupadas,           "#ef4444", "🔴")}
        {card("En Mantenimiento",        mantenimiento,      "#f59e0b", "🔧")}
        {card("Reservaciones Activas",   activas,            "#3b82f6", "📅")}
      </div>

      {/* Fila 2 - Totales */}
      <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", marginBottom: "32px" }}>
        {card("Clientes Registrados",    clientes.length,    "#8b5cf6", "👤")}
        {card("Servicios Disponibles",   servicios.length,   "#06b6d4", "🛎️")}
        {card("Reservaciones Completadas", completadas,      "#6366f1", "✅")}
        {card("Ingresos Totales",        `$${ingresos.toLocaleString("es-MX", { minimumFractionDigits: 2 })}`, "#059669", "💰")}
      </div>

      <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>

        {/* Tabla reservaciones recientes */}
        <div style={{ flex: 2, minWidth: "300px", background: "white", borderRadius: "10px", padding: "20px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
          <h3 style={{ marginTop: 0, marginBottom: "16px", fontSize: "15px" }}>📋 Reservaciones Recientes</h3>
          {recientes.length === 0 ? (
            <p style={{ color: "#9ca3af", textAlign: "center" }}>Sin reservaciones aún</p>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
              <thead>
                <tr style={{ background: "#f8fafc" }}>
                  {["#", "Cliente", "Habitación", "Entrada", "Estado", "Total"].map(h => (
                    <th key={h} style={{ padding: "8px", textAlign: h === "Total" ? "right" : "left", borderBottom: "1px solid #e2e8f0", color: "#64748b", fontWeight: "600" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recientes.map(r => (
                  <tr key={r.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                    <td style={{ padding: "8px", color: "#94a3b8" }}>{r.id}</td>
                    <td style={{ padding: "8px" }}>{r.cliente?.nombre ?? `Cliente ${r.clienteId}`}</td>
                    <td style={{ padding: "8px" }}>{r.habitacion?.numero ?? `Hab. ${r.habitacionId}`}</td>
                    <td style={{ padding: "8px", color: "#64748b" }}>{new Date(r.fechaEntrada).toLocaleDateString("es-MX")}</td>
                    <td style={{ padding: "8px" }}>
                      <span style={{ padding: "2px 8px", borderRadius: "10px", fontSize: "11px", fontWeight: "500", ...(estadoColor[r.estado] ?? {}) }}>
                        {r.estado}
                      </span>
                    </td>
                    <td style={{ padding: "8px", textAlign: "right", fontWeight: "500" }}>
                      ${(r.totalPagar ?? 0).toLocaleString("es-MX", { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Panel lateral */}
        <div style={{ flex: 1, minWidth: "200px", background: "white", borderRadius: "10px", padding: "20px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
          <h3 style={{ marginTop: 0, marginBottom: "16px", fontSize: "15px" }}>🛏️ Ocupación</h3>
          {[
            { label: "Libres",        valor: libres,        color: "#10b981" },
            { label: "Ocupadas",      valor: ocupadas,      color: "#ef4444" },
            { label: "Mantenimiento", valor: mantenimiento, color: "#f59e0b" },
          ].map(item => (
            <div key={item.label} style={{ marginBottom: "14px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", marginBottom: "4px" }}>
                <span style={{ color: "#475569" }}>{item.label}</span>
                <span style={{ fontWeight: "600", color: item.color }}>{item.valor} / {habitaciones.length}</span>
              </div>
              <div style={{ background: "#f1f5f9", borderRadius: "4px", height: "8px" }}>
                <div style={{
                  width: habitaciones.length > 0 ? `${(item.valor / habitaciones.length) * 100}%` : "0%",
                  background: item.color, height: "8px", borderRadius: "4px", transition: "width 0.3s"
                }} />
              </div>
            </div>
          ))}

          <h3 style={{ marginTop: "24px", marginBottom: "12px", fontSize: "15px" }}>📊 Reservaciones</h3>
          {[
            { label: "Activas",     valor: activas,                                                           color: "#3b82f6" },
            { label: "Completadas", valor: completadas,                                                        color: "#6366f1" },
            { label: "Canceladas",  valor: reservaciones.filter(r => r.estado === "Cancelada").length,        color: "#ef4444" },
            { label: "Total",       valor: reservaciones.length,                                               color: "#475569" },
          ].map(item => (
            <div key={item.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid #f1f5f9", fontSize: "13px" }}>
              <span style={{ color: "#475569" }}>{item.label}</span>
              <span style={{ fontWeight: "700", color: item.color, fontSize: "16px" }}>{item.valor}</span>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}