using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SistemaHoteleroWeb.Models
{
    public class ReservacionServicio
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int ReservacionId { get; set; }

        [ForeignKey("ReservacionId")]
        public Reservacion? Reservacion { get; set; }

        [Required]
        public int ClienteId { get; set; }

        [ForeignKey("ClienteId")]
        public Cliente? Cliente { get; set; }

        [Required]
        public int ServicioId { get; set; }

        [ForeignKey("ServicioId")]
        public Servicio? Servicio { get; set; }

        [Required]
        public DateTime FechaHora { get; set; } = DateTime.Now;

        [Required]
        public int Cantidad { get; set; } = 1;

        [Column(TypeName = "decimal(10,2)")]
        public decimal Subtotal { get; set; }

        [StringLength(300)]
        public string? Observaciones { get; set; }
    }
}