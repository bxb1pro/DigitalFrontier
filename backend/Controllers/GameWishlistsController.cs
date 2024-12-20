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
    // [Authorize(Roles = "SuperAdmin,Admin")]
    public class GameWishlistsController : ControllerBase
    {
        private readonly MarketplaceContext _context;
        private readonly ILogger<GameWishlistsController> _logger; // Add ILogger field

        public GameWishlistsController(MarketplaceContext context, ILogger<GameWishlistsController> logger) // Add logger
        {
            _context = context;
            _logger = logger; // Initialise logger
        }

        // GET: api/GameWishlists
        [HttpGet]
        public async Task<ActionResult<IEnumerable<GameWishlist>>> GetGameWishlists()
        {
            var gameWishlists = await _context.GameWishlists.ToListAsync();
            _logger.LogInformation($"Retrieved all game wishlists successfully with count: {gameWishlists.Count}");
            return gameWishlists;
        }

        // GET: api/GameWishlists/5
        [HttpGet("{id}")]
        public async Task<ActionResult<GameWishlist>> GetGameWishlist(int id)
        {
            var gameWishlist = await _context.GameWishlists.FindAsync(id);

            if (gameWishlist == null)
            {
                _logger.LogWarning($"Game wishlist with ID {id} not found.");
                return NotFound("Game wishlist not found.");
            }

            _logger.LogInformation($"Retrieved game wishlist with ID {id} successfully.");
            return gameWishlist;
        }

        // PUT: api/GameWishlists/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutGameWishlist(int id, GameWishlist gameWishlist)
        {
            if (!ModelState.IsValid)
            {
                _logger.LogWarning("Update failed due to invalid model state for game wishlist ID {id}.", id);
                return BadRequest(ModelState);
            }

            if (id != gameWishlist.GameWishlistId)
            {
                _logger.LogWarning("Mismatch between route ID {RouteId} and game wishlist ID {GameWishlistId} in the request body.", id, gameWishlist.GameWishlistId);
                return BadRequest("ID does not match.");
            }

            _context.Entry(gameWishlist).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
                _logger.LogInformation($"Game wishlist ID {id} updated successfully.");
            }
            catch (DbUpdateConcurrencyException ex)
            {
                if (!GameWishlistExists(id))
                {
                    _logger.LogWarning($"Game wishlist ID {id} not found for update.");
                    return NotFound("Game wishlist not found.");
                }
                else
                {
                    _logger.LogError(ex, $"An error occurred while updating game wishlist ID {id}.");
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/GameWishlists
        [HttpPost]
        public async Task<ActionResult<GameWishlist>> PostGameWishlist(GameWishlist gameWishlist)
        {
            if (!ModelState.IsValid)
            {
                _logger.LogWarning("Creation of a new game wishlist failed due to invalid model state.");
                return BadRequest(ModelState);
            }

            try
            {
                _context.GameWishlists.Add(gameWishlist);
                await _context.SaveChangesAsync();
                _logger.LogInformation($"A new game wishlist with ID {gameWishlist.GameWishlistId} created successfully.");
                return CreatedAtAction("GetGameWishlist", new { id = gameWishlist.GameWishlistId }, gameWishlist);
            }
            catch (DbUpdateException ex)
            {  
                if (ex.InnerException is Npgsql.PostgresException pgEx && pgEx.SqlState == "23503")
                {
                    return BadRequest("Failed to add to wishlist: the specified game or wishlist does not exist.");
                }

                return StatusCode(500, "An error occurred while creating the game wishlist. Please try again later.");
            }
        }

        // DELETE: api/GameWishlists/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteGameWishlist(int id)
        {
            var gameWishlist = await _context.GameWishlists.FindAsync(id);
            if (gameWishlist == null)
            {
                _logger.LogWarning($"Attempt to delete non-existing game wishlist with ID {id}.");
                return NotFound("Game wishlist not found.");
            }

            _context.GameWishlists.Remove(gameWishlist);
            await _context.SaveChangesAsync();
            _logger.LogInformation($"Game wishlist with ID {id} deleted successfully.");

            return NoContent();
        }

        private bool GameWishlistExists(int id)
        {
            return _context.GameWishlists.Any(e => e.GameWishlistId == id);
        }

        // DELETE: api/GameWishlists/Clear/{customerId}
        [HttpDelete("Clear/{customerId}")]
        public async Task<IActionResult> ClearWishlistByCustomerId(int customerId)
        {
            var wishlist = await _context.Wishlists.FirstOrDefaultAsync(w => w.CustomerId == customerId);
            if (wishlist == null)
            {
                _logger.LogWarning($"No wishlist found for customer ID {customerId}.");
                return NotFound("Wishlist not found.");
            }

            var gameWishlists = await _context.GameWishlists.Where(gw => gw.WishlistId == wishlist.WishlistId).ToListAsync();
            if (gameWishlists.Count == 0)
            {
                return NoContent(); // No items to delete
            }

            _context.GameWishlists.RemoveRange(gameWishlists);
            await _context.SaveChangesAsync();
            _logger.LogInformation($"Cleared all items from wishlist for customer ID {customerId}.");

            return NoContent();
        }

        // GET: api/GameWishlists/Wishlist/5
        [HttpGet("Wishlist/{wishlistId}")]
        public async Task<ActionResult<IEnumerable<GameWishlist>>> GetGamesForWishlist(int wishlistId)
        {
            var gameWishlists = await _context.GameWishlists
                .Where(gw => gw.WishlistId == wishlistId)
                .ToListAsync();

            if (!gameWishlists.Any())
            {
                _logger.LogWarning($"No games found in wishlist with ID {wishlistId}.");
                return Ok(new List<GameWishlist>()); // Return an empty list instead of NotFound
            }

            _logger.LogInformation($"Retrieved {gameWishlists.Count} games for wishlist ID {wishlistId}.");
            return gameWishlists;
        }

    }
}
