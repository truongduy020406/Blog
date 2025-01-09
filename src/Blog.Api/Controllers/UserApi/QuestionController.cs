using AutoMapper;
using Blog.Api.Extensions;
using Blog.Core.ConfigOption;
using Blog.Core.Domain.Content;
using Blog.Core.Domain.Identity;
using Blog.Core.Helpers;
using Blog.Core.Model;
using Blog.Core.Model.Client;
using Blog.Core.Model.Content;
using Blog.Core.SeedWorks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using static Blog.Core.SeedWorks.Constants.Permissions;
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
        private readonly IMapper _mapper;
        public QuestionController(IUnitofWork unitOfWork,
            SignInManager<AppUser> signInManager,
            UserManager<AppUser> userManager,
            IOptions<SystemConfig> systemConfig,
            IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _signInManager = signInManager;
            _userManager = userManager;
            _config = systemConfig.Value;
            _mapper = mapper;
        }

        [HttpPost("/profile/question/create")]
        public async Task<IActionResult> Createquestion([FromBody] CreateorUpdateQuestion model)
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
                Title = model.Title,
                Content = model.Content,
                UserId = user.Id,
                UserName = user.GetFullName(),
            };
            
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

        [HttpPut("/profile/question/update")]
        public async Task<IActionResult> UpdateQuestion(Guid id, [FromBody] QuestionDTO request)
        {
            var question = await _unitOfWork.Question.GetByIdAsync(id);
            if (question == null)
            {
                return NotFound("Câu hỏi không tồn tại.");
            }

            question.Title = request.Title;
            question.Content = request.Content;


            await _unitOfWork.CompleteAsync();

            return Ok("Cập nhật câu hỏi thành công.");
        }

        [HttpDelete("/profile/question/delete")]
        public async Task<IActionResult> DeleteQuestion([FromQuery] Guid[] ids)
        {
            foreach (var id in ids)
            {
                var question = await _unitOfWork.Question.GetByIdAsync(id);
                if (question == null)
                {
                    return NotFound();
                }
                _unitOfWork.Question.Remove(question);
            }
            var result = await _unitOfWork.CompleteAsync();
            return result > 0 ? Ok() : BadRequest();
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
            var user = User.GetUserId();
            var result = await _unitOfWork.Question.GetQuestionByUserPaging(keyword, user, pageIndex, pageSize);
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
