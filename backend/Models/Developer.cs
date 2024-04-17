using System.Text.Json.Serialization;

namespace DigitalGamesMarketplace2.Models;

public class Developer
{
    public int DeveloperId { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public string ContactEmail { get; set; }
    public double Latitude { get; set; }
    public double Longitude { get; set; }

    [JsonIgnore]
    public ICollection<Game>? Games { get; set; } // Navigation to Game
}