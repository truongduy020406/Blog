using AutoMapper;
using Blog.Api.Extensions;
using Blog.Core.Domain.Content;
using Blog.Core.Domain.Identity;
using Blog.Core.Model.Client;
using Blog.Core.SeedWorks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace Blog.Api.Controllers.UserApi
{
    [Route("api/[controller]")]
    [ApiController]
    public class LikeController : ControllerBase
    {
        private readonly IUnitofWork _unitOfWork;
        private readonly UserManager<AppUser> _userManager;
        private readonly IMapper _mapper;
        public LikeController(IUnitofWork unitOfWork, IMapper mapper, UserManager<AppUser> userManager)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _userManager = userManager;
        }

        [HttpPost]
        public async Task<IActionResult> CreateLike([FromBody] CreateLikeDTO likeDTO)
        {
            var like = _mapper.Map<Like>(likeDTO);

            
            var userId = User.GetUserId();
            var user = await _userManager.FindByIdAsync(userId.ToString());
            like.AuthorUserId = userId;
            like.AuthorName = user.GetFullName();
            like.LikeAt = DateTime.UtcNow;

            _unitOfWork.Like.Add(like);
            var result = await _unitOfWork.CompleteAsync();

            return result > 0 ? Ok(like) : BadRequest("Failed to create comment.");
        }


        [HttpDelete]
        public async Task<IActionResult> RemoveLike(Guid id)
        {
            var like = await _unitOfWork.Like.GetByIdAsync(id);

            // Kiểm tra xem Like có tồn tại hay không
            if (like == null)
            {
                return NotFound(new { message = "Like not found." });
            }

            _unitOfWork.Like.Remove(like);
            await _unitOfWork.CompleteAsync();

            return Ok(new { message = "Like removed successfully." });
        }

        [HttpGet("count/question/{questionId}")]
        public async Task<IActionResult> CountLikesForQuestion(Guid questionId)
        {
            // Đếm số lượng Like cho câu Question
            var count = await _unitOfWork.Like.CountAsync(like => like.QuestionId == questionId);

            return Ok(new { questionId, likeCount = count });
        }

        [HttpGet("count/post/{postId}")]
        public async Task<IActionResult> CountLikesForPost(Guid postId)
        {
            // Đếm số lượng Like cho bài Post
            var count = await _unitOfWork.Like.CountAsync(like => like.PostId == postId);

            return Ok(new { postId, likeCount = count });
        }
    }
}
