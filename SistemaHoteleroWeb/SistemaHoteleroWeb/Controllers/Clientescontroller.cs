using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SistemaHoteleroWeb.Data;
using SistemaHoteleroWeb.DTOs;
using SistemaHoteleroWeb.Models;

namespace SistemaHoteleroWeb.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ClientesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ClientesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/clientes
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ClienteReadDto>>> GetClientes()
        {
            var clientes = await _context.Clientes
                .Select(c => new ClienteReadDto
                {
                    Id = c.Id,
                    Nombre = c.Nombre,
                    RFC = c.RFC,
                    Telefono = c.Telefono,
                    Email = c.Email
                })
                .ToListAsync();

            return Ok(clientes);
        }

        // GET: api/clientes/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ClienteReadDto>> GetCliente(int id)
        {
            var cliente = await _context.Clientes.FindAsync(id);

            if (cliente == null)
                return NotFound(new { message = $"No se encontró el cliente con Id {id}." });

            var dto = new ClienteReadDto
            {
                Id = cliente.Id,
                Nombre = cliente.Nombre,
                RFC = cliente.RFC,
                Telefono = cliente.Telefono,
                Email = cliente.Email
            };

            return Ok(dto);
        }

        // POST: api/clientes
        [HttpPost]
        public async Task<ActionResult<ClienteReadDto>> PostCliente([FromBody] ClienteDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // Verificar RFC único
            bool rfcExiste = await _context.Clientes.AnyAsync(c => c.RFC == dto.RFC);
            if (rfcExiste)
                return Conflict(new { message = "Ya existe un cliente registrado con ese RFC." });

            var cliente = new Cliente
            {
                Nombre = dto.Nombre,
                RFC = dto.RFC.ToUpper(),
                Telefono = dto.Telefono,
                Email = dto.Email.ToLower()
            };

            _context.Clientes.Add(cliente);
            await _context.SaveChangesAsync();

            var result = new ClienteReadDto
            {
                Id = cliente.Id,
                Nombre = cliente.Nombre,
                RFC = cliente.RFC,
                Telefono = cliente.Telefono,
                Email = cliente.Email
            };

            return CreatedAtAction(nameof(GetCliente), new { id = cliente.Id }, result);
        }

        // PUT: api/clientes/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCliente(int id, [FromBody] ClienteDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var cliente = await _context.Clientes.FindAsync(id);
            if (cliente == null)
                return NotFound(new { message = $"No se encontró el cliente con Id {id}." });

            // Verificar RFC único excluyendo el registro actual
            bool rfcExiste = await _context.Clientes
                .AnyAsync(c => c.RFC == dto.RFC && c.Id != id);
            if (rfcExiste)
                return Conflict(new { message = "Ya existe otro cliente registrado con ese RFC." });

            cliente.Nombre = dto.Nombre;
            cliente.RFC = dto.RFC.ToUpper();
            cliente.Telefono = dto.Telefono;
            cliente.Email = dto.Email.ToLower();

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!await _context.Clientes.AnyAsync(c => c.Id == id))
                    return NotFound();
                throw;
            }

            return NoContent();
        }

        // DELETE: api/clientes/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCliente(int id)
        {
            var cliente = await _context.Clientes.FindAsync(id);
            if (cliente == null)
                return NotFound(new { message = $"No se encontró el cliente con Id {id}." });

            _context.Clientes.Remove(cliente);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}