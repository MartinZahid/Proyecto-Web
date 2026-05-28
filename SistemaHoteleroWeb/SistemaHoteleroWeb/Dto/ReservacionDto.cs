using System.ComponentModel.DataAnnotations;

namespace SistemaHoteleroWeb.Dto
{
    public class ReservacionDto
    {
        [Required]
        public int ClienteId { get; set; }

        [Required]
        public int HabitacionId { get; set; }

        [Required]
        public DateTime FechaEntrada { get; set; }

        [Required]
        public DateTime FechaSalida { get; set; }

        [Required]
        [StringLength(20)]
        public string Estado { get; set; } = "Pendiente";

        [StringLength(300)]
        public string? Observaciones { get; set; }
    }
}