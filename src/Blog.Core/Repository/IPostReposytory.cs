using Blog.Core.Domain.Content;
using Blog.Core.Model;
using Blog.Core.Model.Content;
using Blog.Core.SeedWorks;


namespace Blog.Core.Repository
{
    public interface IPostRepository : IRepository<Post, Guid>
    {
        Task<PagedResult<PostInListDto>> GetAllPaging(string? keyword, Guid? categoryId, int pageIndex = 1, int pageSize = 10);
        Task<bool> IsSlugAlreadyExisted(string slug, Guid? currentId = null);
        Task<List<SeriesInListDto>> GetAllSeries(Guid postId);
        Task Approve(Guid id, Guid currentUserId);
        Task SendToApprove(Guid id, Guid currentUserId);
        Task ReturnBack(Guid id, Guid currentUserId, string note);
        Task<string> GetReturnReason(Guid id);
        Task<bool> HasPublishInLast(Guid id);
        Task<List<PostActivityLogDto>> GetActivityLogs(Guid id);
        Task<List<Post>> GetListUnpaidPublishPosts(Guid userId);

        IEnumerable<Post> GetPopularPosts(int count);
        Task<List<PostInListDto>> GetLatestPublishPost(int top);

        Task<PagedResult<PostInListDto>> GetPostByCategoryPaging(string categorySlug, int pageIndex = 1, int pageSize = 10);

        Task<PostDTO> GetBySlug(string slug);

        Task<List<string>> GetAllTags();

        Task AddTagToPost(Guid postId, Guid tagId);

        Task<List<string>> GetTagsByPostId(Guid postId);

        Task<List<TagDto>> GetTagObjectsByPostId(Guid postId);

        Task<PagedResult<PostInListDto>> GetPostByTagPaging(string tagSlug, int pageIndex = 1, int pageSize = 10);
        Task<PagedResult<PostInListDto>> GetPostByUserPaging(string? keyword, Guid userId, int pageIndex = 1, int pageSize = 10);

    }
}
