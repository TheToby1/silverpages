using Microsoft.AspNetCore.Identity;

namespace SilverPages.Server.Model
{
    public class SilverPagesUser : IdentityUser
    {
        public ICollection<Shelf> Shelves { get; set; } = [];
    }
}
