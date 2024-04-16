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
    public class CustomersController : ControllerBase
    {
        private readonly MarketplaceContext _context;
        private readonly ILogger<CustomersController> _logger; // Add ILogger field

        public CustomersController(MarketplaceContext context, ILogger<CustomersController> logger) // Add logger
        {
            _context = context;
            _logger = logger; // Initialise logger
        }

        // GET: api/Customers
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Customer>>> GetCustomers()
        {
            var customers = await _context.Customers.ToListAsync();
            _logger.LogInformation($"Retrieved {customers.Count} customers.");
            return customers;
        }

        // GET: api/Customers/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Customer>> GetCustomer(int id)
        {
            var customer = await _context.Customers.FindAsync(id);

            if (customer == null)
            {
                _logger.LogWarning($"Customer with ID {id} not found.");
                return NotFound("Customer not found.");
            }

            _logger.LogInformation($"Retrieved customer with ID {id}.");
            return customer;
        }

        // PUT: api/Customers/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCustomer(int id, Customer customer)
        {
            if (!ModelState.IsValid)
            {
                _logger.LogWarning($"Update failed due to invalid model state for customer ID {id}.");
                return BadRequest(ModelState);
            }

            if (id != customer.CustomerId)
            {
                return BadRequest("ID does not match.");
            }

            _context.Entry(customer).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
                _logger.LogInformation($"Updated customer with ID {id}.");
            }
            catch (DbUpdateConcurrencyException ex)
            {
                if (!CustomerExists(id))
                {
                    _logger.LogWarning($"Attempt to update non-existing customer with ID {id}.");
                    return NotFound("Customer not found.");
                }
                else
                {
                    _logger.LogError(ex, $"An error occurred while updating customer with ID {id}.");
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Customers
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Customer>> PostCustomer(Customer customer)
        {
            if (!ModelState.IsValid)
            {
                _logger.LogWarning("Creation failed due to invalid model state.");
                return BadRequest(ModelState);
            }

            _context.Customers.Add(customer);
            await _context.SaveChangesAsync();
            _logger.LogInformation($"Created a new customer with ID {customer.CustomerId}.");

            return CreatedAtAction("GetCustomer", new { id = customer.CustomerId }, customer);
        }

        // DELETE: api/Customers/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCustomer(int id)
        {
            var customer = await _context.Customers.FindAsync(id);
            if (customer == null)
            {
                _logger.LogWarning($"Attempt to delete non-existing customer with ID {id}.");
                return NotFound("Customer not found.");
            }

            _context.Customers.Remove(customer);
            await _context.SaveChangesAsync();
            _logger.LogInformation($"Deleted customer with ID {id}.");

            return NoContent();
        }

        private bool CustomerExists(int id)
        {
            return _context.Customers.Any(e => e.CustomerId == id);
        }
    }
}
