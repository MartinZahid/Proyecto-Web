using System.ComponentModel.DataAnnotations;

namespace SistemaHoteleroWeb.Models
{
    public class Cliente
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public string Nombre { get; set; } = string.Empty;

        [Required]
        [StringLength(13, MinimumLength = 12)] // El RFC en México tiene 12 o 13 caracteres
        public string RFC { get; set; } = string.Empty;

        [Required]
        [StringLength(15)]
        public string Telefono { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        [StringLength(100)]
        public string Email { get; set; } = string.Empty;
    }
}