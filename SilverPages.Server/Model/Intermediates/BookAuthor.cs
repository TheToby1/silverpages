namespace SilverPages.Server.Model.NewFolder
{
    public class BookAuthor
    {
        public string? AuthorId { get; set; }
        public string? BookId { get; set; }

        public Book? Book { get; set; }
        public Author? Author { get; set; }
    }
}
