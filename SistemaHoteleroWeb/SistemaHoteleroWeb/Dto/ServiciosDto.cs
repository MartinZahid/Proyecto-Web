using System.ComponentModel.DataAnnotations;

namespace SistemaHoteleroWeb.DTOs
{
    // DTO para crear un nuevo servicio (POST)
    public class ServicioCreateDto
    {
        [Required(ErrorMessage = "El nombre del servicio es obligatorio.")]
        [MaxLength(100, ErrorMessage = "El nombre no puede exceder 100 caracteres.")]
        public string Nombre { get; set; } = string.Empty;

        [MaxLength(500, ErrorMessage = "La descripción no puede exceder 500 caracteres.")]
        public string Descripcion { get; set; } = string.Empty;

        [Required(ErrorMessage = "La categoría es obligatoria.")]
        [MaxLength(50)]
        public string Categoria { get; set; } = string.Empty;

        [Required(ErrorMessage = "El precio es obligatorio.")]
        [Range(0.01, 999999.99, ErrorMessage = "El precio debe ser mayor a 0.")]
        public decimal Precio { get; set; }

        [MaxLength(50)]
        public string Duracion { get; set; } = string.Empty;
    }

    // DTO para actualizar un servicio (PUT)
    public class ServicioUpdateDto
    {
        [Required(ErrorMessage = "El nombre del servicio es obligatorio.")]
        [MaxLength(100)]
        public string Nombre { get; set; } = string.Empty;

        [MaxLength(500)]
        public string Descripcion { get; set; } = string.Empty;

        [Required(ErrorMessage = "La categoría es obligatoria.")]
        [MaxLength(50)]
        public string Categoria { get; set; } = string.Empty;

        [Required(ErrorMessage = "El precio es obligatorio.")]
        [Range(0.01, 999999.99, ErrorMessage = "El precio debe ser mayor a 0.")]
        public decimal Precio { get; set; }

        [MaxLength(50)]
        public string Duracion { get; set; } = string.Empty;

        public bool Disponible { get; set; }
    }

    // DTO de respuesta (GET)
    public class ServicioReadDto
    {
        public int Id { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public string Descripcion { get; set; } = string.Empty;
        public string Categoria { get; set; } = string.Empty;
        public decimal Precio { get; set; }
        public string Duracion { get; set; } = string.Empty;
        public bool Disponible { get; set; }
        public DateTime FechaCreacion { get; set; }
    }
}