using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SistemaHoteleroWeb.Data;
using SistemaHoteleroWeb.Dto;
using SistemaHoteleroWeb.Models;

namespace SistemaHoteleroWeb.Controllers
{
    public class ReservacionServiciosController
    {
        [ApiController]
        [Route("api/[controller]")]
        public class reservacionServiciosController : ControllerBase
        {
            private readonly ApplicationDbContext _context;

            public reservacionServiciosController(ApplicationDbContext context)
            {
                _context = context;
            }

            // GET: api/reservacionservicios
            [HttpGet]
            public async Task<ActionResult<IEnumerable<ReservacionServicio>>> GetReservacionServicios()
            {
                return Ok(await _context.ReservacionServicios
                    .Include(rs => rs.Reservacion)
                    .Include(rs => rs.Cliente)
                    .Include(rs => rs.Servicio)
                    .ToListAsync());
            }

            // GET: api/reservacionservicios/5
            [HttpGet("{id}")]
            public async Task<ActionResult<ReservacionServicio>> GetReservacionServicio(int id)
            {
                var rs = await _context.ReservacionServicios
                    .Include(rs => rs.Reservacion)
                    .Include(rs => rs.Cliente)
                    .Include(rs => rs.Servicio)
                    .FirstOrDefaultAsync(rs => rs.Id == id);

                if (rs == null)
                    return NotFound(new { message = $"No se encontró el registro con Id {id}." });

                return Ok(rs);
            }

            // GET: api/reservacionservicios/reservacion/3
            [HttpGet("reservacion/{reservacionId}")]
            public async Task<ActionResult<IEnumerable<ReservacionServicio>>> GetByReservacion(int reservacionId)
            {
                bool reservacionExiste = await _context.Reservaciones.AnyAsync(r => r.Id == reservacionId);
                if (!reservacionExiste)
                    return NotFound(new { message = $"No se encontró la reservación con Id {reservacionId}." });

                return Ok(await _context.ReservacionServicios
                    .Include(rs => rs.Cliente)
                    .Include(rs => rs.Servicio)
                    .Where(rs => rs.ReservacionId == reservacionId)
                    .ToListAsync());
            }

            // GET: api/reservacionservicios/cliente/2
            [HttpGet("cliente/{clienteId}")]
            public async Task<ActionResult<IEnumerable<ReservacionServicio>>> GetByCliente(int clienteId)
            {
                bool clienteExiste = await _context.Clientes.AnyAsync(c => c.Id == clienteId);
                if (!clienteExiste)
                    return NotFound(new { message = $"No se encontró el cliente con Id {clienteId}." });

                return Ok(await _context.ReservacionServicios
                    .Include(rs => rs.Reservacion)
                    .Include(rs => rs.Servicio)
                    .Where(rs => rs.ClienteId == clienteId)
                    .ToListAsync());
            }

            // POST: api/reservacionservicios
            [HttpPost]
            public async Task<ActionResult<ReservacionServicio>> PostReservacionServicio([FromBody] ReservacionServicioDto dto)
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                bool reservacionExiste = await _context.Reservaciones.AnyAsync(r => r.Id == dto.ReservacionId);
                if (!reservacionExiste)
                    return NotFound(new { message = $"No se encontró la reservación con Id {dto.ReservacionId}." });

                bool clienteExiste = await _context.Clientes.AnyAsync(c => c.Id == dto.ClienteId);
                if (!clienteExiste)
                    return NotFound(new { message = $"No se encontró el cliente con Id {dto.ClienteId}." });

                var servicio = await _context.Servicios.FindAsync(dto.ServicioId);
                if (servicio == null)
                    return NotFound(new { message = $"No se encontró el servicio con Id {dto.ServicioId}." });

                if (servicio.Estado != "Activo")
                    return Conflict(new { message = $"El servicio {servicio.Nombre} no está disponible." });

                var reservacionServicio = new ReservacionServicio
                {
                    ReservacionId = dto.ReservacionId,
                    ClienteId = dto.ClienteId,
                    ServicioId = dto.ServicioId,
                    FechaHora = dto.FechaHora,
                    Cantidad = dto.Cantidad,
                    Subtotal = dto.Cantidad * servicio.Precio,
                    Observaciones = dto.Observaciones
                };

                _context.ReservacionServicios.Add(reservacionServicio);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetReservacionServicio), new { id = reservacionServicio.Id }, reservacionServicio);
            }

            // PUT: api/reservacionservicios/5
            [HttpPut("{id}")]
            public async Task<IActionResult> PutReservacionServicio(int id, [FromBody] ReservacionServicioDto dto)
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var rs = await _context.ReservacionServicios.FindAsync(id);
                if (rs == null)
                    return NotFound(new { message = $"No se encontró el registro con Id {id}." });

                bool reservacionExiste = await _context.Reservaciones.AnyAsync(r => r.Id == dto.ReservacionId);
                if (!reservacionExiste)
                    return NotFound(new { message = $"No se encontró la reservación con Id {dto.ReservacionId}." });

                bool clienteExiste = await _context.Clientes.AnyAsync(c => c.Id == dto.ClienteId);
                if (!clienteExiste)
                    return NotFound(new { message = $"No se encontró el cliente con Id {dto.ClienteId}." });

                var servicio = await _context.Servicios.FindAsync(dto.ServicioId);
                if (servicio == null)
                    return NotFound(new { message = $"No se encontró el servicio con Id {dto.ServicioId}." });

                rs.ReservacionId = dto.ReservacionId;
                rs.ClienteId = dto.ClienteId;
                rs.ServicioId = dto.ServicioId;
                rs.FechaHora = dto.FechaHora;
                rs.Cantidad = dto.Cantidad;
                rs.Subtotal = dto.Cantidad * servicio.Precio;
                rs.Observaciones = dto.Observaciones;

                await _context.SaveChangesAsync();
                return NoContent();
            }

            // DELETE: api/reservacionservicios/5
            [HttpDelete("{id}")]
            public async Task<IActionResult> DeleteReservacionServicio(int id)
            {
                var rs = await _context.ReservacionServicios.FindAsync(id);
                if (rs == null)
                    return NotFound(new { message = $"No se encontró el registro con Id {id}." });

                _context.ReservacionServicios.Remove(rs);
                await _context.SaveChangesAsync();
                return NoContent();
            }
        }
    }
}