using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace DigitalGamesMarketplace2.Models;

public class MarketplaceContext : IdentityDbContext<IdentityUser>
{
    public MarketplaceContext(DbContextOptions<MarketplaceContext> options) : base(options)
    {
    }

    public DbSet<Customer> Customers { get; set; }
    public DbSet<Game> Games { get; set; }
    public DbSet<Developer> Developers { get; set; }
    public DbSet<Transaction> Transactions { get; set; }
    public DbSet<Wishlist> Wishlists { get; set; }
    public DbSet<GameWishlist> GameWishlists { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Define GameWishlistId as the sole primary key
        modelBuilder.Entity<GameWishlist>()
            .HasKey(wg => wg.GameWishlistId);

        // Continue to define the relationships
        modelBuilder.Entity<GameWishlist>()
            .HasOne(wg => wg.Wishlist)
            .WithMany(w => w.GameWishlists)
            .HasForeignKey(wg => wg.WishlistId);

        modelBuilder.Entity<GameWishlist>()
            .HasOne(wg => wg.Game)
            .WithMany(g => g.GameWishlists)
            .HasForeignKey(wg => wg.GameId);
    }
}