using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Duende.IdentityServer.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SilverPages.Server.Data;
using SilverPages.Server.Model;

namespace SilverPages.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ShelvesController : ControllerBase
    {
        private readonly SilverPagesContext _context;

        // ToDo: Make an interface for bookItemsController
        public ShelvesController(SilverPagesContext context)
        {
            _context = context;        }

        // GET: api/Shelves
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Shelf>>> GetShelves()
        {
            var curUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            return await _context.Shelves.Where(shelf => shelf.SilverPagesUserId == curUserId).ToListAsync();
        }

        // GET: api/Shelves/5
        [HttpGet("{shelfName}")]
        public async Task<ActionResult<Shelf>> GetShelf(string shelfName)
        {
            var curUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var shelf = await _context.Shelves.FindAsync(curUserId, shelfName);

            if (shelf == null)
            {
                return NotFound();
            }

            return shelf;
        }

        [HttpGet("{id}/books")]
        public async Task<ActionResult<ICollection<BookItem>>> GetBooksForShelf(string shelfName)
        {
            var curUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var shelf = await _context.Shelves.FindAsync(curUserId, shelfName);

            if (shelf == null)
            {
                return NotFound();
            }

            return Ok(shelf.Books);
        }

        // PUT: api/Shelves/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutShelf(string shelfName, Shelf shelf)
        {
            if (shelfName != shelf.ShelfName)
            {
                return BadRequest();
            }

            _context.Entry(shelf).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ShelfExists(shelfName))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Shelves
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Shelf>> PostShelf(Shelf shelf)
        {
            shelf.SilverPagesUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            _context.Shelves.Add(shelf);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (shelf.ShelfName != null && ShelfExists(shelf.ShelfName))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetShelf", new { shelfName = shelf.ShelfName }, shelf);
        }

        // DELETE: api/Shelves/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteShelf(string shelfName)
        {
            var curUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var shelf = await _context.Shelves.FindAsync(curUserId, shelfName);
            if (shelf == null)
            {
                return NotFound();
            }

            _context.Shelves.Remove(shelf);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ShelfExists(string shelfName)
        {
            var curUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            return _context.Shelves.Any(e => e.SilverPagesUserId == curUserId && e.ShelfName == shelfName);
        }
    }
}
