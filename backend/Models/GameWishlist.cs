using System;
using System.Text.Json.Serialization;

namespace DigitalGamesMarketplace2.Models
{
    public class GameWishlist // Link table for many-to-many relationship between Game and Wishlist tables
    {
        public int GameWishlistId { get; set; } // PK
        public int WishlistId { get; set; } // FK for Wishlist
        public int GameId { get; set; } // FK for Game

        [JsonIgnore]
        public Wishlist? Wishlist { get; set; } // Navigation to Wishlist
        [JsonIgnore]
        public Game? Game { get; set; } // Navigation to Game
    }
}

