using System.Net;
using Microsoft.EntityFrameworkCore;

namespace SilverPages.Server.Model
{
    [PrimaryKey(nameof(SilverPagesUserId), nameof(BookId))]
    public class BookItem
    {
        public string? SilverPagesUserId { get; set; }
        public string? BookId { get; set; }
        public string? ShelfName { get; set; }
        public string? Note { get; set; }
        public ICollection<string> Tags { get; set; } = [];
    }
}
