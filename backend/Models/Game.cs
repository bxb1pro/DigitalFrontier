using System.Text.Json.Serialization;

namespace DigitalGamesMarketplace2.Models;

public class Game
{
    public int GameId { get; set; }
    public string Name { get; set; }
    public decimal Price { get; set; }
    public string Genre { get; set; }
    public DateTimeOffset ReleaseDate { get; set; }
    public int DeveloperId { get; set; } // FK for Developer

    [JsonIgnore]
    public Developer? Developer { get; set; } // Navigation to Developer (FK)
    [JsonIgnore]
    public ICollection<Transaction>? Transactions { get; set; } // Navigation to Transaction
    [JsonIgnore]
    public ICollection<GameWishlist>? GameWishlists { get; set; } = new List<GameWishlist>(); // For the many-to-many relationship
}