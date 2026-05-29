import './ClientTable.css';

function ClientTable({ clients, onEdit, onDelete }) {
  return (
    <div className="client-table-container">
      <table className="client-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>RFC</th>
            <th>Teléfono</th>
            <th>Email</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {clients.length === 0 ? (
            <tr>
              <td colSpan="6" className="empty-message">
                No hay clientes registrados
              </td>
            </tr>
          ) : (
            clients.map((cliente) => (
              <tr key={cliente.id}>
                <td>{cliente.id}</td>
                <td>{cliente.nombre}</td>
                <td>{cliente.rfc}</td>
                <td>{cliente.telefono}</td>
                <td>{cliente.email}</td>
                <td className="actions">
                  <button
                    className="btn-edit"
                    onClick={() => onEdit(cliente)}
                    title="Editar cliente"
                  >
                    Editar
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => onDelete(cliente.id)}
                    title="Eliminar cliente"
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

export default ClientTable;
