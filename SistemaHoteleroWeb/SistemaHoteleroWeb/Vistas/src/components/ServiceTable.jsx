import './ServiceTable.css';

function ServiceTable({ servicios, onEdit, onDelete, onToggleDisponibilidad }) {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(price);
  };

  return (
    <div className="service-table-container">
      <table className="service-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Categoría</th>
            <th>Precio</th>
            <th>Duración</th>
            <th>Disponible</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {servicios.length === 0 ? (
            <tr>
              <td colSpan="7" className="empty-message">
                No hay servicios registrados
              </td>
            </tr>
          ) : (
            servicios.map((servicio) => (
              <tr key={servicio.id}>
                <td>{servicio.id}</td>
                <td>{servicio.nombre}</td>
                <td>{servicio.categoria}</td>
                <td>{formatPrice(servicio.precio)}</td>
                <td>{servicio.duracion || '-'}</td>
                <td>
                  <button
                    className={`disponibilidad-btn ${
                      servicio.disponible ? 'disponible' : 'no-disponible'
                    }`}
                    onClick={() => onToggleDisponibilidad(servicio.id)}
                    title={
                      servicio.disponible
                        ? 'Marcar como no disponible'
                        : 'Marcar como disponible'
                    }
                  >
                    {servicio.disponible ? 'Disponible' : 'No disponible'}
                  </button>
                </td>
                <td className="actions">
                  <button
                    className="btn-edit"
                    onClick={() => onEdit(servicio)}
                    title="Editar servicio"
                  >
                    Editar
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => onDelete(servicio.id)}
                    title="Eliminar servicio"
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
  );
}

export default ServiceTable;
