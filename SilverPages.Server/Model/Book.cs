using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;
using SilverPages.Server.Model.NewFolder;
using static SilverPages.Server.Model.Book;

namespace SilverPages.Server.Model
{
    public record SimpleBookRecord(string BookId, string? Title, ICollection<string?> Authors, string? Genre, string? Publisher, DateOnly PublishDate, string? ISBN);
    public record ComplexBookRecord(string BookId, string? Title, ICollection<SimpleAuthorRecord?> Authors, string? Description, string? Genre, SimplePublisherRecord? Publisher, DateOnly PublishDate, string? ISBN );

    public class Book
    {
        public enum BookInfoOrigin
        {
            Local,
            OpenLibrary
        }

        public string BookId { get; set; }
        [Required]
        public string? Title { get; set; }
        public ICollection<BookAuthor> BooksAuthors { get; set; } = [];
        // Could get long in theory, make sure not to include in all queries and
        // could store as file in the future if it was a problem
        public string? Description { get; set; }

        public string? Genre { get; set; }
        [ForeignKey("Genre")]
        public BookGenre? BookGenre { get; set; }

        public string? PublisherId { get; set; }
        [ForeignKey("PublisherId")]
        public Publisher? Publisher { get; set; }
        public DateOnly PublishDate { get; set; }
        public string? ISBN { get; set; }
        public BookInfoOrigin Origin { get; set; }

        public Book()
        {
            BookId = Guid.NewGuid().ToString();
        }

        public SimpleBookRecord ToSimpleRecord()
        {
            return new SimpleBookRecord(BookId, Title, BooksAuthors.Select(ba => ba.Author?.AuthorName).ToList(), BookGenre?.Genre, Publisher?.PublisherName, PublishDate, ISBN);
        }

        public ComplexBookRecord ToComplexRecord()
        {
            return new ComplexBookRecord(BookId, Title, BooksAuthors.Select(ba => ba.Author?.ToSimpleRecord()).ToList(), Description, BookGenre?.Genre, Publisher?.ToSimpleRecord(), PublishDate, ISBN);
        }
    }

    public class PutBook()
    {
        public string? BookId { get; set; }
        public string? Title { get; set; }
        public ICollection<string> AuthorNames { get; set; } = [];
        // Could get long in theory, make sure not to include in all queries and
        // could store as file in the future if it was a problem
        public string? Description { get; set; }
        public string? Genre { get; set; }
        public string? PublisherName { get; set; }
        public DateOnly PublishDate { get; set; }
        public string? ISBN { get; set; }
        public BookInfoOrigin Origin { get; set; }
    }

    public class OpenLibraryBook()
    {
        public string? Title { get; set; }
        public string? AuthorName { get; set; }
        public string? PublisherName { get; set; }
        public string? ISBN { get; set; }
    }
}
