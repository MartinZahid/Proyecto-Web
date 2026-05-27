using System.ComponentModel.DataAnnotations;

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
        public decimal PrecioPorNoche { get; set; }

        [Required]
        [StringLength(20)]
        public string Estado { get; set; } = "Libre"; 
    }
}
