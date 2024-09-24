using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SilverPages.Server.Model
{
    public class BookGenre
    {
        [Key]
        public string? Genre { get; set; }
        public ICollection<Book> Books { get; set; } = [];
    }
}
