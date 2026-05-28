using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SistemaHoteleroWeb.Data;
using SistemaHoteleroWeb.DTOs;
using SistemaHoteleroWeb.Models;

namespace SistemaHoteleroWeb.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ServiciosController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ServiciosController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/servicios
        // GET: api/servicios?disponible=true
        // GET: api/servicios?categoria=Spa
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ServicioReadDto>>> GetServicios(
            [FromQuery] bool? disponible,
            [FromQuery] string? categoria)
        {
            var query = _context.Servicios.AsQueryable();

            if (disponible.HasValue)
                query = query.Where(s => s.Disponible == disponible.Value);

            if (!string.IsNullOrWhiteSpace(categoria))
                query = query.Where(s => s.Categoria.ToLower() == categoria.ToLower());

            var servicios = await query
                .OrderBy(s => s.Categoria)
                .ThenBy(s => s.Nombre)
                .Select(s => new ServicioReadDto
                {
                    Id = s.Id,
                    Nombre = s.Nombre,
                    Descripcion = s.Descripcion,
                    Categoria = s.Categoria,
                    Precio = s.Precio,
                    Duracion = s.Duracion,
                    Disponible = s.Disponible,
                    FechaCreacion = s.FechaCreacion
                })
                .ToListAsync();

            return Ok(servicios);
        }

        // GET: api/servicios/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ServicioReadDto>> GetServicio(int id)
        {
            var servicio = await _context.Servicios.FindAsync(id);

            if (servicio == null)
                return NotFound(new { message = $"No se encontró el servicio con Id {id}." });

            var dto = new ServicioReadDto
            {
                Id = servicio.Id,
                Nombre = servicio.Nombre,
                Descripcion = servicio.Descripcion,
                Categoria = servicio.Categoria,
                Precio = servicio.Precio,
                Duracion = servicio.Duracion,
                Disponible = servicio.Disponible,
                FechaCreacion = servicio.FechaCreacion
            };

            return Ok(dto);
        }

        // POST: api/servicios
        [HttpPost]
        public async Task<ActionResult<ServicioReadDto>> PostServicio([FromBody] ServicioCreateDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var servicio = new Servicio
            {
                Nombre = dto.Nombre,
                Descripcion = dto.Descripcion,
                Categoria = dto.Categoria,
                Precio = dto.Precio,
                Duracion = dto.Duracion,
                Disponible = true,
                FechaCreacion = DateTime.UtcNow
            };

            _context.Servicios.Add(servicio);
            await _context.SaveChangesAsync();

            var result = new ServicioReadDto
            {
                Id = servicio.Id,
                Nombre = servicio.Nombre,
                Descripcion = servicio.Descripcion,
                Categoria = servicio.Categoria,
                Precio = servicio.Precio,
                Duracion = servicio.Duracion,
                Disponible = servicio.Disponible,
                FechaCreacion = servicio.FechaCreacion
            };

            return CreatedAtAction(nameof(GetServicio), new { id = servicio.Id }, result);
        }

        // PUT: api/servicios/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutServicio(int id, [FromBody] ServicioUpdateDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var servicio = await _context.Servicios.FindAsync(id);
            if (servicio == null)
                return NotFound(new { message = $"No se encontró el servicio con Id {id}." });

            servicio.Nombre = dto.Nombre;
            servicio.Descripcion = dto.Descripcion;
            servicio.Categoria = dto.Categoria;
            servicio.Precio = dto.Precio;
            servicio.Duracion = dto.Duracion;
            servicio.Disponible = dto.Disponible;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!await _context.Servicios.AnyAsync(s => s.Id == id))
                    return NotFound();
                throw;
            }

            return NoContent();
        }

        // DELETE: api/servicios/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteServicio(int id)
        {
            var servicio = await _context.Servicios.FindAsync(id);
            if (servicio == null)
                return NotFound(new { message = $"No se encontró el servicio con Id {id}." });

            _context.Servicios.Remove(servicio);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // PATCH: api/servicios/5/disponibilidad
        [HttpPatch("{id}/disponibilidad")]
        public async Task<IActionResult> ToggleDisponibilidad(int id)
        {
            var servicio = await _context.Servicios.FindAsync(id);
            if (servicio == null)
                return NotFound(new { message = $"No se encontró el servicio con Id {id}." });

            servicio.Disponible = !servicio.Disponible;
            await _context.SaveChangesAsync();

            return Ok(new { id = servicio.Id, disponible = servicio.Disponible });
        }
    }
}