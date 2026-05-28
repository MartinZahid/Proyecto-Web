using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SistemaHoteleroWeb.Data;
using SistemaHoteleroWeb.Dto;
using SistemaHoteleroWeb.DTOs;
using SistemaHoteleroWeb.Models;

namespace SistemaHoteleroWeb.Controllers
{
    
        [ApiController]
        [Route("api/[controller]")]
        public class clientesController : ControllerBase
        {
            private readonly ApplicationDbContext _context;

            public clientesController(ApplicationDbContext context)
            {
                _context = context;
            }

            // GET: api/clientes
            [HttpGet]
            public async Task<ActionResult<IEnumerable<Cliente>>> GetClientes()
            {
                return Ok(await _context.Clientes.ToListAsync());
            }

            // GET: api/clientes/5
            [HttpGet("{id}")]
            public async Task<ActionResult<Cliente>> GetCliente(int id)
            {
                var cliente = await _context.Clientes.FindAsync(id);

                if (cliente == null)
                    return NotFound(new { message = $"No se encontró el cliente con Id {id}." });

                return Ok(cliente);
            }

            // POST: api/clientes
            [HttpPost]
            public async Task<ActionResult<Cliente>> PostCliente([FromBody] ClienteDto dto)
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                bool rfcExiste = await _context.Clientes.AnyAsync(c => c.RFC == dto.RFC);
                if (rfcExiste)
                    return Conflict(new { message = $"Ya existe un cliente con el RFC {dto.RFC}." });

                bool emailExiste = await _context.Clientes.AnyAsync(c => c.Email == dto.Email);
                if (emailExiste)
                    return Conflict(new { message = $"Ya existe un cliente con el email {dto.Email}." });

                var cliente = new Cliente
                {
                    Nombre = dto.Nombre,
                    RFC = dto.RFC,
                    Telefono = dto.Telefono,
                    Email = dto.Email
                };

                _context.Clientes.Add(cliente);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetCliente), new { id = cliente.Id }, cliente);
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

                bool rfcDuplicado = await _context.Clientes
                    .AnyAsync(c => c.RFC == dto.RFC && c.Id != id);
                if (rfcDuplicado)
                    return Conflict(new { message = $"El RFC {dto.RFC} ya está registrado en otro cliente." });

                bool emailDuplicado = await _context.Clientes
                    .AnyAsync(c => c.Email == dto.Email && c.Id != id);
                if (emailDuplicado)
                    return Conflict(new { message = $"El email {dto.Email} ya está registrado en otro cliente." });

                cliente.Nombre = dto.Nombre;
                cliente.RFC = dto.RFC;
                cliente.Telefono = dto.Telefono;
                cliente.Email = dto.Email;

                await _context.SaveChangesAsync();
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