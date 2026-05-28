using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SistemaHoteleroWeb.Data;
using SistemaHoteleroWeb.Dto;
using SistemaHoteleroWeb.Models;

namespace SistemaHoteleroWeb.Controllers
{

        [ApiController]
        [Route("api/[controller]")]
        public class HabitacionesController : ControllerBase
        {
            private readonly ApplicationDbContext _context;

            public HabitacionesController(ApplicationDbContext context)
            {
                _context = context;
            }

            // GET: api/habitaciones
            [HttpGet]
            public async Task<ActionResult<IEnumerable<Habitacion>>> GetHabitaciones()
            {
                return Ok(await _context.Habitaciones.ToListAsync());
            }

            // GET: api/habitaciones/libres
            [HttpGet("libres")]
            public async Task<ActionResult<IEnumerable<Habitacion>>> GetLibres()
            {
                return Ok(await _context.Habitaciones
                    .Where(h => h.Estado == "Libre")
                    .ToListAsync());
            }

            // GET: api/habitaciones/5
            [HttpGet("{id}")]
            public async Task<ActionResult<Habitacion>> GetHabitacion(int id)
            {
                var habitacion = await _context.Habitaciones.FindAsync(id);

                if (habitacion == null)
                    return NotFound(new { message = $"No se encontró la habitación con Id {id}." });

                return Ok(habitacion);
            }

            // POST: api/habitaciones
            [HttpPost]
            public async Task<ActionResult<Habitacion>> PostHabitacion([FromBody] HabitacionDto dto)
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                bool numeroExiste = await _context.Habitaciones.AnyAsync(h => h.Numero == dto.Numero);
                if (numeroExiste)
                    return Conflict(new { message = $"Ya existe una habitación con el número {dto.Numero}." });

                var habitacion = new Habitacion
                {
                    Numero = dto.Numero,
                    Tipo = dto.Tipo,
                    PrecioPorNoche = dto.PrecioPorNoche,
                    Estado = dto.Estado
                };

                _context.Habitaciones.Add(habitacion);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetHabitacion), new { id = habitacion.Id }, habitacion);
            }

            // PUT: api/habitaciones/5
            [HttpPut("{id}")]
            public async Task<IActionResult> PutHabitacion(int id, [FromBody] HabitacionDto dto)
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var habitacion = await _context.Habitaciones.FindAsync(id);
                if (habitacion == null)
                    return NotFound(new { message = $"No se encontró la habitación con Id {id}." });

                bool numeroDuplicado = await _context.Habitaciones
                    .AnyAsync(h => h.Numero == dto.Numero && h.Id != id);
                if (numeroDuplicado)
                    return Conflict(new { message = $"El número {dto.Numero} ya está asignado a otra habitación." });

                habitacion.Numero = dto.Numero;
                habitacion.Tipo = dto.Tipo;
                habitacion.PrecioPorNoche = dto.PrecioPorNoche;
                habitacion.Estado = dto.Estado;

                await _context.SaveChangesAsync();
                return NoContent();
            }

            // PATCH: api/habitaciones/5/estado?estado=Ocupada
            [HttpPatch("{id}/estado")]
            public async Task<IActionResult> PatchEstado(int id, [FromQuery] string estado)
            {
                var habitacion = await _context.Habitaciones.FindAsync(id);
                if (habitacion == null)
                    return NotFound(new { message = $"No se encontró la habitación con Id {id}." });

                habitacion.Estado = estado;
                await _context.SaveChangesAsync();
                return NoContent();
            }

            // DELETE: api/habitaciones/5
            [HttpDelete("{id}")]
            public async Task<IActionResult> DeleteHabitacion(int id)
            {
                var habitacion = await _context.Habitaciones.FindAsync(id);
                if (habitacion == null)
                    return NotFound(new { message = $"No se encontró la habitación con Id {id}." });

                _context.Habitaciones.Remove(habitacion);
                await _context.SaveChangesAsync();
                return NoContent();
            }
        }
    }

    
