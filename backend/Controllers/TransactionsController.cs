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
    public class TransactionsController : ControllerBase
    {
        private readonly MarketplaceContext _context;
        private readonly ILogger<TransactionsController> _logger; // Add ILogger field

        public TransactionsController(MarketplaceContext context, ILogger<TransactionsController> logger) // Add logger
        {
            _context = context;
            _logger = logger; // Initialise logger
        }

        // GET: api/Transactions
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Transaction>>> GetTransactions()
        {
            var transactions = await _context.Transactions.ToListAsync();
            _logger.LogInformation($"Retrieved all transactions successfully with count: {transactions.Count}");
            return transactions;
        }

        // GET: api/Transactions/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Transaction>> GetTransaction(int id)
        {
            var transaction = await _context.Transactions.FindAsync(id);

            if (transaction == null)
            {
                _logger.LogWarning($"Transaction with ID {id} not found.");
                return NotFound("Transaction not found.");
            }

            _logger.LogInformation($"Retrieved transaction with ID {id} successfully.");
            return transaction;
        }

        // PUT: api/Transactions/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTransaction(int id, Transaction transaction)
        {
            if (!ModelState.IsValid)
            {
                _logger.LogWarning($"Update failed due to invalid model state for transaction ID {id}.");
                return BadRequest(ModelState);
            }

            if (id != transaction.TransactionId)
            {
                return BadRequest("ID does not match.");
            }

            _context.Entry(transaction).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
                _logger.LogInformation($"Transaction ID {id} updated successfully.");
            }
            catch (DbUpdateConcurrencyException ex)
            {
                if (!TransactionExists(id))
                {
                    _logger.LogWarning($"Transaction ID {id} not found for update.");
                    return NotFound("Transaction not found.");
                }
                else
                {
                    _logger.LogError(ex, $"An error occurred while updating transaction ID {id}.");
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Transactions
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Transaction>> PostTransaction(Transaction transaction)
        {
            if (!ModelState.IsValid)
            {
                _logger.LogWarning("Attempt to create a new transaction failed due to invalid model state.");
                return BadRequest(ModelState);
            }

            _context.Transactions.Add(transaction);
            await _context.SaveChangesAsync();
            _logger.LogInformation($"A new transaction with ID {transaction.TransactionId} created successfully.");

            return CreatedAtAction("GetTransaction", new { id = transaction.TransactionId }, transaction);
        }

        // DELETE: api/Transactions/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTransaction(int id)
        {
            var transaction = await _context.Transactions.FindAsync(id);
            if (transaction == null)
            {
                _logger.LogWarning($"Attempt to delete non-existing transaction with ID {id}.");
                return NotFound("Transaction not found.");
            }

            _context.Transactions.Remove(transaction);
            await _context.SaveChangesAsync();
            _logger.LogInformation($"Transaction with ID {id} deleted successfully.");

            return NoContent();
        }

        private bool TransactionExists(int id)
        {
            return _context.Transactions.Any(e => e.TransactionId == id);
        }
    }
}
