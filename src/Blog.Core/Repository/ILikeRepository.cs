using Blog.Core.Domain.Content;
using Blog.Core.SeedWorks;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Blog.Core.Repository
{
    public interface ILikeRepository : IRepository<Like, Guid>
    {
        Task<int> CountAsync(Expression<Func<Like, bool>> predicate);
        Task<Like> FindAsync(Expression<Func<Like, bool>> predicate);
        Task<Like> GetByUserIdAndPostIdAsync(Guid userId, Guid postId);




    }

}
