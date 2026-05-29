import axios from "axios"

const API = "http://localhost:5224/api/habitaciones"

export const getHabitaciones = ()         => axios.get(API)
export const getHabitacion   = (id)       => axios.get(`${API}/${id}`)
export const getLibres       = ()         => axios.get(`${API}/libres`)
export const createHabitacion = (data)    => axios.post(API, data)
export const updateHabitacion = (id, data)=> axios.put(`${API}/${id}`, data)
export const patchEstado      = (id, est) => axios.patch(`${API}/${id}/estado?estado=${est}`)
export const deleteHabitacion = (id)      => axios.delete(`${API}/${id}`)