import { useState, useEffect } from 'react';
import './ServiceForm.css';

function ServiceForm({ initialValues, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    categoria: '',
    precio: '',
    duracion: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const categorias = ['Spa', 'Restaurante', 'Tours', 'Transporte', 'Entretenimiento', 'Otro'];

  useEffect(() => {
    if (initialValues) {
      setFormData({
        nombre: initialValues.nombre || '',
        descripcion: initialValues.descripcion || '',
        categoria: initialValues.categoria || '',
        precio: initialValues.precio || '',
        duracion: initialValues.duracion || '',
      });
    }
  }, [initialValues]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es requerido';
    if (!formData.categoria.trim()) newErrors.categoria = 'La categoría es requerida';
    if (!formData.precio || parseFloat(formData.precio) <= 0) {
      newErrors.precio = 'El precio debe ser mayor a 0';
    }
    if (formData.precio && isNaN(parseFloat(formData.precio))) {
      newErrors.precio = 'El precio debe ser un número válido';
    }
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setLoading(true);
    try {
      const dataToSubmit = {
        ...formData,
        precio: parseFloat(formData.precio),
      };
      await onSubmit(dataToSubmit);
      setFormData({ nombre: '', descripcion: '', categoria: '', precio: '', duracion: '' });
      setErrors({});
    } catch (error) {
      if (error.message) setErrors({ submit: error.message });
      else setErrors({ submit: 'Error al guardar el servicio' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="service-form-container">
      <h3>{initialValues?.id ? 'Editar Servicio' : 'Agregar Nuevo Servicio'}</h3>
      <form onSubmit={handleSubmit} className="service-form">
        {errors.submit && <div className="error-message">{errors.submit}</div>}

        <div className="form-group">
          <label htmlFor="nombre">Nombre *</label>
          <input
            id="nombre"
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            placeholder="Nombre del servicio"
            maxLength="100"
          />
          {errors.nombre && <span className="field-error">{errors.nombre}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="descripcion">Descripción</label>
          <textarea
            id="descripcion"
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            placeholder="Descripción del servicio"
            maxLength="500"
            rows="3"
          />
          {errors.descripcion && <span className="field-error">{errors.descripcion}</span>}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="categoria">Categoría *</label>
            <select
              id="categoria"
              name="categoria"
              value={formData.categoria}
              onChange={handleChange}
            >
              <option value="">Seleccionar categoría</option>
              {categorias.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {errors.categoria && <span className="field-error">{errors.categoria}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="precio">Precio *</label>
            <input
              id="precio"
              type="number"
              name="precio"
              value={formData.precio}
              onChange={handleChange}
              placeholder="0.00"
              step="0.01"
              min="0"
            />
            {errors.precio && <span className="field-error">{errors.precio}</span>}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="duracion">Duración</label>
          <input
            id="duracion"
            type="text"
            name="duracion"
            value={formData.duracion}
            onChange={handleChange}
            placeholder="Ej: 1 hora, 30 min"
            maxLength="50"
          />
          {errors.duracion && <span className="field-error">{errors.duracion}</span>}
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? 'Guardando...' : initialValues?.id ? 'Actualizar' : 'Crear'}
          </button>
          <button
            type="button"
            className="btn-cancel"
            onClick={onCancel}
            disabled={loading}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

export default ServiceForm;
