using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SistemaHoteleroWeb.Data;
using SistemaHoteleroWeb.Dto;
using SistemaHoteleroWeb.Models;

namespace SistemaHoteleroWeb.Controllers
{
   
        [ApiController]
        [Route("api/[controller]")]
        public class ReservacionesController : ControllerBase
        {
            private readonly ApplicationDbContext _context;

            public ReservacionesController(ApplicationDbContext context)
            {
                _context = context;
            }

            // GET: api/reservaciones
            [HttpGet]
            public async Task<ActionResult<IEnumerable<Reservacion>>> GetReservaciones()
            {
                return Ok(await _context.Reservaciones
                    .Include(r => r.Cliente)
                    .Include(r => r.Habitacion)
                    .ToListAsync());
            }

            // GET: api/reservaciones/5
            [HttpGet("{id}")]
            public async Task<ActionResult<Reservacion>> GetReservacion(int id)
            {
                var reservacion = await _context.Reservaciones
                    .Include(r => r.Cliente)
                    .Include(r => r.Habitacion)
                    .FirstOrDefaultAsync(r => r.Id == id);

                if (reservacion == null)
                    return NotFound(new { message = $"No se encontró la reservación con Id {id}." });

                return Ok(reservacion);
            }

            // GET: api/reservaciones/cliente/2
            [HttpGet("cliente/{clienteId}")]
            public async Task<ActionResult<IEnumerable<Reservacion>>> GetByCliente(int clienteId)
            {
                return Ok(await _context.Reservaciones
                    .Include(r => r.Habitacion)
                    .Where(r => r.ClienteId == clienteId)
                    .ToListAsync());
            }

            // POST: api/reservaciones
            [HttpPost]
            public async Task<ActionResult<Reservacion>> PostReservacion([FromBody] ReservacionDto dto)
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                bool clienteExiste = await _context.Clientes.AnyAsync(c => c.Id == dto.ClienteId);
                if (!clienteExiste)
                    return NotFound(new { message = $"No se encontró el cliente con Id {dto.ClienteId}." });

                var habitacion = await _context.Habitaciones.FindAsync(dto.HabitacionId);
                if (habitacion == null)
                    return NotFound(new { message = $"No se encontró la habitación con Id {dto.HabitacionId}." });

                if (habitacion.Estado != "Libre")
                    return Conflict(new { message = $"La habitación {habitacion.Numero} no está disponible." });

                var dias = (dto.FechaSalida - dto.FechaEntrada).Days;
                if (dias <= 0)
                    return BadRequest(new { message = "La fecha de salida debe ser posterior a la fecha de entrada." });

                var reservacion = new Reservacion
                {
                    ClienteId = dto.ClienteId,
                    HabitacionId = dto.HabitacionId,
                    FechaEntrada = dto.FechaEntrada,
                    FechaSalida = dto.FechaSalida,
                    Estado = dto.Estado,
                    TotalPagar = dias * habitacion.PrecioPorNoche,
                    Observaciones = dto.Observaciones,
                    FechaCreacion = DateTime.Now
                };

                habitacion.Estado = "Ocupada";

                _context.Reservaciones.Add(reservacion);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetReservacion), new { id = reservacion.Id }, reservacion);
            }

            // PUT: api/reservaciones/5
            [HttpPut("{id}")]
            public async Task<IActionResult> PutReservacion(int id, [FromBody] ReservacionDto dto)
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var reservacion = await _context.Reservaciones.FindAsync(id);
                if (reservacion == null)
                    return NotFound(new { message = $"No se encontró la reservación con Id {id}." });

                var habitacion = await _context.Habitaciones.FindAsync(dto.HabitacionId);
                if (habitacion == null)
                    return NotFound(new { message = $"No se encontró la habitación con Id {dto.HabitacionId}." });

                var dias = (dto.FechaSalida - dto.FechaEntrada).Days;
                if (dias <= 0)
                    return BadRequest(new { message = "La fecha de salida debe ser posterior a la fecha de entrada." });

                if (reservacion.HabitacionId != dto.HabitacionId)
                {
                    var habitacionAnterior = await _context.Habitaciones.FindAsync(reservacion.HabitacionId);
                    if (habitacionAnterior != null)
                        habitacionAnterior.Estado = "Libre";

                    habitacion.Estado = "Ocupada";
                }

                if (dto.Estado == "Cancelada" || dto.Estado == "Completada")
                    habitacion.Estado = "Libre";

                reservacion.ClienteId = dto.ClienteId;
                reservacion.HabitacionId = dto.HabitacionId;
                reservacion.FechaEntrada = dto.FechaEntrada;
                reservacion.FechaSalida = dto.FechaSalida;
                reservacion.Estado = dto.Estado;
                reservacion.TotalPagar = dias * habitacion.PrecioPorNoche;
                reservacion.Observaciones = dto.Observaciones;

                await _context.SaveChangesAsync();
                return NoContent();
            }

            // PATCH: api/reservaciones/5/estado?estado=Cancelada
            [HttpPatch("{id}/estado")]
            public async Task<IActionResult> PatchEstado(int id, [FromQuery] string estado)
            {
                var reservacion = await _context.Reservaciones
                    .Include(r => r.Habitacion)
                    .FirstOrDefaultAsync(r => r.Id == id);

                if (reservacion == null)
                    return NotFound(new { message = $"No se encontró la reservación con Id {id}." });

                reservacion.Estado = estado;

                if (estado == "Cancelada" || estado == "Completada")
                    if (reservacion.Habitacion != null)
                        reservacion.Habitacion.Estado = "Libre";

                await _context.SaveChangesAsync();
                return NoContent();
            }

            // DELETE: api/reservaciones/5
            [HttpDelete("{id}")]
            public async Task<IActionResult> DeleteReservacion(int id)
            {
                var reservacion = await _context.Reservaciones
                    .Include(r => r.Habitacion)
                    .FirstOrDefaultAsync(r => r.Id == id);

                if (reservacion == null)
                    return NotFound(new { message = $"No se encontró la reservación con Id {id}." });

                if (reservacion.Habitacion != null)
                    reservacion.Habitacion.Estado = "Libre";

                _context.Reservaciones.Remove(reservacion);
                await _context.SaveChangesAsync();
                return NoContent();
            }
        }
    }