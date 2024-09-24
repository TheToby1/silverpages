using System.Net;
using SilverPages.Server.Model.NewFolder;

namespace SilverPages.Server.Model
{
    public record SimpleAuthorRecord(string AuthorId, string? AuthorName);

    public class Author
    {
        public string AuthorId { get; set; }
        // Todo: Should be case insensitive
        public string? AuthorName { get; set; }
        public string? Biography { get; set; }

        public ICollection<BookAuthor> BooksAuthors { get; set; } = [];

        public Author()
        {
            AuthorId = Guid.NewGuid().ToString();
        }

        public SimpleAuthorRecord ToSimpleRecord()
        {
            return new SimpleAuthorRecord(AuthorId, AuthorName);
        }
    }
}
