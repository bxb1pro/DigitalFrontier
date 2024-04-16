using System;
using System.Text.Json.Serialization;

namespace DigitalGamesMarketplace2.Models
{
    public class Wishlist
    {
        public int WishlistId { get; set; }
        public int CustomerId { get; set; } // FK for Customer

        [JsonIgnore]
        public Customer? Customer { get; set; } // Navigation to Customer (FK)
        [JsonIgnore]
        public ICollection<GameWishlist>? GameWishlists { get; set; } = new List<GameWishlist>(); // For the many-to-many relationship
    }
}

