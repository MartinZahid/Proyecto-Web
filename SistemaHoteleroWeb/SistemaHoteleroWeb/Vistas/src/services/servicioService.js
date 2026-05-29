const API_BASE_URL = '/api';

const servicioService = {
  async getServicios(filtros = {}) {
    const params = new URLSearchParams();
    if (filtros.disponible !== undefined) {
      params.append('disponible', filtros.disponible);
    }
    if (filtros.categoria) {
      params.append('categoria', filtros.categoria);
    }

    const queryString = params.toString();
    const url = queryString ? `${API_BASE_URL}/servicios?${queryString}` : `${API_BASE_URL}/servicios`;

    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch services');
    return response.json();
  },

  async getServicio(id) {
    const response = await fetch(`${API_BASE_URL}/servicios/${id}`);
    if (!response.ok) throw new Error('Failed to fetch service');
    return response.json();
  },

  async createServicio(data) {
    const response = await fetch(`${API_BASE_URL}/servicios`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw error;
    }
    return response.json();
  },

  async updateServicio(id, data) {
    const response = await fetch(`${API_BASE_URL}/servicios/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw error;
    }
  },

  async deleteServicio(id) {
    const response = await fetch(`${API_BASE_URL}/servicios/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete service');
  },

  async toggleDisponibilidad(id) {
    const response = await fetch(`${API_BASE_URL}/servicios/${id}/disponibilidad`, {
      method: 'PATCH',
    });
    if (!response.ok) throw new Error('Failed to toggle availability');
    return response.json();
  },
};

export default servicioService;
