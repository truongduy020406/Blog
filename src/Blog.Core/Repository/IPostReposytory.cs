using Blog.Core.Domain.Content;
using Blog.Core.Model;
using Blog.Core.Model.Content;
using Blog.Core.SeedWorks;


namespace Blog.Core.Repository
{
    public interface IPostRepository : IRepository<Post, Guid>
    {
        Task<List<Post>> GetPopularPostsAsync(int count);
        

        Task<PagedResult<PostInListDto>> GetPostsPagingAsync(string keyword, Guid? categoryId, int pageIndex = 1, int pageSize = 10);
    
        
    
    }
}
