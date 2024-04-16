using System.Text.Json.Serialization;

namespace DigitalGamesMarketplace2.Models;

public class Customer
{
    public int CustomerId { get; set; }
    public string Name { get; set; }
    public string Email { get; set; }
    public DateTimeOffset JoinDate { get; set; }
        
    [JsonIgnore]
    public ICollection<Transaction>? Transactions { get; set; } // Navigation to Transaction
    [JsonIgnore]
    public ICollection<Wishlist>? Wishlists { get; set; } // Navigation to Wishlist
}