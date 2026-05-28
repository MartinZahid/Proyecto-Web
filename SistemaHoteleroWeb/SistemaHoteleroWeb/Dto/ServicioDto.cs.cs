using System.ComponentModel.DataAnnotations;

namespace SistemaHoteleroWeb.Dto
{
    public class ServicioDto
    {
        [Required]
        [StringLength(100)]
        public string Nombre { get; set; } = string.Empty;

        [StringLength(300)]
        public string? Descripcion { get; set; }

        [Required]
        public decimal Precio { get; set; }

        [Required]
        [StringLength(20)]
        public string Estado { get; set; } = "Activo";
    }
}