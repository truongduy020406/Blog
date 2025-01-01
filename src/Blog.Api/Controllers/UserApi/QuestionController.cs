using Blog.Api.Extensions;
using Blog.Core.ConfigOption;
using Blog.Core.Domain.Content;
using Blog.Core.Domain.Identity;
using Blog.Core.Helpers;
using Blog.Core.Model;
using Blog.Core.Model.Client;
using Blog.Core.Model.Content;
using Blog.Core.SeedWorks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using static Microsoft.Extensions.Logging.EventSource.LoggingEventSource;

namespace Blog.Api.Controllers.UserApi
{
    [Route("api/[controller]")]
    [ApiController]
    public class QuestionController : ControllerBase
    {
        private readonly IUnitofWork _unitOfWork;
        private readonly SignInManager<AppUser> _signInManager;
        private readonly UserManager<AppUser> _userManager;
        private readonly SystemConfig _config;

        public QuestionController(IUnitofWork unitOfWork,
            SignInManager<AppUser> signInManager,
            UserManager<AppUser> userManager,
            IOptions<SystemConfig> systemConfig)
        {
            _unitOfWork = unitOfWork;
            _signInManager = signInManager;
            _userManager = userManager;
            _config = systemConfig.Value;
        }

        [HttpPost("/profile/question/create")]
        public async Task<IActionResult> Createquestion([FromBody] QuestionDTO model)
        {
            if (!ModelState.IsValid)
                return BadRequest(new { error = "Invalid model", details = ModelState });

            var user = await GetCurrentUser();
            if (user == null)
                return Unauthorized(new { error = "User not found or not authenticated" });

            var questionId = Guid.NewGuid();

            var question = new Question()
            {
                QuestionId = questionId,
                UserId = user.Id,
                Title = model.Title,
                Content = model.Content,
            };
            question.UserName = user.GetFullName();
            _unitOfWork.Question.Add(question);

            int result = await _unitOfWork.CompleteAsync();
            if (result > 0)
            {
                return Ok(new
                {
                    message = "Question is created successfully",
                    questionId = questionId
                });
            }

            return BadRequest(new { error = "Failed to create post" });
        }


        [HttpGet]
        [Route("paging")]
        public async Task<ActionResult<PagedResult<QuestionDTO>>> GetQuestionPaging(string? keyword, Guid? categoryId,
        int pageIndex, int pageSize = 10)
        {
            var result = await _unitOfWork.Question.GetAllPaging(keyword, categoryId, pageIndex, pageSize);
            return Ok(result);
        }

        [HttpGet]
        [Route("user/question")]
        public async Task<ActionResult<PagedResult<QuestionDTO>>> GetQuestionByIdUserPaging(string? keyword, Guid? categoryId,
       int pageIndex, int pageSize = 10)
        {
            var result = await _unitOfWork.Question.GetAllPaging(keyword, User.GetUserId(), pageIndex, pageSize);
            return Ok(result);
        }
        private async Task<AppUser> GetCurrentUser()
        {
            var userId = User.GetUserId();
            return await _userManager.FindByIdAsync(userId.ToString());
        }

        [HttpGet]
        [Route("{id}")]

        public async Task<ActionResult<QuestionDTO>> GetQuestionById(Guid id)
        {
            var Question = await _unitOfWork.Question.GetByIdAsync(id);
            
            if (Question == null)
            {
                return NotFound();
            }
            return Ok(Question);
        }

        [HttpGet]
        [Route("Latestquestion")]

        public async Task<ActionResult<QuestionDTO>> GetLatestquestion()
        {
            var result = await _unitOfWork.Question.GetLatestQuestionsAsync();
            return Ok(result);
        }

    }
}
