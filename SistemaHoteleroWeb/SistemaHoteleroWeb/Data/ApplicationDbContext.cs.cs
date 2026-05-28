using Microsoft.EntityFrameworkCore;
using SistemaHoteleroWeb.Models;

namespace SistemaHoteleroWeb.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options) { }

        public DbSet<Cliente> Clientes { get; set; }
        public DbSet<Servicio> Servicios { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Seed de categorías de servicios de ejemplo
            modelBuilder.Entity<Servicio>().HasData(
                new Servicio
                {
                    Id = 1,
                    Nombre = "Masaje relajante",
                    Descripcion = "Masaje corporal completo de 60 minutos",
                    Categoria = "Spa",
                    Precio = 850.00m,
                    Duracion = "60 min",
                    Disponible = true,
                    FechaCreacion = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc)
                },
                new Servicio
                {
                    Id = 2,
                    Nombre = "Desayuno buffet",
                    Descripcion = "Buffet continental con opciones calientes",
                    Categoria = "Restaurante",
                    Precio = 320.00m,
                    Duracion = "90 min",
                    Disponible = true,
                    FechaCreacion = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc)
                },
                new Servicio
                {
                    Id = 3,
                    Nombre = "Tour ciudad colonial",
                    Descripcion = "Recorrido guiado por el centro histórico",
                    Categoria = "Tours",
                    Precio = 650.00m,
                    Duracion = "4 horas",
                    Disponible = true,
                    FechaCreacion = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc)
                }
            );
        }
    }
}