using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SistemaHoteleroWeb.Models
{
    public class Reservacion
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int ClienteId { get; set; }

        [ForeignKey("ClienteId")]
        public Cliente? Cliente { get; set; }

        [Required]
        public int HabitacionId { get; set; }

        [ForeignKey("HabitacionId")]
        public Habitacion? Habitacion { get; set; }

        [Required]
        public DateTime FechaEntrada { get; set; }

        [Required]
        public DateTime FechaSalida { get; set; }

        [Required]
        [StringLength(20)]
        public string Estado { get; set; } = "Pendiente";
        // Estados sugeridos: Pendiente, Confirmada, Cancelada, Completada

        [Column(TypeName = "decimal(10,2)")]
        public decimal TotalPagar { get; set; }

        [StringLength(300)]
        public string? Observaciones { get; set; }

        public DateTime FechaCreacion { get; set; } = DateTime.Now;
    }
}