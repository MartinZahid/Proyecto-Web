import { useState, useEffect } from 'react';
import ServiceTable from './ServiceTable';
import ServiceForm from './ServiceForm';
import servicioService from '../services/servicioService';
import './ServiceManager.css';

function ServiceManager() {
  const [servicios, setServicios] = useState([]);
  const [selectedServicio, setSelectedServicio] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterCategoria, setFilterCategoria] = useState('');
  const [filterDisponible, setFilterDisponible] = useState('');

  const fetchServicios = async () => {
    try {
      setLoading(true);
      setError(null);
      const filtros = {};
      if (filterDisponible !== '') {
        filtros.disponible = filterDisponible === 'true';
      }
      if (filterCategoria) {
        filtros.categoria = filterCategoria;
      }
      const data = await servicioService.getServicios(filtros);
      setServicios(data);
    } catch (err) {
      setError('Error al cargar los servicios. Intenta nuevamente.');
      console.error('Error fetching services:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServicios();
  }, [filterCategoria, filterDisponible]);

  const handleAddClick = () => {
    setSelectedServicio(null);
    setShowForm(true);
  };

  const handleEdit = (servicio) => {
    setSelectedServicio(servicio);
    setShowForm(true);
  };

  const handleDelete = (servicioId) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este servicio?')) {
      handleDeleteConfirm(servicioId);
    }
  };

  const handleDeleteConfirm = async (servicioId) => {
    try {
      await servicioService.deleteServicio(servicioId);
      setServicios((prev) => prev.filter((s) => s.id !== servicioId));
    } catch (err) {
      alert('Error al eliminar el servicio. Intenta nuevamente.');
      console.error('Error deleting service:', err);
    }
  };

  const handleToggleDisponibilidad = async (servicioId) => {
    try {
      const result = await servicioService.toggleDisponibilidad(servicioId);
      setServicios((prev) =>
        prev.map((s) =>
          s.id === servicioId ? { ...s, disponible: result.disponible } : s
        )
      );
    } catch (err) {
      alert('Error al cambiar la disponibilidad del servicio.');
      console.error('Error toggling availability:', err);
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (selectedServicio?.id) {
        await servicioService.updateServicio(selectedServicio.id, formData);
        setServicios((prev) =>
          prev.map((s) =>
            s.id === selectedServicio.id ? { ...s, ...formData } : s
          )
        );
      } else {
        const newServicio = await servicioService.createServicio(formData);
        setServicios((prev) => [...prev, newServicio]);
      }
      setShowForm(false);
      setSelectedServicio(null);
    } catch (err) {
      throw err;
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setSelectedServicio(null);
  };

  const categorias = [...new Set(servicios.map((s) => s.categoria))].sort();

  return (
    <div className="service-manager">
      <div className="service-header">
        <h2>Gestión de Servicios Adicionales</h2>
        <button className="btn-add" onClick={handleAddClick}>
          + Agregar Servicio
        </button>
      </div>

      <div className="filters">
        <div className="filter-group">
          <label htmlFor="filter-categoria">Categoría:</label>
          <select
            id="filter-categoria"
            value={filterCategoria}
            onChange={(e) => setFilterCategoria(e.target.value)}
          >
            <option value="">Todas</option>
            {categorias.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="filter-disponible">Disponibilidad:</label>
          <select
            id="filter-disponible"
            value={filterDisponible}
            onChange={(e) => setFilterDisponible(e.target.value)}
          >
            <option value="">Todos</option>
            <option value="true">Disponibles</option>
            <option value="false">No disponibles</option>
          </select>
        </div>
      </div>

      {error && <div className="error-alert">{error}</div>}

      {loading ? (
        <div className="loading">Cargando servicios...</div>
      ) : (
        <>
          <ServiceTable
            servicios={servicios}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onToggleDisponibilidad={handleToggleDisponibilidad}
          />

          {showForm && (
            <ServiceForm
              initialValues={selectedServicio}
              onSubmit={handleFormSubmit}
              onCancel={handleCancel}
            />
          )}
        </>
      )}
    </div>
  );
}

export default ServiceManager;
