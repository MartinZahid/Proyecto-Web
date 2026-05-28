using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SistemaHoteleroWeb.Data;
using SistemaHoteleroWeb.Models;


namespace SistemaHoteleroWeb
{
    public class ServiciosController
    {
        [ApiController]
        [Route("api/[controller]")]
        public class serviciosController : ControllerBase
        {
            private readonly ApplicationDbContext _context;

            public serviciosController(ApplicationDbContext context)
            {
                _context = context;
            }

            // GET: api/servicios
            [HttpGet]
            public async Task<ActionResult<IEnumerable<Servicio>>> GetServicios()
            {
                return Ok(await _context.Servicios.ToListAsync());
            }

            // GET: api/servicios/5
            [HttpGet("{id}")]
            public async Task<ActionResult<Servicio>> GetServicio(int id)
            {
                var servicio = await _context.Servicios.FindAsync(id);
                if (servicio == null)
                    return NotFound(new { message = $"No se encontró el servicio con Id {id}." });

                return Ok(servicio);
            }

            // POST: api/servicios
            [HttpPost]
            public async Task<ActionResult<Servicio>> PostServicio([FromBody] Servicio servicio)
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                _context.Servicios.Add(servicio);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetServicio), new { id = servicio.Id }, servicio);
            }

            // PUT: api/servicios/5
            [HttpPut("{id}")]
            public async Task<IActionResult> PutServicio(int id, [FromBody] Servicio dto)
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var servicio = await _context.Servicios.FindAsync(id);
                if (servicio == null)
                    return NotFound(new { message = $"No se encontró el servicio con Id {id}." });

                servicio.Nombre = dto.Nombre;
                servicio.Descripcion = dto.Descripcion;
                servicio.Precio = dto.Precio;
                servicio.Estado = dto.Estado;

                await _context.SaveChangesAsync();
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
        }
    }
}
