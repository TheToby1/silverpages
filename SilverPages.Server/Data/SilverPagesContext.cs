using System.Reflection.Metadata;
using Duende.IdentityServer.EntityFramework.Options;
using Microsoft.AspNetCore.ApiAuthorization.IdentityServer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.Extensions.Options;
using SilverPages.Server.Model;
using SilverPages.Server.Model.NewFolder;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;

namespace SilverPages.Server.Data
{
    public class SilverPagesContext : ApiAuthorizationDbContext<SilverPagesUser>
    {
        public SilverPagesContext(DbContextOptions options,
            IOptions<OperationalStoreOptions> operationalStoreOptions): base(options, operationalStoreOptions) 
        {
        }

        public DbSet<Publisher> Publishers { get; set; }
        public DbSet<Tag> Tags { get; set; }
        public DbSet<Author> Authors { get; set; }
        public DbSet<BookGenre> BookGenres { get; set; }
        public DbSet<Book> Books { get; set; }
        public DbSet<BookAuthor> BooksAuthors { get; set; }

        public DbSet<BookItem> BookItems { get; set; }
        public DbSet<Shelf> Shelves { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Book>()
                .Property(s => s.Origin)
                .HasConversion<string>();
            //modelBuilder.Entity<Book>()
            //    .HasOne<BookGenre>()
            //    .WithMany()
            //    .HasForeignKey(b => b.Genre);
            modelBuilder.Entity<Book>()
                .HasIndex(b => b.Title);
            modelBuilder.Entity<Book>()
                .HasIndex(b => b.Genre);
            modelBuilder.Entity<Book>()
                .HasIndex(b => b.PublishDate);
            modelBuilder.Entity<Book>()
                .HasIndex(b => b.PublisherId);
            modelBuilder.Entity<Book>()
                .HasIndex(b => b.ISBN)
                .IsUnique();

            modelBuilder.Entity<Book>()
                .HasMany(b => b.BooksAuthors)
                .WithOne(ba => ba.Book)
                .HasForeignKey(ba => ba.BookId);
            modelBuilder.Entity<Author>()
                .HasMany(c => c.BooksAuthors)
                .WithOne(ba => ba.Author)
                .HasForeignKey(ba => ba.AuthorId);
            modelBuilder.Entity<BookAuthor>()
                .HasKey(ba => new { ba.AuthorId, ba.BookId });

            modelBuilder.Entity<Author>()
                .HasIndex(a => a.AuthorName)
                .IsUnique();

            modelBuilder.Entity<Publisher>()
                .HasIndex(p => p.PublisherName)
                .IsUnique();

            modelBuilder.Entity<BookItem>()
                .HasOne<Shelf>()
                .WithMany()
                .HasForeignKey(b => new { b.SilverPagesUserId, b.ShelfName });
            modelBuilder.Entity<BookItem>()
                .HasMany<Tag>()
                .WithMany();
        }
        
    }
}
