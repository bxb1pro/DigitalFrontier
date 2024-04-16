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
    public class DevelopersController : ControllerBase
    {
        private readonly MarketplaceContext _context;
        private readonly ILogger<DevelopersController> _logger; // Add ILogger field

        public DevelopersController(MarketplaceContext context, ILogger<DevelopersController> logger) // Add logger
        {
            _context = context;
            _logger = logger; // Initialise logger
        }

        // GET: api/Developers
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Developer>>> GetDevelopers()
        {
            var developers = await _context.Developers.ToListAsync();
            _logger.LogInformation("Retrieved all developers successfully.");
            return developers;
        }

        // GET: api/Developers/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Developer>> GetDeveloper(int id)
        {
            var developer = await _context.Developers.FindAsync(id);

            if (developer == null)
            {
                _logger.LogWarning($"Developer with ID {id} not found.");
                return NotFound("Developer not found.");
            }

            _logger.LogInformation($"Retrieved developer with ID {id} successfully.");
            return developer;
        }

        // PUT: api/Developers/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutDeveloper(int id, Developer developer)
        {
            if (!ModelState.IsValid)
            {
                _logger.LogWarning("Update failed due to invalid model state for developer ID {DeveloperId}.", id);

                return BadRequest(ModelState);
            }

            if (id != developer.DeveloperId)
            {
                return BadRequest("ID does not match.");
            }

            _context.Entry(developer).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
                _logger.LogInformation($"Developer ID {id} updated successfully.");
            }
            catch (DbUpdateConcurrencyException ex)
            {
                if (!DeveloperExists(id))
                {
                    _logger.LogWarning($"Developer ID {id} not found for update.");
                    return NotFound("Developer not found.");
                }
                else
                {
                    _logger.LogError(ex, $"An error occurred while updating developer ID {id}.");
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Developers
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Developer>> PostDeveloper(Developer developer)
        {
            if (!ModelState.IsValid)
            {
                _logger.LogWarning("Creation of a new developer failed due to invalid model state.");
                return BadRequest(ModelState);
            }

            _context.Developers.Add(developer);
            await _context.SaveChangesAsync();
            _logger.LogInformation($"A new developer with ID {developer.DeveloperId} created successfully.");

            return CreatedAtAction("GetDeveloper", new { id = developer.DeveloperId }, developer);
        }

        // DELETE: api/Developers/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDeveloper(int id)
        {
            var developer = await _context.Developers.FindAsync(id);
            if (developer == null)
            {
                _logger.LogWarning($"Attempt to delete developer with ID {id} failed as it does not exist.");
                return NotFound("Developer not found.");
            }

            _context.Developers.Remove(developer);
            await _context.SaveChangesAsync();
            _logger.LogInformation($"Developer with ID {id} deleted successfully.");

            return NoContent();
        }

        private bool DeveloperExists(int id)
        {
            return _context.Developers.Any(e => e.DeveloperId == id);
        }
    }
}
