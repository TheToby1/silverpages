using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SilverPages.Server.Data;
using SilverPages.Server.Model;
using System.Linq.Dynamic.Core;
using System.Linq;
using SilverPages.Server.Model.NewFolder;
using static SilverPages.Server.Model.Book;
using System.ComponentModel.DataAnnotations.Schema;

namespace SilverPages.Server.Controllers
{
    public record PaginatedResponse<T>(long count, IEnumerable<T> data);

    [Route("[controller]")]
    [ApiController]
    public class BooksController : ControllerBase
    {
        private readonly SilverPagesContext _context;
        private static readonly IEnumerable<string?> _validOrderDir = new HashSet<string?> { "asc", "desc", null };

        public BooksController(SilverPagesContext context)
        {
            _context = context;
        }

        // GET: api/Books
        [HttpGet]
        public async Task<ActionResult<PaginatedResponse<ComplexBookRecord>>> GetBooks([FromQuery] int pageSize, [FromQuery] int position, [FromQuery] string? orderBy, [FromQuery] string? orderDir)
        {
            // ToDo: Add validation around orderBy
            if (!_validOrderDir.Contains(orderDir))
            {
                return BadRequest();
            }
            var orderRule = $"{orderBy ?? "title"} {orderDir ?? "asc"}";
            // Will be waiting on count before doing data
            var count = await _context.Books.CountAsync();
            pageSize = pageSize == 0 ? count : pageSize;
            var books = await _context.Books.OrderBy(orderRule).Skip(pageSize * position).Take(pageSize)
                .Include(b => b.BooksAuthors).ThenInclude(ba => ba.Author)
                .Include(b => b.Publisher)
                .Include(b => b.BookGenre)
                .ToListAsync();
            return new PaginatedResponse<ComplexBookRecord>(count, books.Select(b => b.ToComplexRecord()));
        }

        // GET: api/Books
        [HttpGet("filtered")]
        public async Task<ActionResult<PaginatedResponse<SimpleBookRecord>>> GetBooks([FromQuery] int pageSize, [FromQuery] int position, [FromQuery] BookFilter filter, [FromQuery] string? orderBy, [FromQuery] string? orderDir)
        {
            // ToDo: Add validation around orderBy
            if (!_validOrderDir.Contains(orderDir))
            {
                return BadRequest();
            }
            var orderRule = $"{orderBy ?? "title"} {orderDir ?? "asc"}";

            // ToDo: Use the join-tables to make this faster? Particularly on Authors as they aren't an index
            // Can dynamic link be used for sql injection?
            // Pagination is kind of bad here, query will be re-run each time
            // Should cache results?

            if(filter.ISBN!= null)
            {
                var book = await _context.Books.Where(b => b.ISBN == filter.ISBN && (filter.Title == null || b.Title.Contains(filter.Title))).ToListAsync();
                return new PaginatedResponse<SimpleBookRecord>(1, book.Select(b => b.ToSimpleRecord()));
            }
            else
            {
                var filteredBooks = await _context.Books.Where(b => (filter.Genre == null || b.Genre == filter.Genre)
                                                && (filter.PublisherId == null || b.PublisherId == filter.PublisherId)
                                                && (filter.AuthorId == null || b.BooksAuthors.Any(a => a.AuthorId == filter.AuthorId))
                                                && (filter.Title == null || b.Title.Contains(filter.Title)))
                                                    .OrderBy(orderRule)
                                                    .Select(b => new SimpleBookRecord(
                                                        b.BookId,
                                                        b.Title,
                                                        b.BooksAuthors.Select(ba => ba.Author.AuthorName).ToList(),
                                                        b.Genre,
                                                        (b.Publisher == null ? null : b.Publisher.PublisherName),
                                                        b.PublishDate,
                                                        b.ISBN)
                                                    )
                                                    .ToListAsync();
                var count = filteredBooks.Count();
                pageSize = pageSize == 0 ? count : pageSize;
                var books = filteredBooks.Skip(pageSize * position).Take(pageSize);
                return new PaginatedResponse<SimpleBookRecord>(count, books);
            }
        }

        // GET: api/Books/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ComplexBookRecord>> GetBook(string id)
        {
            var book = await _context.Books
                .Include(b => b.BooksAuthors).ThenInclude(ba => ba.Author)
                .Include(b => b.Publisher)
                .Include(b => b.BookGenre)
                .FirstOrDefaultAsync(b => b.BookId == id);

            if (book == null)
            {
                return NotFound();
            }

            return book.ToComplexRecord();
        }

