using AutoMapper;
using Blog.Core.Domain.Identity;
using Blog.Core.Repository;
using Blog.Core.SeedWorks;
using Blog.Data.Repositorys;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static Blog.Core.SeedWorks.Constants.Permissions;

namespace Blog.Data.SeedWorks
{
    public class UnitOfWork : IUnitofWork
    {
        private readonly BlogContext _context;

        public UnitOfWork(BlogContext context, IMapper mapper, UserManager<AppUser> userManager)
        {
            _context = context;
            Posts = new PostRepository(context, mapper, userManager);
            PostCategories = new PostCategoryRepository(context, mapper);
            Series = new SeriesRepository(context, mapper);

        }
        public IPostRepository Posts { get; private set; }
        public IPostCategoryRepository PostCategories { get; private set; }
        public ISeriesRepository Series { get; private set; }

        public ITagRepository Tags {  get; private set; }

        public async Task<int> CompleteAsync()
        {
            return await _context.SaveChangesAsync();
        }

        public void Dispose()
        {
            _context.Dispose();
        }
    }
}
