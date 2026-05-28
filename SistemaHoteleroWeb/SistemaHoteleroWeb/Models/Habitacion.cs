using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SistemaHoteleroWeb.Models
{
    public class Habitacion
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(10)]
        public string Numero { get; set; } = string.Empty;

        [Required]
        [StringLength(50)]
        public string Tipo { get; set; } = string.Empty;

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal PrecioPorNoche { get; set; }

        [Required]
        [StringLength(20)]
        public string Estado { get; set; } = "Libre"; 
    }
}
