using static SilverPages.Server.Model.Book;

namespace SilverPages.Server.Model
{
    public class BookFilter
    {
        public string? AuthorId { get; set; }
        public string? Genre { get; set; }
        public string? PublisherId { get; set; }
        public string? ISBN { get; set; }
        public string? Title { get; set; }
    }
}
