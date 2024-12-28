using AutoMapper;
using Blog.Core.Domain.Content;
using Blog.Core.Model.Content;
using Blog.Core.Model;
using Blog.Core.Repository;
using Blog.Data.SeedWorks;
using Microsoft.EntityFrameworkCore;
using static Blog.Core.SeedWorks.Constants.Permissions;

namespace Blog.Data.Repositorys
{
    public class SeriesRepository : RepositoryBase<Core.Domain.Content.Series, Guid>, ISeriesRepository
    {
        private readonly IMapper _mapper;
        public SeriesRepository(BlogContext context, IMapper mapper) : base(context)
        {
            _mapper = mapper;
        }

        public async Task AddPostToSeries(Guid seriesId, Guid postId, int sortOrder)
        {
            var postInSeries = await _context.PostInSeries.FirstOrDefaultAsync(x => x.PostId == postId && x.SeriesId == seriesId);
            if (postInSeries == null)
            {
                await _context.PostInSeries.AddAsync(new PostInSeries()
                {
                    SeriesId = seriesId,
                    PostId = postId,
                    DisplayOrder = sortOrder
                });
            }
        }
        public async Task<bool> HasPost(Guid seriesId)
        {
            return await _context.PostInSeries.AnyAsync(x => x.SeriesId == seriesId);
        }
        public async Task<PagedResult<SeriesInListDto>> GetAllPaging(string? keyword, int pageIndex = 1, int pageSize = 10)
        {
            var query = _context.Series.AsQueryable();
            if (!string.IsNullOrWhiteSpace(keyword))
            {
                query = query.Where(x => x.Name.Contains(keyword));
            }

            var totalRow = await query.CountAsync();

            query = query.OrderByDescending(x => x.DateCreated)
               .Skip((pageIndex - 1) * pageSize)
               .Take(pageSize);

            return new PagedResult<SeriesInListDto>
            {
                Results = await _mapper.ProjectTo<SeriesInListDto>(query).ToListAsync(),
                CurrentPage = pageIndex,
                RowCount = totalRow,
                PageSize = pageSize
            };
        }

        public async Task<List<PostInListDto>> GetAllPostsInSeries(Guid seriesId)
        {
            var query = from pis in _context.PostInSeries
                        join p in _context.Posts
                        on pis.PostId equals p.Id
                        where pis.SeriesId == seriesId
                        select new
                        {
                            Post = p,
                            DisplayOrder = pis.DisplayOrder
                        };

            var result = await query.ToListAsync();

            // Ánh xạ thủ công từ kết quả truy vấn sang PostInListDto
            var mappedPosts = result.Select(x => new PostInListDto
            {
                Id = x.Post.Id, 
                Name = x.Post.Name,
                Slug = x.Post.Slug,
                Description = x.Post.Description,
                Thumbnail = x.Post.Thumbnail,
                ViewCount = x.Post.ViewCount,
                DateCreated = x.Post.DateCreated,
                CategorySlug = x.Post.CategorySlug,
                CategoryName = x.Post.CategoryName,
                AuthorUserName = x.Post.AuthorUserName,
                AuthorName = x.Post.AuthorName,
                Status = x.Post.Status,
                IsPaid = x.Post.IsPaid,
                RoyaltyAmount = x.Post.RoyaltyAmount,
                PaidDate = x.Post.PaidDate,
                DisplayOrder = x.DisplayOrder // Thêm DisplayOrder từ PostInSeries
            }).ToList();

            return mappedPosts;
        }


        public async Task<bool> IsPostInSeries(Guid seriesId, Guid postId)
        {
            return await _context.PostInSeries.AnyAsync(x => x.SeriesId == seriesId && x.PostId == postId);
        }

        public async Task RemovePostToSeries(Guid seriesId, Guid postId)
        {
            var postInSeries = await _context.PostInSeries
                .FirstOrDefaultAsync(x => x.PostId == postId && x.SeriesId == seriesId);
            if (postInSeries != null)
            {
                _context.PostInSeries.Remove(postInSeries);
            }
        }

    }
}
