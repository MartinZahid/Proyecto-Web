import { useState, useEffect } from 'react';
import ClientTable from './ClientTable';
import ClientForm from './ClientForm';
import clientService from '../services/clientService';
import './ClientManager.css';

function ClientManager() {
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchClientes();
  }, []);

  const fetchClientes = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await clientService.getClientes();
      setClients(data);
    } catch (err) {
      setError('Error al cargar los clientes. Intenta nuevamente.');
      console.error('Error fetching clients:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddClick = () => {
    setSelectedClient(null);
    setShowForm(true);
  };

  const handleEdit = (client) => {
    setSelectedClient(client);
    setShowForm(true);
  };

  const handleDelete = (clientId) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este cliente?')) {
      handleDeleteConfirm(clientId);
    }
  };

  const handleDeleteConfirm = async (clientId) => {
    try {
      await clientService.deleteCliente(clientId);
      setClients((prev) => prev.filter((c) => c.id !== clientId));
    } catch (err) {
      alert('Error al eliminar el cliente. Intenta nuevamente.');
      console.error('Error deleting client:', err);
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (selectedClient?.id) {
        await clientService.updateCliente(selectedClient.id, formData);
        setClients((prev) =>
          prev.map((c) =>
            c.id === selectedClient.id
              ? { ...c, ...formData }
              : c
          )
        );
      } else {
        const newClient = await clientService.createCliente(formData);
        setClients((prev) => [...prev, newClient]);
      }
      setShowForm(false);
      setSelectedClient(null);
    } catch (err) {
      throw err;
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setSelectedClient(null);
  };

  return (
    <div className="client-manager">
      <div className="client-header">
        <h2>Gestión de Clientes</h2>
        <button className="btn-add" onClick={handleAddClick}>
          + Agregar Cliente
        </button>
      </div>

      {error && <div className="error-alert">{error}</div>}

      {loading ? (
        <div className="loading">Cargando clientes...</div>
      ) : (
        <>
          <ClientTable
            clients={clients}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />

          {showForm && (
            <ClientForm
              initialValues={selectedClient}
              onSubmit={handleFormSubmit}
              onCancel={handleCancel}
            />
          )}
        </>
      )}
    </div>
  );
}

export default ClientManager;
