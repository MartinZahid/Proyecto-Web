using Microsoft.EntityFrameworkCore;
using SistemaHoteleroWeb.Models;

namespace SistemaHoteleroWeb.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<Habitacion> Habitaciones { get; set; }
        //Prox Modelos  
        // public DbSet<Cliente>         Clientes         { get; set; }
        // public DbSet<Servicio>        Servicios        { get; set; }
        // public DbSet<Reservacion>     Reservaciones    { get; set; }
        // public DbSet<ConsumoServicio> ConsumoServicios { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Habitacion>().HasData(
                new Habitacion { Id = 1, Numero = "101", Tipo = "Sencilla", PrecioPorNoche = 800m, Estado = "Libre" },
                new Habitacion { Id = 2, Numero = "102", Tipo = "Sencilla", PrecioPorNoche = 800m, Estado = "Ocupada" },
                new Habitacion { Id = 3, Numero = "201", Tipo = "Doble", PrecioPorNoche = 1200m, Estado = "Libre" },
                new Habitacion { Id = 4, Numero = "202", Tipo = "Doble", PrecioPorNoche = 1200m, Estado = "Libre" },
                new Habitacion { Id = 5, Numero = "301", Tipo = "Suite", PrecioPorNoche = 2500m, Estado = "Libre" },
                new Habitacion { Id = 6, Numero = "302", Tipo = "Suite", PrecioPorNoche = 2500m, Estado = "Mantenimiento" }
            );
        }
    }
}