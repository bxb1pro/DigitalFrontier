using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DigitalGamesMarketplace2.Models;
using Microsoft.AspNetCore.Authorization;

namespace DigitalGamesMarketplace2.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "SuperAdmin,Admin")]
    public class GamesController : ControllerBase
    {
        private readonly MarketplaceContext _context;
        private readonly ILogger<GamesController> _logger; // Add ILogger field

        public GamesController(MarketplaceContext context, ILogger<GamesController> logger) // Add logger
        {
            _context = context;
            _logger = logger; // Initialise logger
        }

        // GET: api/Games
        [HttpGet]
        [Authorize(Roles = "SuperAdmin,Admin,User")]
        [AllowAnonymous] // For demonstration of PostgreSQl database on cloud being successfully connected to web app deployed on Azure
        public async Task<ActionResult<IEnumerable<Game>>> GetGames()
        {
            var games = await _context.Games.ToListAsync();
            _logger.LogInformation($"Retrieved {games.Count} games at {DateTime.UtcNow:yyyy-MM-dd HH:mm:ss}");
            return games;
        }

        // GET: api/Games/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Game>> GetGame(int id)
        {
            var game = await _context.Games.FindAsync(id);

            if (game == null)
            {
                _logger.LogWarning($"Game with ID {id} not found at {DateTime.UtcNow:yyyy-MM-dd HH:mm:ss}");
                return NotFound("Game not found.");
            }

            _logger.LogInformation($"Retrieved game with ID {id} successfully at {DateTime.UtcNow:yyyy-MM-dd HH:mm:ss}");
            return game;
        }

        // PUT: api/Games/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutGame(int id, Game game)
        {
            if (!ModelState.IsValid)
            {
                _logger.LogWarning($"Update failed due to invalid model state for game ID {id}.");
                return BadRequest(ModelState);
            }

            if (id != game.GameId)
            {
                return BadRequest("ID does not match.");
            }

            _context.Entry(game).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
                _logger.LogInformation($"Game ID {id} updated successfully.");
            }
            catch (DbUpdateConcurrencyException ex)
            {
                if (!GameExists(id))
                {
                    _logger.LogWarning($"Attempt to update non-existing game with ID {id}.");
                    return NotFound("Game not found.");
                }
                else
                {
                    _logger.LogError(ex, $"An error occurred while updating game with ID {id}.");
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Games
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Game>> PostGame(Game game)
        {
            if (!ModelState.IsValid)
            {
                _logger.LogWarning("Attempt to create a new game failed due to invalid model state.");
                return BadRequest(ModelState);
            }

            _context.Games.Add(game);
            await _context.SaveChangesAsync();
            _logger.LogInformation($"A new game with ID {game.GameId} created successfully.");

            return CreatedAtAction("GetGame", new { id = game.GameId }, game);
        }

        // DELETE: api/Games/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteGame(int id)
        {
            var game = await _context.Games.FindAsync(id);
            if (game == null)
            {
                _logger.LogWarning($"Attempt to delete non-existing game with ID {id}.");
                return NotFound("Game not found.");
            }

            _context.Games.Remove(game);
            await _context.SaveChangesAsync();
            _logger.LogInformation($"Game with ID {id} deleted successfully.");

            return NoContent();
        }

        private bool GameExists(int id)
        {
            return _context.Games.Any(e => e.GameId == id);
        }
    }
}
