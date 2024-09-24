using System.ComponentModel.DataAnnotations;

namespace SilverPages.Server.Model
{
    public record SimplePublisherRecord(string PublisherId, string? PublisherName);

    public class Publisher
    {
        public string? PublisherId { get; set; }
        public string? PublisherName { get; set; }

        public ICollection<Book> Books { get; set; } = [];

        public Publisher()
        {
            PublisherId = Guid.NewGuid().ToString();
        }

        public SimplePublisherRecord ToSimpleRecord()
        {
            return new SimplePublisherRecord(PublisherId, PublisherName);
        }
    }
}