        // PUT: api/Books/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutBook(string id, PutBook putBook)
        {
            if (id != putBook.BookId)
            {
                return BadRequest();
            }
            var book = await _context.Books.Include(x => x.BooksAuthors).FirstOrDefaultAsync(x => x.BookId == putBook.BookId);
            if (book == null)
            {
                return NotFound();
            }

            var bookAuthors = new List<BookAuthor>();
            // This logic and functionality shouldn't be here
            foreach(var authorName in putBook.AuthorNames)
            {
                var author = await _context.Authors.FirstOrDefaultAsync(x => x.AuthorName == authorName);

                if(author == null)
                {
                    author = new Author()
                    {
                        AuthorName = authorName,
                    };
                    _context.Authors.Add(author);
                    bookAuthors.Add(new BookAuthor() { Author = author });
                }
                else
                {
                    var bookAuthor = await _context.BooksAuthors.FindAsync(author.AuthorId, id);
                    if(bookAuthor == null)
                    {
                        bookAuthor = new BookAuthor() { Author = author };
                        bookAuthors.Add(bookAuthor);
                    }
                    bookAuthors.Add(bookAuthor);
                }
            }

            // Slow
            var toRemove = book.BooksAuthors.Where(x => !bookAuthors.Any(y => y.AuthorId == x.AuthorId));
            foreach (var bookAuthor in toRemove)
            {
                _context.BooksAuthors.Remove(bookAuthor);
            }


            var publisher = await _context.Publishers.FirstOrDefaultAsync(x => x.PublisherName == putBook.PublisherName);
            if (publisher == null)
            {
                publisher = new Publisher()
                {
                    PublisherName = putBook.PublisherName,
                };
                _context.Entry(publisher).State = EntityState.Added;
            }

            book.Title = putBook.Title;
            book.BooksAuthors = bookAuthors;
            book.Description = putBook.Description;
            book.Genre = string.IsNullOrWhiteSpace(putBook.Genre) ? null : putBook.Genre;
            book.Publisher = publisher;
            book.PublishDate = putBook.PublishDate;
            book.ISBN = string.IsNullOrWhiteSpace(putBook.ISBN) ? null : putBook.ISBN;

            _context.Entry(book).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                //log
                throw;
            }

            return NoContent();
        }

        // POST: api/Books
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<SimpleBookRecord>> PostBook(Book book)
        {
            // breaks rest "rules"?
            var genre = await _context.BookGenres.FindAsync(book.BookGenre?.Genre);
            if (genre != null)
            {
                book.Genre = genre.Genre;
                book.BookGenre = null;
            }

            var publisher = await _context.Publishers.FindAsync(book.Publisher?.PublisherId);
            if (publisher != null)
            {
                book.PublisherId = publisher.PublisherId;
                book.Publisher = null;
            }

            foreach (var bookAuthor in book.BooksAuthors)
            {
                var author = await _context.Authors.FindAsync(bookAuthor.Author?.AuthorId);
                if (author != null)
                {
                    bookAuthor.AuthorId = author.AuthorId;
                    bookAuthor.Author = null;
                }
            }

            _context.Books.Add(book);

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (BookExists(book.BookId))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetBook", new { id = book.BookId }, book.ToSimpleRecord());
        }

        // POST: api/Books/openlibrary
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost("/openlibrary")]
        public async Task<ActionResult<SimpleBookRecord>> PostBook(OpenLibraryBook book)
        {
            var publisher = await _context.Publishers.FirstOrDefaultAsync(p => p.PublisherName == book.PublisherName);
            if (publisher == null)
            {
                publisher = new Publisher()
                {
                    PublisherName = book.PublisherName,
                };
            }

            var bookAuthors = new List<BookAuthor>();
            var author = await _context.Authors.FirstOrDefaultAsync(p => p.AuthorName == book.AuthorName);
            if (author == null)
            {
                author = new Author()
                {
                    AuthorName = book.AuthorName,
                };
            }
            bookAuthors.Add(new BookAuthor() { Author = author });
            var newBook = new Book()
            {
                Title = book.Title,
                BooksAuthors = bookAuthors,
                ISBN = book.ISBN,
                Publisher = publisher,
                Origin = BookInfoOrigin.OpenLibrary
            };

            _context.Books.Add(newBook);

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (BookExists(newBook.BookId))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetBook", new { id = newBook.BookId }, newBook.ToSimpleRecord());
        }

        // DELETE: api/Books/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBook(string id)
        {
            var book = await _context.Books.FindAsync(id);
            if (book == null)
            {
                return NotFound();
            }

            _context.Books.Remove(book);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool BookExists(string id)
        {
            return _context.Books.Any(e => e.BookId == id);
        }
    }
}
