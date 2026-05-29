// CheckoutManager.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import './CheckoutManager.css';

const API = 'http://localhost:5224/api';

function CheckoutManager() {
  const [clientes, setClientes] = useState([]);
  const [clienteId, setClienteId] = useState('');
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [reservaciones, setReservaciones] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cargandoClientes, setCargandoClientes] = useState(true);
  const [cobrando, setCobrando] = useState(false);
  const [error, setError] = useState(null);
  const [exito, setExito] = useState(null);

  // ── cargar lista de clientes al montar ─────────────────────
  useEffect(() => {
    axios.get(`${API}/clientes`)
      .then((r) => setClientes(r.data))
      .catch(() => setError('Error al cargar los clientes.'))
      .finally(() => setCargandoClientes(false));
  }, []);

  // ── buscar datos del cliente seleccionado ──────────────────
  const buscarCliente = async () => {
    if (!clienteId) return;
    setLoading(true);
    setError(null);
    setExito(null);
    setReservaciones([]);
    setServicios([]);

    try {
      const cliente = clientes.find((c) => c.id === parseInt(clienteId));
      setClienteSeleccionado(cliente);

      const [resRes, srvRes] = await Promise.all([
        axios.get(`${API}/reservaciones/cliente/${clienteId}`),
        axios.get(`${API}/reservacionservicios/cliente/${clienteId}`),
      ]);

      setReservaciones(resRes.data);
      setServicios(srvRes.data);
    } catch {
      setError('Error al cargar la información del cliente.');
    } finally {
      setLoading(false);
    }
  };

  // ── cálculos ───────────────────────────────────────────────
  const totalReservaciones = reservaciones
    .filter((r) => r.estado === 'Activa' || r.estado === 'Pendiente')
    .reduce((acc, r) => acc + (r.totalPagar ?? 0), 0);

  const totalServicios = servicios
    .reduce((acc, s) => acc + (s.subtotal ?? 0), 0);

  const totalGeneral = totalReservaciones + totalServicios;

  const reservacionesPendientes = reservaciones.filter(
    (r) => r.estado === 'Activa' || r.estado === 'Pendiente'
  );

  // ── cobrar ─────────────────────────────────────────────────
  const handleCobrar = async () => {
    if (!window.confirm(
      `¿Confirmar cobro de ${formatMoney(totalGeneral)} para ${clienteSeleccionado?.nombre}?`
    )) return;

    setCobrando(true);
    setError(null);

    try {
      // Marcar reservaciones activas/pendientes como Completadas
      await Promise.all(
        reservacionesPendientes.map((r) =>
          axios.patch(`${API}/reservaciones/${r.id}/estado?estado=Completada`)
        )
      );

      setExito(
        `Cobro de ${formatMoney(totalGeneral)} realizado con éxito. ` +
        `${reservacionesPendientes.length} reservación(es) marcadas como completadas.`
      );

      // Refrescar datos
      buscarCliente();
    } catch {
      setError('Error al procesar el cobro. Intenta nuevamente.');
    } finally {
      setCobrando(false);
    }
  };

  // ── helpers ────────────────────────────────────────────────
  const formatMoney = (n) =>
    Number(n ?? 0).toLocaleString('es-MX', {
      style: 'currency',
      currency: 'MXN',
    });

  const formatFecha = (iso) =>
    iso ? new Date(iso).toLocaleDateString('es-MX') : '—';

  const formatFechaHora = (iso) =>
    iso ? new Date(iso).toLocaleString('es-MX') : '—';

  const badgeClass = (estado) => {
    const map = {
      Activa: 'badge-activa',
      Completada: 'badge-completada',
      Cancelada: 'badge-cancelada',
      Pendiente: 'badge-pendiente',
    };
    return `badge ${map[estado] ?? ''}`;
  };

  // ── render ─────────────────────────────────────────────────
  return (
    <div className="checkout-manager">
      <div className="checkout-header">
        <h2>Check-Out y Facturación</h2>
        <p>Selecciona un cliente para ver sus reservaciones y servicios pendientes de cobro.</p>
      </div>

      {error  && <div className="error-alert">{error}</div>}
      {exito  && <div className="success-alert">{exito}</div>}

      {/* ── Selector de cliente ── */}
      <div className="cliente-selector">
        <h3>Buscar cliente</h3>
        <div className="cliente-search-row">
          <select
            value={clienteId}
            onChange={(e) => {
              setClienteId(e.target.value);
              setClienteSeleccionado(null);
              setReservaciones([]);
              setServicios([]);
              setExito(null);
              setError(null);
            }}
            disabled={cargandoClientes}
          >
            <option value="">
              {cargandoClientes ? 'Cargando clientes...' : 'Seleccionar cliente'}
            </option>
            {clientes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre} — {c.rfc}
              </option>
            ))}
          </select>
          <button
            className="btn-buscar"
            onClick={buscarCliente}
            disabled={!clienteId || loading}
          >
            {loading ? 'Buscando...' : 'Buscar'}
          </button>
        </div>

        {/* Info del cliente */}
        {clienteSeleccionado && (
          <div className="cliente-info-card">
            <div className="info-item">
              <span className="info-label">Nombre</span>
              <span className="info-value">{clienteSeleccionado.nombre}</span>
            </div>
            <div className="info-item">
              <span className="info-label">RFC</span>
              <span className="info-value">{clienteSeleccionado.rfc}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Teléfono</span>
              <span className="info-value">{clienteSeleccionado.telefono}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Email</span>
              <span className="info-value">{clienteSeleccionado.email}</span>
            </div>
          </div>
        )}
      </div>

      {/* ── Resultados ── */}
      {clienteSeleccionado && !loading && (
        <>
          {/* Reservaciones */}
          <div className="checkout-section">
            <h3>Reservaciones</h3>
            <table className="checkout-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Habitación</th>
                  <th>Entrada</th>
                  <th>Salida</th>
                  <th>Total</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {reservaciones.length === 0 ? (
                  <tr className="empty-rows">
                    <td colSpan="6">Sin reservaciones registradas</td>
                  </tr>
                ) : (
                  reservaciones.map((r) => (
                    <tr key={r.id}>
                      <td>#{r.id}</td>
                      <td>{r.habitacion?.numero ?? r.habitacionId}</td>
                      <td>{formatFecha(r.fechaEntrada)}</td>
                      <td>{formatFecha(r.fechaSalida)}</td>
                      <td>{formatMoney(r.totalPagar)}</td>
                      <td>
                        <span className={badgeClass(r.estado)}>{r.estado}</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Servicios consumidos */}
          <div className="checkout-section">
            <h3>Servicios consumidos</h3>
            <table className="checkout-table">
              <thead>
                <tr>
                  <th>Servicio</th>
                  <th>Reservación</th>
                  <th>Fecha / Hora</th>
                  <th>Cantidad</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {servicios.length === 0 ? (
                  <tr className="empty-rows">
                    <td colSpan="5">Sin servicios registrados</td>
                  </tr>
                ) : (
                  servicios.map((s) => (
                    <tr key={s.id}>
                      <td>{s.servicio?.nombre ?? s.servicioId}</td>
                      <td>#{s.reservacionId}</td>
                      <td>{formatFechaHora(s.fechaHora)}</td>
                      <td>{s.cantidad}</td>
                      <td>{formatMoney(s.subtotal)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Resumen de cobro */}
          <div className="resumen-cobro">
            <h3>Resumen de cobro</h3>

            <div className="resumen-fila">
              <span>Reservaciones pendientes ({reservacionesPendientes.length})</span>
              <span>{formatMoney(totalReservaciones)}</span>
            </div>
            <div className="resumen-fila">
              <span>Servicios consumidos ({servicios.length})</span>
              <span>{formatMoney(totalServicios)}</span>
            </div>

            <div className="resumen-total">
              <span>Total a cobrar</span>
              <span>{formatMoney(totalGeneral)}</span>
            </div>

            {totalGeneral === 0 ? (
              <p className="sin-saldo">✓ Sin saldo pendiente</p>
            ) : (
              <button
                className="btn-cobrar"
                onClick={handleCobrar}
                disabled={cobrando || reservacionesPendientes.length === 0}
              >
                {cobrando
                  ? 'Procesando cobro...'
                  : `Cobrar ${formatMoney(totalGeneral)}`}
              </button>
            )}
          </div>
        </>
      )}

      {loading && <div className="loading">Cargando información del cliente...</div>}
    </div>
  );
}

export default CheckoutManager;