using AutoMapper;
using Blog.Core.Domain.Content;
using Blog.Core.Model.Content;
using Blog.Core.Model;
using Blog.Core.SeedWorks;
using Blog.Data.SeedWorks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Blog.Api.Extensions;
using Blog.Core.Domain.Identity;
using Microsoft.AspNetCore.Identity;
using static Blog.Core.SeedWorks.Constants.Permissions;
using Blog.Core.Helpers;

namespace Blog.Api.Controllers.AdminApi
{
    [Route("api/admin/post")]
    public class PostController : ControllerBase
    {
        private readonly IUnitofWork _unitOfWork;
        private readonly UserManager<AppUser> _userManager;
        private readonly IMapper _mapper;
        public PostController(IUnitofWork unitOfWork, IMapper mapper, UserManager<AppUser> userManager)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _userManager = userManager;
        }

        [HttpPost]
        public async Task<IActionResult> CreatePost([FromBody] CreateUpdatePostRequest request)
        {
            if (await _unitOfWork.Posts.IsSlugAlreadyExisted(request.Slug))
            {
                return BadRequest("Đã tồn tại slug");
            }
            var post = _mapper.Map<CreateUpdatePostRequest, Post>(request);
            var postId = Guid.NewGuid();
            var category = await _unitOfWork.PostCategories.GetByIdAsync(request.CategoryId);
            post.Id = postId;
            post.CategoryName = category.Name;
            post.CategorySlug = category.Slug;

            var userId = User.GetUserId();
            var user = await _userManager.FindByIdAsync(userId.ToString());
            post.AuthorUserId = userId;
            post.AuthorName = user.GetFullName();
            post.AuthorUserName = user.UserName;
            _unitOfWork.Posts.Add(post);

            //Process tag
            if (request.Tags != null && request.Tags.Length > 0)
            {
                foreach (var tagName in request.Tags)
                {
                    var tagSlug = TextHelper.ToUnsignedString(tagName);
                    var tag = await _unitOfWork.Tags.GetBySlug(tagSlug);
                    Guid tagId;
                    if (tag == null)
                    {
                        tagId = Guid.NewGuid();
                        _unitOfWork.Tags.Add(new Tag() { Id = tagId, Name = tagName, Slug = tagSlug });

                    }
                    else
                    {
                        tagId = tag.Id;
                    }
                    await _unitOfWork.Posts.AddTagToPost(postId, tagId);
                }
            }

            var result = await _unitOfWork.CompleteAsync();
            return result > 0 ? Ok() : BadRequest();
        }

        [HttpPut]
        [Authorize(Posts.Edit)]
        public async Task<IActionResult> UpdatePost(Guid id, [FromBody] CreateUpdatePostRequest request)
        {
            if (await _unitOfWork.Posts.IsSlugAlreadyExisted(request.Slug, id))
            {
                return BadRequest("Đã tồn tại slug");
            }
            var post = await _unitOfWork.Posts.GetByIdAsync(id);
            if (post == null)
            {
                return NotFound();
            }
            if (post.CategoryId != request.CategoryId)
            {
                var category = await _unitOfWork.PostCategories.GetByIdAsync(request.CategoryId);
                post.CategoryName = category.Name;
                post.CategorySlug = category.Slug;
            }

            _mapper.Map(request, post);

            //Process tag
            if (request.Tags != null && request.Tags.Length > 0)
            {
                foreach (var tagName in request.Tags)
                {
                    var tagSlug = TextHelper.ToUnsignedString(tagName);
                    var tag = await _unitOfWork.Tags.GetBySlug(tagSlug);
                    Guid tagId;
                    if (tag == null)
                    {
                        tagId = Guid.NewGuid();
                        _unitOfWork.Tags.Add(new Tag() { Id = tagId, Name = tagName, Slug = tagSlug });
                        await _unitOfWork.Posts.AddTagToPost(id, tagId);

                    }
                }
            }
            await _unitOfWork.CompleteAsync();

            return Ok();
        }

        [HttpDelete]
        [Authorize(Posts.Delete)]
        public async Task<IActionResult> DeletePosts([FromQuery] Guid[] ids)
        {
            foreach (var id in ids)
            {
                var post = await _unitOfWork.Posts.GetByIdAsync(id);
                if (post == null)
                {
                    return NotFound();
                }
                _unitOfWork.Posts.Remove(post);
            }
            var result = await _unitOfWork.CompleteAsync();
            return result > 0 ? Ok() : BadRequest();
        }

        [HttpGet]
        [Route("{id}")]
 
        public async Task<ActionResult<PostDTO>> GetPostById(Guid id)
        {
            var post = await _unitOfWork.Posts.GetByIdAsync(id);
            if (post == null)
            {
                return NotFound();
            }
            return Ok(post);
        }

        [HttpGet]
        [Route("paging")]
        public async Task<ActionResult<PagedResult<PostInListDto>>> GetPostsPaging(string? keyword, Guid? categoryId,
            int pageIndex, int pageSize = 10)
        {
            var result = await _unitOfWork.Posts.GetAllPaging(keyword, categoryId, pageIndex, pageSize);
            return Ok(result);
        }

        [HttpGet]
        [Route("series-belong/{postId}")]
        public async Task<ActionResult<List<SeriesInListDto>>> GetSeriesBelong(Guid postId)
        {
            var result = await _unitOfWork.Posts.GetAllSeries(postId);
            return Ok(result);
        }

        [HttpGet("approve/{id}")]
        public async Task<IActionResult> ApprovePost(Guid id)
        {
            await _unitOfWork.Posts.Approve(id, User.GetUserId());
            await _unitOfWork.CompleteAsync();
            return Ok();
        }

        [HttpGet("approval-submit/{id}")]
        public async Task<IActionResult> SendToApprove(Guid id)
        {
            await _unitOfWork.Posts.SendToApprove(id, User.GetUserId());
            await _unitOfWork.CompleteAsync();
            return Ok();
        }

        [HttpPost("return-back/{id}")]
        [Authorize(Posts.Approve)]
        public async Task<IActionResult> ReturnBack(Guid id, [FromBody] ReturnBackRequest model)
        {
            await _unitOfWork.Posts.ReturnBack(id, User.GetUserId(), model.Reason);
            await _unitOfWork.CompleteAsync();
            return Ok();
        }

        [HttpGet("return-reason/{id}")]
        public async Task<ActionResult<string>> GetReason(Guid id)
        {
            var note = await _unitOfWork.Posts.GetReturnReason(id);
            return Ok(note);
        }

        [HttpGet("activity-logs/{id}")]
        public async Task<ActionResult<List<PostActivityLogDto>>> GetActivityLogs(Guid id)
        {
            var logs = await _unitOfWork.Posts.GetActivityLogs(id);
            return Ok(logs);
        }

        [HttpGet("tags")]
        public async Task<ActionResult<List<string>>> GetAllTags()
        {
            var logs = await _unitOfWork.Posts.GetAllTags();
            return Ok(logs);
        }

        [HttpGet("tags/{postId}")]
        public async Task<ActionResult<List<string>>> GetPostTags(Guid postId)
        {
            var tagNames = await _unitOfWork.Posts.GetTagsByPostId(postId);
            return Ok(tagNames);
        }
    }
}
