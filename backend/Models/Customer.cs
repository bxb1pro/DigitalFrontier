using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace DigitalGamesMarketplace2.Models;

public class Customer
{
    public int CustomerId { get; set; }
    public string Name { get; set; }
    public string Email { get; set; }
    public DateTimeOffset JoinDate { get; set; }

    // Link to Identity User
    public string? UserId { get; set; }
    [JsonIgnore]
    public IdentityUser User { get; set; }

    [JsonIgnore]
    public ICollection<Transaction>? Transactions { get; set; } // Navigation to Transaction
    [JsonIgnore]
    public ICollection<Wishlist>? Wishlists { get; set; } // Navigation to Wishlist
}