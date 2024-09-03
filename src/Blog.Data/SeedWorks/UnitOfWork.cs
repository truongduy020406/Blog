using AutoMapper;
using Blog.Core.Repository;
using Blog.Core.SeedWorks;
using Blog.Data.Repositorys;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Blog.Data.SeedWorks
{
    public class UnitOfWork : IUnitofWork
    {
        private readonly BlogContext _context;

        public UnitOfWork(BlogContext context , IMapper mapper)
        {
            _context = context;
            Posts = new PostRepository(context,mapper);
        }

        public IPostRepository Posts {  get; private set; }

        public Task<int> CompleteAsync()
        {
            return _context.SaveChangesAsync();
        }

        public void Dispose()
        {
            _context.Dispose();
        }
    }
}
