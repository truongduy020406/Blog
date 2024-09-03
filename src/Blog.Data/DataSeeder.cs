using Blog.Core.Domain.Identity;
using Microsoft.AspNetCore.Identity;


namespace Blog.Data
{
    public class DataSeeder
    {
        public async Task SeedAsync(BlogContext context)
        {
            var passwordHasher = new PasswordHasher<AppUser>();
            var rootAdminRoleId = Guid.NewGuid();
            if (!context.Roles.Any())
            {
                await context.Roles.AddAsync(new AppRole()
                {
                    Id = rootAdminRoleId,
                    Name = "Admin",
                    NormalizedName = "ADMIN",
                    DisplayName = "Quản trị viên"
                });
                await context.SaveChangesAsync();


            }

            if (!context.Users.Any())
            {
                var userId = Guid.NewGuid();
                var user = new AppUser()
                {
                    Id = userId,
                    FirstName = "Duy",
                    LastName = "vo",
                    Email = "admin@gmail.com",
                    NormalizedEmail = "ADMIN@GMAIL.COM",
                    UserName = "admin",
                    NormalizedUserName = "admin",
                    IsActive = true,
                    SecurityStamp = Guid.NewGuid().ToString(),
                    LockoutEnabled = true,
                    DateCreated = DateTime.Now,
                };
                user.PasswordHash = passwordHasher.HashPassword(user, "admin123");
                await context.AddAsync(user);

                await context.UserRoles.AddAsync(new IdentityUserRole<Guid>()
                {
                    RoleId = rootAdminRoleId,
                    UserId = userId,
                });
                await context.SaveChangesAsync();
            }


            //if (!context.Tags.Any())
            //{
            //    var userId = Guid.NewGuid();

            //    await context.Tags.AddAsync(new Tag()
            //    {
            //        Id = userId,
            //        Name = " 123",
            //        Slug = "456"

            //    });
            //    await context.SaveChangesAsync();
            //}


        }

       
    }
}
