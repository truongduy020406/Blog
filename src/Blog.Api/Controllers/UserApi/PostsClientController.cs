using Blog.Core.SeedWorks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Blog.Api.Controllers.UserApi
{
    [Route("api/[controller]")]
    [ApiController]
    public class PostsClientController : ControllerBase
    {
        private readonly IUnitofWork _unitOfWork;

        public PostsClientController(IUnitofWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }


        [HttpGet("{categorySlug}")]
        public async Task<IActionResult> ListByCategory([FromRoute] string categorySlug, [FromQuery] int page = 1)
        {
            var posts = await _unitOfWork.Posts.GetPostByCategoryPaging(categorySlug, page, 2);
            var category = await _unitOfWork.PostCategories.GetBySlug(categorySlug);

            if (category == null)
                return NotFound(new { Message = "Category not found" });

            return Ok(new
            {
                Posts = posts,
                Category = category
            });
        }

        [HttpGet("tag/{tagSlug}")]
        public async Task<IActionResult> ListByTag([FromRoute] string tagSlug, [FromQuery] int page = 1)
        {
            var pagedResult = await _unitOfWork.Posts.GetPostByTagPaging(tagSlug, page, 2);
            var tag = await _unitOfWork.Tags.GetBySlug(tagSlug);

            if (tag == null)
                return NotFound(new { Message = "Tag not found" });

            var posts = pagedResult.Results;

            var postsWithTagsTasks = posts.Select(post =>
            {
                return _unitOfWork.Posts.GetTagsByPostId(post.Id).ContinueWith(task =>
                {
                    var postTags = task.Result;
                    return new
                    {
                        post.Id,
                        post.Name,
                        post.Description,
                        post.Thumbnail,
                        post.DateCreated,
                        post.AuthorName,
                        post.ViewCount,
                        Tags = postTags 
                    };
                });
            });

            var postsWithTags = await Task.WhenAll(postsWithTagsTasks);

            return Ok(new
            {
                Posts = postsWithTags,
                Tag = tag
            });
        }




        [HttpGet("post/{slug}")]
        public async Task<IActionResult> Details([FromRoute] string slug)
        {
            var post = await _unitOfWork.Posts.GetBySlug(slug);

            if (post == null)
                return NotFound(new { Message = "Post not found" });

            var category = await _unitOfWork.PostCategories.GetBySlug(post.CategorySlug);
            var tags = await _unitOfWork.Posts.GetTagObjectsByPostId(post.Id);

            return Ok(new
            {
                Post = post,
                Category = category,
                Tags = tags
            });
        }
    }
}
