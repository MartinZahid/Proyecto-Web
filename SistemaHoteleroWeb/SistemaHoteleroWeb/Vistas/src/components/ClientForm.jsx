import { useState, useEffect } from 'react';
import './ClientForm.css';

function ClientForm({ initialValues, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    nombre: '',
    rfc: '',
    telefono: '',
    email: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialValues) {
      setFormData({
        nombre: initialValues.nombre || '',
        rfc: initialValues.rfc || '',
        telefono: initialValues.telefono || '',
        email: initialValues.email || '',
      });
    }
  }, [initialValues]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es requerido';
    if (!formData.rfc.trim()) newErrors.rfc = 'El RFC es requerido';
    if (formData.rfc.trim().length < 12 || formData.rfc.trim().length > 13) {
      newErrors.rfc = 'El RFC debe tener entre 12 y 13 caracteres';
    }
    if (!formData.telefono.trim()) newErrors.telefono = 'El teléfono es requerido';
    if (!formData.email.trim()) newErrors.email = 'El email es requerido';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'El email no es válido';
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
      await onSubmit(formData);
      setFormData({ nombre: '', rfc: '', telefono: '', email: '' });
      setErrors({});
    } catch (error) {
      if (error.message) setErrors({ submit: error.message });
      else setErrors({ submit: 'Error al guardar el cliente' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="client-form-container">
      <h3>{initialValues?.id ? 'Editar Cliente' : 'Agregar Nuevo Cliente'}</h3>
      <form onSubmit={handleSubmit} className="client-form">
        {errors.submit && <div className="error-message">{errors.submit}</div>}

        <div className="form-group">
          <label htmlFor="nombre">Nombre *</label>
          <input
            id="nombre"
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            placeholder="Nombre completo"
            maxLength="100"
          />
          {errors.nombre && <span className="field-error">{errors.nombre}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="rfc">RFC *</label>
          <input
            id="rfc"
            type="text"
            name="rfc"
            value={formData.rfc}
            onChange={handleChange}
            placeholder="RFC (12-13 caracteres)"
            maxLength="13"
            style={{ textTransform: 'uppercase' }}
          />
          {errors.rfc && <span className="field-error">{errors.rfc}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="telefono">Teléfono *</label>
          <input
            id="telefono"
            type="tel"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            placeholder="Teléfono"
            maxLength="15"
          />
          {errors.telefono && <span className="field-error">{errors.telefono}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="email">Email *</label>
          <input
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="correo@ejemplo.com"
            maxLength="100"
          />
          {errors.email && <span className="field-error">{errors.email}</span>}
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

export default ClientForm;
