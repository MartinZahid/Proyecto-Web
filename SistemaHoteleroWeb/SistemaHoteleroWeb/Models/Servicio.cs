using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SistemaHoteleroWeb.Models
{
    public class Servicio
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public string Nombre { get; set; } = string.Empty;

        [StringLength(300)]
        public string? Descripcion { get; set; }

        [Required]
        [Column(TypeName = "decimal(10,2)")]
        public decimal Precio { get; set; }

        [Required]
        [StringLength(20)]
        public string Estado { get; set; } = "Activo";
    }
}