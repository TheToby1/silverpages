using System;
using System.Collections.Generic;
using System.Linq;
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
    public class BookGenresController : ControllerBase
    {
        private readonly SilverPagesContext _context;

        public BookGenresController(SilverPagesContext context)
        {
            _context = context;
        }

        // GET: api/BookGenres
        [HttpGet]
        public async Task<ActionResult<IEnumerable<BookGenre>>> GetBookGenre()
        {
            return await _context.BookGenres.ToListAsync();
        }

        [HttpGet("{id}/books")]
        public async Task<ActionResult<IEnumerable<SimpleBookRecord>>> GetBooksForBookGenre(string genre)
        {
            var bookGenre = await _context.BookGenres.FindAsync(genre);

            if (bookGenre == null)
            {
                return NotFound();
            }

            return bookGenre.Books.Select(b => b.ToSimpleRecord()).OfType<SimpleBookRecord>().ToList();
        }
    }
}
