using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SilverPages.Server.Data;
using SilverPages.Server.Model;

namespace SilverPages.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookItemsController : ControllerBase
    {
        private readonly SilverPagesContext _context;

        public BookItemsController(SilverPagesContext context)
        {
            _context = context;
        }

        // GET: api/BookItems/5
        [HttpGet("{bookId}")]
        public async Task<ActionResult<BookItem>> GetBookItem(string bookId)
        {
            var curUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var bookItem = await _context.BookItems.FindAsync(curUserId, bookId);

            if (bookItem == null)
            {
                return NotFound();
            }

            return bookItem;
        }

        // PUT: api/BookItems/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{bookId}")]
        public async Task<IActionResult> PutBookItem(string bookId, BookItem bookItem)
        {
            if (bookId != bookItem.BookId)
            {
                return BadRequest();
            }

            _context.Entry(bookItem).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!BookItemExists(bookId))
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

        // PUT: api/BookItems
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<BookItem>> PostBookItem(BookItem bookItem)
        {
            var shelfExists = await _context.Shelves.AnyAsync(s => s.SilverPagesUserId == bookItem.SilverPagesUserId && s.ShelfName == bookItem.ShelfName);
            if (!shelfExists) {
                return NotFound();
            }

            bookItem.SilverPagesUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            _context.BookItems.Add(bookItem);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (bookItem.BookId != null && BookItemExists(bookItem.BookId))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetBookItem", new { id = bookItem.BookId }, bookItem);
        }

        [HttpDelete]
        public async Task<IActionResult> DeleteBookItem(string bookId)
        {
            var curUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var bookItem = await _context.BookItems.FindAsync(curUserId, bookId);
            if (bookItem == null)
            {
                return NotFound();
            }

            _context.BookItems.Remove(bookItem);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool BookItemExists(string bookId)
        {
            var curUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            return _context.BookItems.Any(e => e.SilverPagesUserId == curUserId && e.BookId == bookId);
        }
    }
}
