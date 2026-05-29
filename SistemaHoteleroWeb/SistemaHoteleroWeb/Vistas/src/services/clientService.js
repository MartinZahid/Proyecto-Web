const API_BASE_URL = '/api';

const clientService = {
  async getClientes() {
    const response = await fetch(`${API_BASE_URL}/clientes`);
    if (!response.ok) throw new Error('Failed to fetch clients');
    return response.json();
  },

  async getCliente(id) {
    const response = await fetch(`${API_BASE_URL}/clientes/${id}`);
    if (!response.ok) throw new Error('Failed to fetch client');
    return response.json();
  },

  async createCliente(data) {
    const response = await fetch(`${API_BASE_URL}/clientes`, {
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

  async updateCliente(id, data) {
    const response = await fetch(`${API_BASE_URL}/clientes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw error;
    }
  },

  async deleteCliente(id) {
    const response = await fetch(`${API_BASE_URL}/clientes/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete client');
  },
};

export default clientService;
