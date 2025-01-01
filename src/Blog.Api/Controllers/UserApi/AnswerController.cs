using Blog.Api.Extensions;
using Blog.Core.ConfigOption;
using Blog.Core.Domain.Content;
using Blog.Core.Domain.Identity;
using Blog.Core.SeedWorks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace Blog.Api.Controllers.UserApi
{
    [Route("api/[controller]")]
    [ApiController]
    public class AnswerController : ControllerBase
    {
        private readonly IUnitofWork _unitOfWork;
        private readonly SignInManager<AppUser> _signInManager;
        private readonly UserManager<AppUser> _userManager;
        private readonly SystemConfig _config;

        public AnswerController(IUnitofWork unitOfWork,
            SignInManager<AppUser> signInManager,
            UserManager<AppUser> userManager,
            IOptions<SystemConfig> systemConfig)
        {
            _unitOfWork = unitOfWork;
            _signInManager = signInManager;
            _userManager = userManager;
            _config = systemConfig.Value;
        }


        [HttpPost("/profile/Answer/create")]
        public async Task<IActionResult> CreateAnswer([FromBody] Answer model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var user = await GetCurrentUser();


            var answer = new Answer()
            {
                Content = model.Content,
                QuestionId = model.QuestionId,
                CreatedAt = DateTime.Now,
                UserId = user.Id,
                ParentAnswerId = model.ParentAnswerId
            };


            _unitOfWork.Answer.Add(answer);



            int result = await _unitOfWork.CompleteAsync();
            if (result > 0)
                return Ok("Answer is created successfully");

            return BadRequest("Create answer failed");
        }

        private async Task<AppUser> GetCurrentUser()
        {
            var userId = User.GetUserId();
            return await _userManager.FindByIdAsync(userId.ToString());
        }
    }
}
