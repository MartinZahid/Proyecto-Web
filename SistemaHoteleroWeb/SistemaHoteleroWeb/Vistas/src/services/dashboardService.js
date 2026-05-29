import axios from "axios"

const dashboardService = {
  getHabitaciones:  () => axios.get("/api/habitaciones"),
  getReservaciones: () => axios.get("/api/reservaciones"),
  getClientes:      () => axios.get("/api/clientes"),
  getServicios:     () => axios.get("/api/servicios"),

  async getDashboardData() {
    const [h, r, c, s] = await Promise.all([
      dashboardService.getHabitaciones(),
      dashboardService.getReservaciones(),
      dashboardService.getClientes(),
      dashboardService.getServicios(),
    ])
    return {
      habitaciones:  h.data,
      reservaciones: r.data,
      clientes:      c.data,
      servicios:     s.data,
    }
  }
}

export default dashboardService