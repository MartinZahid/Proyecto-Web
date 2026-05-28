using System.ComponentModel.DataAnnotations;

namespace SistemaHoteleroWeb.Dto
{
    public class ReservacionServicioDto
    {
        [Required]
        public int ReservacionId { get; set; }

        [Required]
        public int ClienteId { get; set; }

        [Required]
        public int ServicioId { get; set; }

        [Required]
        public DateTime FechaHora { get; set; }

        [Required]
        [Range(1, int.MaxValue, ErrorMessage = "La cantidad debe ser al menos 1.")]
        public int Cantidad { get; set; } = 1;

        [StringLength(300)]
        public string? Observaciones { get; set; }
    }
}