using System.Net;
using Microsoft.EntityFrameworkCore;
using Mono.TextTemplating;

namespace SilverPages.Server.Model
{
    [PrimaryKey(nameof(SilverPagesUserId), nameof(ShelfName))]
    public class Shelf
    {
        public string? ShelfName { get; set; }
        public string? SilverPagesUserId { get; set; }
        public string? ShelfDescription { get; set; }

        public ICollection<BookItem> Books { get; set; } = [];
    }
}
