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
            if (likeDTO.PostId == null && likeDTO.QuestionId == null)
            {
                return BadRequest("Either PostId or QuestionId must be provided.");
            }

            var like = _mapper.Map<Like>(likeDTO);

            var userId = User.GetUserId();
            var user = await _userManager.FindByIdAsync(userId.ToString());

            like.AuthorUserId = userId;
            like.AuthorName = user.GetFullName();
            like.LikeAt = DateTime.UtcNow;

            _unitOfWork.Like.Add(like);
            var result = await _unitOfWork.CompleteAsync();

            return result > 0 ? Ok(like) : BadRequest("Failed to create like.");
        }



        [HttpDelete]
        public async Task<IActionResult> RemoveLike([FromQuery] Guid postId)
        {
            var userId = User.GetUserId(); // Lấy UserId từ token hoặc context
            var like = await _unitOfWork.Like.GetByUserIdAndPostIdAsync(userId, postId);

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

        [HttpGet("status/post/{postId}")]
        public async Task<IActionResult> CheckUserLikeStatus(Guid postId)
        {
            var userId = User.GetUserId();

            // Kiểm tra trạng thái Like
            var existingLike = await _unitOfWork.Like.FindAsync(l => l.AuthorUserId == userId && l.PostId == postId);
            var liked = existingLike != null;

            return Ok(new { liked });
        }

    }
}
