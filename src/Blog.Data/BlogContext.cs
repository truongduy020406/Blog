using Blog.Core.Domain.Content;
using Blog.Core.Domain.Identity;
using Blog.Core.Domain.Royalty;
using Blog.Core.SeedWorks.Constants;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using System.Reflection.Emit;

namespace Blog.Data
{
    public class BlogContext : IdentityDbContext<AppUser, AppRole, Guid>
    {
        public BlogContext(DbContextOptions options) : base(options)
        {
        }

        public DbSet<Post> Posts { get; set; }
        public DbSet<PostCategory> PostCategories { get; set; }
        public DbSet<PostTag> PostTags { get; set; }
        public DbSet<Tag> Tags { get; set; }
        public DbSet<PostActivityLog> PostActivityLogs { get; set; }
        public DbSet<Series> Series { get; set; }
        public DbSet<PostInSeries> PostInSeries { get; set; }
        public DbSet<Transaction> Transactions { get; set; }

        public DbSet<Question> Questions { get; set; }
        public DbSet<Answer> Answers { get; set; }


        protected override void OnModelCreating(ModelBuilder builder)
        {
            builder.Entity<IdentityUserClaim<Guid>>().ToTable("AppUserClaims").HasKey(x => x.Id);

            builder.Entity<IdentityRoleClaim<Guid>>().ToTable("AppRoleClaims")
            .HasKey(x => x.Id);

            builder.Entity<IdentityUserLogin<Guid>>().ToTable("AppUserLogins").HasKey(x => x.UserId);

            builder.Entity<IdentityUserRole<Guid>>().ToTable("AppUserRoles")
            .HasKey(x => new { x.RoleId, x.UserId });

            builder.Entity<IdentityUserToken<Guid>>().ToTable("AppUserTokens")
               .HasKey(x => new { x.UserId });
            builder.Entity<Answer>()
           .HasOne(a => a.ParentAnswer)
           .WithMany(a => a.Replies)
           .HasForeignKey(a => a.ParentAnswerId)
           .OnDelete(DeleteBehavior.Restrict);
        }

        public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            var entries = ChangeTracker
               .Entries()
               .Where(e => e.State == EntityState.Added);

            foreach (var entityEntry in entries)
            {
                var dateCreatedProp = entityEntry.Entity.GetType().GetProperty(SystemConsts.DateCreatedField);
                if (entityEntry.State == EntityState.Added
                    && dateCreatedProp != null)
                {
                    dateCreatedProp.SetValue(entityEntry.Entity, DateTime.Now);
                }
            }
            return base.SaveChangesAsync(cancellationToken);
        }

    }
}
