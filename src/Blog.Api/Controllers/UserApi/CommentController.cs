using AutoMapper;
using Blog.Api.Extensions;
using Blog.Core.Domain.Content;
using Blog.Core.Domain.Identity;
using Blog.Core.Model.Client;
using Blog.Core.Model.Content;
using Blog.Core.SeedWorks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace Blog.Api.Controllers.UserApi
{
    [Route("api/[controller]")]
    [ApiController]
    public class CommentController : ControllerBase
    {
        private readonly IUnitofWork _unitOfWork;
        private readonly UserManager<AppUser> _userManager;
        private readonly IMapper _mapper;
        public CommentController(IUnitofWork unitOfWork, IMapper mapper, UserManager<AppUser> userManager)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _userManager = userManager;
        }

        [HttpPost]
        public async Task<IActionResult> CreateComment([FromBody] CreateUpdateCommentDto request)
        {
            // Map DTO to Entity
            var comment = _mapper.Map<CreateUpdateCommentDto, Comment>(request);
            // Check Parent Comment
            if (comment.ParentCommentId.HasValue)
            {
                var parentComment = await _unitOfWork.Comment.GetByIdAsync(comment.ParentCommentId.Value);
                if (parentComment == null)
                {
                    return BadRequest("Parent comment does not exist.");
                }
            }

            // Set additional properties
            var userId = User.GetUserId();
            var user = await _userManager.FindByIdAsync(userId.ToString());
            comment.AuthorUserId = userId;
            comment.AuthorName = user.GetFullName();
            comment.CreatedAt = DateTime.UtcNow;

            // Save to database
            _unitOfWork.Comment.Add(comment);
            var result = await _unitOfWork.CompleteAsync();

            return result > 0 ? Ok(comment) : BadRequest("Failed to create comment.");
        }


        /// <summary>
        /// Lấy danh sách comment theo PostId
        /// </summary>
        [HttpGet("post/{postId:guid}")]
        public async Task<IActionResult> GetCommentsByPostId(Guid postId)
        {
            try
            {
                var comments = await _unitOfWork.Comment.GetCommentsByPostIdAsync(postId);
                return Ok(comments);
            }
            catch (Exception ex)
            {
                // Log lỗi nếu cần
                return StatusCode(StatusCodes.Status500InternalServerError, new
                {
                    Message = "An error occurred while fetching comments for the post.",
                    Details = ex.Message
                });
            }
        }

        /// <summary>
        /// Lấy danh sách comment theo QuestionId
        /// </summary>
        [HttpGet("question/{questionId:guid}")]
        public async Task<IActionResult> GetCommentsByQuestionId(Guid questionId)
        {
            try
            {
                var comments = await _unitOfWork.Comment.GetCommentsByQuestionIdAsync(questionId);
                return Ok(comments);
            }
            catch (Exception ex)
            {
                // Log lỗi nếu cần
                return StatusCode(StatusCodes.Status500InternalServerError, new
                {
                    Message = "An error occurred while fetching comments for the question.",
                    Details = ex.Message
                });
            }
        }

    }
}
