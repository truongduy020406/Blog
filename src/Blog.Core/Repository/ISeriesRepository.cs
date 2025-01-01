using Blog.Core.Model.Content;
using Blog.Core.Model;
using Blog.Core.SeedWorks;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Blog.Core.Domain.Content;

namespace Blog.Core.Repository
{
    public interface ISeriesRepository : IRepository<Series, Guid>
    {
        Task<PagedResult<SeriesInListDto>> GetAllPaging(string? keyword, int pageIndex = 1, int pageSize = 10);
        Task<PagedResult<SeriesInListDto>> GetSeriesUserPaging(string? keyword, Guid userId, int pageIndex = 1, int pageSize = 10);

        Task AddPostToSeries(Guid seriesId, Guid postId, int sortOrder);
        Task RemovePostToSeries(Guid seriesId, Guid postId);
        Task<List<PostInListDto>> GetAllPostsInSeries(Guid seriesId);

        Task<bool> IsPostInSeries(Guid seriesId, Guid postId);
        Task<bool> HasPost(Guid seriesId);
    }
}
