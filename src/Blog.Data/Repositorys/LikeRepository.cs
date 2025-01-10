using AutoMapper;
using Blog.Core.Domain.Content;
using Blog.Core.Domain.Identity;
using Blog.Core.Repository;
using Blog.Data.SeedWorks;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Blog.Data.Repositorys
{
    public class LikeRepository : RepositoryBase<Like, Guid>, ILikeRepository
    {
        private readonly IMapper _mapper;
        private readonly UserManager<AppUser> _userManager;
        public LikeRepository(BlogContext context, IMapper mapper,
           UserManager<AppUser> userManager) : base(context)
        {
            _mapper = mapper;
            _userManager = userManager;
        }

        public async Task<int> CountAsync(Expression<Func<Like, bool>> predicate)
        {
            return await _context.Likes.CountAsync(predicate);
        }


    }
}
