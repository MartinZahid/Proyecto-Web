import { useState, useEffect } from "react"
import {
  getHabitaciones,
  createHabitacion,
  updateHabitacion,
  deleteHabitacion,
  patchEstado
} from "../services/habitacionService"

const TIPOS   = ["Sencilla", "Doble", "Suite Junior", "Suite"]
const ESTADOS = ["Libre", "Ocupada", "Mantenimiento"]

const colorEstado = {
  Libre:         { background: "#d1fae5", color: "#065f46" },
  Ocupada:       { background: "#fee2e2", color: "#991b1b" },
  Mantenimiento: { background: "#fef3c7", color: "#92400e" },
}

const formVacio = { numero: "", tipo: "Sencilla", precioPorNoche: "", estado: "Libre" }

export default function Habitaciones() {
  const [habitaciones, setHabitaciones] = useState([])
  const [form, setForm]                 = useState(formVacio)
  const [editId, setEditId]             = useState(null)
  const [modalAbierto, setModalAbierto] = useState(false)
  const [filtro, setFiltro]             = useState("Todos")
  const [error, setError]               = useState("")
  const [cargando, setCargando]         = useState(false)

  useEffect(() => { cargarHabitaciones() }, [])

  async function cargarHabitaciones() {
    setCargando(true)
    try {
      const { data } = await getHabitaciones()
      setHabitaciones(data)
      setError("")
    } catch {
      setError("No se pudo conectar con la API")
    } finally {
      setCargando(false)
    }
  }

  function abrirNueva() {
    setForm(formVacio)
    setEditId(null)
    setError("")
    setModalAbierto(true)
  }

  function abrirEditar(hab) {
    setForm({
      numero:         hab.numero,
      tipo:           hab.tipo,
      precioPorNoche: hab.precioPorNoche,
      estado:         hab.estado
    })
    setEditId(hab.id)
    setError("")
    setModalAbierto(true)
  }

  async function guardar() {
    if (!form.numero || !form.precioPorNoche) {
      setError("Número y precio son obligatorios.")
      return
    }
    const body = {
      numero:         form.numero,
      tipo:           form.tipo,
      precioPorNoche: parseFloat(form.precioPorNoche),
      estado:         form.estado
    }
    try {
      if (editId) {
        await updateHabitacion(editId, body)
      } else {
        await createHabitacion(body)
      }
      setModalAbierto(false)
      cargarHabitaciones()
    } catch (e) {
      setError(e.response?.data?.message || "Error al guardar")
    }
  }

  async function eliminar(id) {
    if (!confirm("¿Eliminar esta habitación?")) return
    try {
      await deleteHabitacion(id)
      cargarHabitaciones()
    } catch (e) {
      setError(e.response?.data?.message || "Error al eliminar")
    }
  }

  async function cambiarEstado(id, estadoActual) {
    const siguiente = estadoActual === "Libre" ? "Ocupada" : "Libre"
    try {
      await patchEstado(id, siguiente)
      cargarHabitaciones()
    } catch {
      setError("Error al cambiar estado")
    }
  }

  const filtradas = filtro === "Todos"
    ? habitaciones
    : habitaciones.filter(h => h.estado === filtro)

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h2 style={{ margin: 0 }}>🛏️ Gestión de Habitaciones</h2>
        <button onClick={abrirNueva} style={{ background: "#2563eb", color: "white", border: "none", padding: "8px 16px", borderRadius: "6px", cursor: "pointer", fontWeight: "500" }}>
          + Nueva Habitación
        </button>
      </div>

      {error && (
        <div style={{ background: "#fee2e2", border: "1px solid #fca5a5", padding: "10px 14px", borderRadius: "6px", marginBottom: "16px", color: "#991b1b" }}>
          {error}
          <button onClick={() => setError("")} style={{ float: "right", background: "none", border: "none", cursor: "pointer", fontWeight: "bold" }}>×</button>
        </div>
      )}

      {/* Filtros */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
        {["Todos", ...ESTADOS].map(e => (
          <button key={e} onClick={() => setFiltro(e)}
            style={{ padding: "5px 14px", borderRadius: "20px", border: "none", cursor: "pointer", fontWeight: "500", fontSize: "13px",
              background: filtro === e ? "#2563eb" : "#f1f5f9",
              color:      filtro === e ? "white"   : "#475569" }}>
            {e}
          </button>
        ))}
      </div>

      {/* Tabla */}
      {cargando ? (
        <p style={{ textAlign: "center", color: "#9ca3af" }}>Cargando...</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
          <thead>
            <tr style={{ background: "#f8fafc", textAlign: "left" }}>
              <th style={{ padding: "10px 12px", borderBottom: "2px solid #e2e8f0" }}>Número</th>
              <th style={{ padding: "10px 12px", borderBottom: "2px solid #e2e8f0" }}>Tipo</th>
              <th style={{ padding: "10px 12px", borderBottom: "2px solid #e2e8f0" }}>Precio/noche</th>
              <th style={{ padding: "10px 12px", borderBottom: "2px solid #e2e8f0" }}>Estado</th>
              <th style={{ padding: "10px 12px", borderBottom: "2px solid #e2e8f0" }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtradas.length === 0 ? (
              <tr><td colSpan={5} style={{ textAlign: "center", padding: "32px", color: "#9ca3af" }}>Sin habitaciones</td></tr>
            ) : (
              filtradas.map(hab => (
                <tr key={hab.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                  <td style={{ padding: "10px 12px", fontWeight: "600" }}>{hab.numero}</td>
                  <td style={{ padding: "10px 12px", color: "#64748b" }}>{hab.tipo}</td>
                  <td style={{ padding: "10px 12px" }}>${parseFloat(hab.precioPorNoche).toLocaleString("es-MX", { minimumFractionDigits: 2 })}</td>
                  <td style={{ padding: "10px 12px" }}>
                    <span style={{ padding: "3px 10px", borderRadius: "12px", fontSize: "12px", fontWeight: "500", ...colorEstado[hab.estado] }}>
                      {hab.estado}
                    </span>
                  </td>
                  <td style={{ padding: "10px 12px" }}>
                    <button onClick={() => abrirEditar(hab)} style={{ background: "none", border: "none", color: "#2563eb", cursor: "pointer", marginRight: "8px", fontSize: "13px" }}>Editar</button>
                    <button onClick={() => cambiarEstado(hab.id, hab.estado)} style={{ background: "none", border: "none", color: "#7c3aed", cursor: "pointer", marginRight: "8px", fontSize: "13px" }}>
                      {hab.estado === "Libre" ? "Marcar Ocupada" : "Marcar Libre"}
                    </button>
                    <button onClick={() => eliminar(hab.id)} style={{ background: "none", border: "none", color: "#dc2626", cursor: "pointer", fontSize: "13px" }}>Eliminar</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}

      <p style={{ color: "#94a3b8", fontSize: "13px", marginTop: "12px" }}>
        Total: {habitaciones.length} &nbsp;|&nbsp;
        Libres: {habitaciones.filter(h => h.estado === "Libre").length} &nbsp;|&nbsp;
        Ocupadas: {habitaciones.filter(h => h.estado === "Ocupada").length} &nbsp;|&nbsp;
        Mantenimiento: {habitaciones.filter(h => h.estado === "Mantenimiento").length}
      </p>

      {/* Modal */}
      {modalAbierto && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999 }}>
          <div style={{ background: "white", borderRadius: "10px", padding: "24px", width: "100%", maxWidth: "420px", margin: "0 16px" }}>
            <h3 style={{ marginTop: 0 }}>{editId ? "Editar Habitación" : "Nueva Habitación"}</h3>

            {error && <p style={{ color: "#dc2626", fontSize: "13px", margin: "0 0 12px" }}>{error}</p>}

            <label style={{ display: "block", fontSize: "13px", fontWeight: "500", marginBottom: "4px" }}>Número *</label>
            <input value={form.numero} onChange={e => setForm({ ...form, numero: e.target.value })}
              placeholder="ej. 101"
              style={{ width: "100%", border: "1px solid #d1d5db", borderRadius: "6px", padding: "8px", marginBottom: "12px", boxSizing: "border-box" }} />

            <label style={{ display: "block", fontSize: "13px", fontWeight: "500", marginBottom: "4px" }}>Tipo</label>
            <select value={form.tipo} onChange={e => setForm({ ...form, tipo: e.target.value })}
              style={{ width: "100%", border: "1px solid #d1d5db", borderRadius: "6px", padding: "8px", marginBottom: "12px", boxSizing: "border-box" }}>
              {TIPOS.map(t => <option key={t}>{t}</option>)}
            </select>

            <label style={{ display: "block", fontSize: "13px", fontWeight: "500", marginBottom: "4px" }}>Precio por noche *</label>
            <input type="number" value={form.precioPorNoche} onChange={e => setForm({ ...form, precioPorNoche: e.target.value })}
              placeholder="ej. 1200"
              style={{ width: "100%", border: "1px solid #d1d5db", borderRadius: "6px", padding: "8px", marginBottom: "12px", boxSizing: "border-box" }} />

            <label style={{ display: "block", fontSize: "13px", fontWeight: "500", marginBottom: "4px" }}>Estado</label>
            <select value={form.estado} onChange={e => setForm({ ...form, estado: e.target.value })}
              style={{ width: "100%", border: "1px solid #d1d5db", borderRadius: "6px", padding: "8px", marginBottom: "16px", boxSizing: "border-box" }}>
              {ESTADOS.map(s => <option key={s}>{s}</option>)}
            </select>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
              <button onClick={() => { setModalAbierto(false); setError("") }}
                style={{ padding: "8px 16px", border: "1px solid #d1d5db", borderRadius: "6px", cursor: "pointer", background: "white" }}>
                Cancelar
              </button>
              <button onClick={guardar}
                style={{ padding: "8px 16px", background: "#2563eb", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" }}>
                {editId ? "Guardar" : "Crear"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}