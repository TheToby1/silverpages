using System.Net;
using Microsoft.EntityFrameworkCore;

namespace SilverPages.Server.Model
{
    [PrimaryKey(nameof(SilverPagesUserId), nameof(TagLabel))]
    public class Tag
    {
        public string? TagLabel { get; set; }
        public string? SilverPagesUserId { get; set; }
    }
}
