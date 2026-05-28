using System.ComponentModel.DataAnnotations;

namespace SistemaHoteleroWeb.Dto
{
    public class HabitacionDto
    {
        [Required(ErrorMessage = "El número de habitación es obligatorio.")]
        [StringLength(10)]
        public string Numero { get; set; } = string.Empty;

        [Required(ErrorMessage = "El tipo de habitación es obligatorio.")]
        [StringLength(50)]
        public string Tipo { get; set; } = string.Empty;

        [Required(ErrorMessage = "El precio por noche es obligatorio.")]
        [Range(0.01, 99999.99, ErrorMessage = "El precio debe ser mayor a 0.")]
        public decimal PrecioPorNoche { get; set; }

        [Required(ErrorMessage = "El estado es obligatorio.")]
        [StringLength(20)]
        public string Estado { get; set; } = "Libre";
    }
}
