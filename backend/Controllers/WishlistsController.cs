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
    public class WishlistsController : ControllerBase
    {
        private readonly MarketplaceContext _context;
        private readonly ILogger<WishlistsController> _logger; // Add ILogger field

        public WishlistsController(MarketplaceContext context, ILogger<WishlistsController> logger) // Add logger
        {
            _context = context;
            _logger = logger; // Initialise logger
        }

        // GET: api/Wishlists
        [HttpGet]
        [Authorize(Roles = "SuperAdmin,Admin,User")]
        public async Task<ActionResult<IEnumerable<Wishlist>>> GetWishlists()
        {
            var wishlists = await _context.Wishlists.ToListAsync();
            _logger.LogInformation($"Retrieved all wishlists successfully with count: {wishlists.Count}");
            return wishlists;
        }

        // GET: api/Wishlists/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Wishlist>> GetWishlist(int id)
        {
            var wishlist = await _context.Wishlists.FindAsync(id);

            if (wishlist == null)
            {
                _logger.LogWarning($"Wishlist with ID {id} not found.");
                return NotFound("Wishlist not found.");
            }

            _logger.LogInformation($"Retrieved wishlist with ID {id} successfully.");
            return wishlist;
        }

        // PUT: api/Wishlists/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutWishlist(int id, Wishlist wishlist)
        {
            if (!ModelState.IsValid)
            {
                _logger.LogWarning($"Update failed due to invalid model state for wishlist ID {id}.");
                return BadRequest(ModelState);
            }

            if (id != wishlist.WishlistId)
            {
                return BadRequest("ID does not match.");
            }

            _context.Entry(wishlist).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
                _logger.LogInformation($"Wishlist ID {id} updated successfully.");
            }
            catch (DbUpdateConcurrencyException ex)
            {
                if (!WishlistExists(id))
                {
                    _logger.LogWarning($"Wishlist ID {id} not found for update.");
                    return NotFound("Wishlist not found.");
                }
                else
                {
                    _logger.LogError(ex, $"An error occurred while updating wishlist ID {id}.");
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Wishlists
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Wishlist>> PostWishlist(Wishlist wishlist)
        {
            if (!ModelState.IsValid)
            {
                _logger.LogWarning("Attempt to create a new wishlist failed due to invalid model state.");
                return BadRequest(ModelState);
            }

            _context.Wishlists.Add(wishlist);
            await _context.SaveChangesAsync();
            _logger.LogInformation($"A new wishlist with ID {wishlist.WishlistId} created successfully.");

            return CreatedAtAction("GetWishlist", new { id = wishlist.WishlistId }, wishlist);
        }

        // DELETE: api/Wishlists/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteWishlist(int id)
        {
            var wishlist = await _context.Wishlists.FindAsync(id);
            if (wishlist == null)
            {
                _logger.LogWarning($"Attempt to delete non-existing wishlist with ID {id}.");
                return NotFound("Wishlist not found.");
            }

            _context.Wishlists.Remove(wishlist);
            await _context.SaveChangesAsync();
            _logger.LogInformation($"Wishlist with ID {id} deleted successfully.");

            return NoContent();
        }

        private bool WishlistExists(int id)
        {
            return _context.Wishlists.Any(e => e.WishlistId == id);
        }
    }
}
