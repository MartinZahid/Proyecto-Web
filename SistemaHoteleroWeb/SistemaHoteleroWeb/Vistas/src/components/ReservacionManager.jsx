// ReservacionManager.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import './ReservacionManager.css';

const API = 'http://localhost:5224/api';

function ReservacionManager() {
  const [reservaciones, setReservaciones] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [habitaciones, setHabitaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editando, setEditando] = useState(null);
  const [guardando, setGuardando] = useState(false);
  const [erroresForm, setErroresForm] = useState({});

  const [form, setForm] = useState({
    clienteId: '',
    habitacionId: '',
    fechaEntrada: '',
    fechaSalida: '',
    estado: 'Activa',
    observaciones: '',
  });

  // ── carga inicial ──────────────────────────────────────────
  useEffect(() => {
    cargarTodo();
  }, []);

  const cargarTodo = async () => {
    setLoading(true);
    try {
      const [resRes, cliRes, habRes] = await Promise.all([
        axios.get(`${API}/reservaciones`),
        axios.get(`${API}/clientes`),
        axios.get(`${API}/habitaciones`),
      ]);
      setReservaciones(resRes.data);
      setClientes(cliRes.data);
      setHabitaciones(habRes.data);
      setError(null);
    } catch {
      setError('Error al cargar los datos. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  // ── helpers ────────────────────────────────────────────────
  const habitacionSeleccionada = habitaciones.find(
    (h) => h.id === parseInt(form.habitacionId)
  );

  const calcularDias = () => {
    if (!form.fechaEntrada || !form.fechaSalida) return 0;
    const diff =
      new Date(form.fechaSalida) - new Date(form.fechaEntrada);
    return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
  };

  const calcularTotal = () => {
    const dias = calcularDias();
    const precio = habitacionSeleccionada?.precioPorNoche ?? 0;
    return dias * precio;
  };

  const formatFecha = (iso) =>
    iso ? new Date(iso).toLocaleDateString('es-MX') : '—';

  const formatMoney = (n) =>
    Number(n).toLocaleString('es-MX', {
      style: 'currency',
      currency: 'MXN',
    });

  const badgeClass = (estado) => {
    const map = {
      Activa: 'badge-activa',
      Completada: 'badge-completada',
      Cancelada: 'badge-cancelada',
      Pendiente: 'badge-pendiente',
    };
    return `badge ${map[estado] ?? ''}`;
  };

  // ── formulario ─────────────────────────────────────────────
  const abrirNueva = () => {
    setEditando(null);
    setForm({
      clienteId: '',
      habitacionId: '',
      fechaEntrada: '',
      fechaSalida: '',
      estado: 'Activa',
      observaciones: '',
    });
    setErroresForm({});
    setShowModal(true);
  };

  const abrirEditar = (r) => {
    setEditando(r);
    setForm({
      clienteId: r.clienteId,
      habitacionId: r.habitacionId,
      fechaEntrada: r.fechaEntrada?.slice(0, 10) ?? '',
      fechaSalida: r.fechaSalida?.slice(0, 10) ?? '',
      estado: r.estado,
      observaciones: r.observaciones ?? '',
    });
    setErroresForm({});
    setShowModal(true);
  };

  const cerrarModal = () => {
    setShowModal(false);
    setEditando(null);
    setErroresForm({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (erroresForm[name])
      setErroresForm((prev) => ({ ...prev, [name]: '' }));
  };

  const validar = () => {
    const e = {};
    if (!form.clienteId) e.clienteId = 'Selecciona un cliente';
    if (!form.habitacionId) e.habitacionId = 'Selecciona una habitación';
    if (!form.fechaEntrada) e.fechaEntrada = 'Ingresa la fecha de entrada';
    if (!form.fechaSalida) e.fechaSalida = 'Ingresa la fecha de salida';
    if (form.fechaEntrada && form.fechaSalida &&
        new Date(form.fechaSalida) <= new Date(form.fechaEntrada))
      e.fechaSalida = 'La salida debe ser posterior a la entrada';
    return e;
  };

  const handleSubmit = async () => {
    const e = validar();
    if (Object.keys(e).length > 0) { setErroresForm(e); return; }

    setGuardando(true);
    try {
      const payload = {
        clienteId: parseInt(form.clienteId),
        habitacionId: parseInt(form.habitacionId),
        fechaEntrada: form.fechaEntrada,
        fechaSalida: form.fechaSalida,
        estado: form.estado,
        observaciones: form.observaciones || null,
      };

      if (editando) {
        await axios.put(`${API}/reservaciones/${editando.id}`, payload);
      } else {
        await axios.post(`${API}/reservaciones`, payload);
      }

      cerrarModal();
      cargarTodo();
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.title ||
        'Error al guardar la reservación.';
      setErroresForm({ submit: msg });
    } finally {
      setGuardando(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar esta reservación?')) return;
    try {
      await axios.delete(`${API}/reservaciones/${id}`);
      cargarTodo();
    } catch {
      alert('Error al eliminar la reservación.');
    }
  };

  // ── habitaciones disponibles (libres + la que ya tiene la reserva) ──
  const habitacionesDisponibles = habitaciones.filter(
    (h) =>
      h.estado === 'Libre' ||
      h.id === parseInt(form.habitacionId)
  );

  // ── render ─────────────────────────────────────────────────
  return (
    <div className="reservacion-manager">
      <div className="reservacion-header">
        <h2>Gestión de Reservaciones</h2>
        <button className="btn-add" onClick={abrirNueva}>
          + Nueva Reservación
        </button>
      </div>

      {error && <div className="error-alert">{error}</div>}

      {loading ? (
        <div className="loading">Cargando reservaciones...</div>
      ) : (
        <div className="reservacion-table-container">
          <table className="reservacion-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Cliente</th>
                <th>Habitación</th>
                <th>Entrada</th>
                <th>Salida</th>
                <th>Total</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {reservaciones.length === 0 ? (
                <tr>
                  <td colSpan="8" className="empty-message">
                    No hay reservaciones registradas
                  </td>
                </tr>
              ) : (
                reservaciones.map((r) => (
                  <tr key={r.id}>
                    <td>{r.id}</td>
                    <td>{r.cliente?.nombre ?? r.clienteId}</td>
                    <td>{r.habitacion?.numero ?? r.habitacionId}</td>
                    <td>{formatFecha(r.fechaEntrada)}</td>
                    <td>{formatFecha(r.fechaSalida)}</td>
                    <td>{formatMoney(r.totalPagar)}</td>
                    <td>
                      <span className={badgeClass(r.estado)}>
                        {r.estado}
                      </span>
                    </td>
                    <td className="actions">
                      <button
                        className="btn-edit"
                        onClick={() => abrirEditar(r)}
                      >
                        Editar
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => handleDelete(r.id)}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Modal ── */}
      {showModal && (
        <div className="modal-overlay" onClick={cerrarModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>{editando ? 'Editar Reservación' : 'Nueva Reservación'}</h3>

            {erroresForm.submit && (
              <div className="error-alert">{erroresForm.submit}</div>
            )}

            {/* Cliente */}
            <div className="form-group">
              <label>Cliente *</label>
              <select name="clienteId" value={form.clienteId} onChange={handleChange}>
                <option value="">Seleccionar cliente</option>
                {clientes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nombre} — {c.rfc}
                  </option>
                ))}
              </select>
              {erroresForm.clienteId && (
                <span className="field-error">{erroresForm.clienteId}</span>
              )}
            </div>

            {/* Habitación */}
            <div className="form-group">
              <label>Habitación *</label>
              <select name="habitacionId" value={form.habitacionId} onChange={handleChange}>
                <option value="">Seleccionar habitación</option>
                {habitacionesDisponibles.map((h) => (
                  <option key={h.id} value={h.id}>
                    #{h.numero} — {h.tipo} — {formatMoney(h.precioPorNoche)}/noche
                  </option>
                ))}
              </select>
              {erroresForm.habitacionId && (
                <span className="field-error">{erroresForm.habitacionId}</span>
              )}
            </div>

            {/* Fechas */}
            <div className="form-row">
              <div className="form-group">
                <label>Fecha de entrada *</label>
                <input
                  type="date"
                  name="fechaEntrada"
                  value={form.fechaEntrada}
                  onChange={handleChange}
                />
                {erroresForm.fechaEntrada && (
                  <span className="field-error">{erroresForm.fechaEntrada}</span>
                )}
              </div>
              <div className="form-group">
                <label>Fecha de salida *</label>
                <input
                  type="date"
                  name="fechaSalida"
                  value={form.fechaSalida}
                  onChange={handleChange}
                  min={form.fechaEntrada || undefined}
                />
                {erroresForm.fechaSalida && (
                  <span className="field-error">{erroresForm.fechaSalida}</span>
                )}
              </div>
            </div>

            {/* Total calculado */}
            {calcularDias() > 0 && habitacionSeleccionada && (
              <div className="total-box">
                <span>
                  {calcularDias()} noche{calcularDias() > 1 ? 's' : ''} ×{' '}
                  {formatMoney(habitacionSeleccionada.precioPorNoche)}
                </span>
                <span>{formatMoney(calcularTotal())}</span>
              </div>
            )}

            {/* Estado */}
            <div className="form-group">
              <label>Estado</label>
              <select name="estado" value={form.estado} onChange={handleChange}>
                <option value="Activa">Activa</option>
                <option value="Pendiente">Pendiente</option>
                <option value="Completada">Completada</option>
                <option value="Cancelada">Cancelada</option>
              </select>
            </div>

            {/* Observaciones */}
            <div className="form-group">
              <label>Observaciones</label>
              <textarea
                name="observaciones"
                value={form.observaciones}
                onChange={handleChange}
                rows="3"
                placeholder="Notas adicionales..."
                maxLength="300"
              />
            </div>

            {/* Acciones */}
            <div className="form-actions">
              <button className="btn-submit" onClick={handleSubmit} disabled={guardando}>
                {guardando ? 'Guardando...' : editando ? 'Actualizar' : 'Crear reservación'}
              </button>
              <button className="btn-cancel" onClick={cerrarModal} disabled={guardando}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReservacionManager;