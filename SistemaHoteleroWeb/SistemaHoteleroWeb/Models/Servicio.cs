using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SistemaHoteleroWeb.Models
{
    public class Servicio
    {
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string Nombre { get; set; } = string.Empty;

        [MaxLength(500)]
        public string Descripcion { get; set; } = string.Empty;

        [Required]
        [MaxLength(50)]
        public string Categoria { get; set; } = string.Empty; // Spa, Restaurante, Tours, etc.

        [Required]
        [Column(TypeName = "decimal(10,2)")]
        [Range(0.01, 999999.99, ErrorMessage = "El precio debe ser mayor a 0.")]
        public decimal Precio { get; set; }

        [MaxLength(50)]
        public string Duracion { get; set; } = string.Empty; // Ej: "1 hora", "30 min"

        public bool Disponible { get; set; } = true;

        public DateTime FechaCreacion { get; set; } = DateTime.UtcNow;
    }
}