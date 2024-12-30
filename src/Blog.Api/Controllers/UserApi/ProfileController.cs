using Blog.Api.Extensions;
using Blog.Core.ConfigOption;
using Blog.Core.Domain.Content;
using Blog.Core.Domain.Identity;
using Blog.Core.Helpers;
using Blog.Core.Model.Client;
using Blog.Core.SeedWorks;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using System.Net;
using System.Text.Json;

namespace Blog.Api.Controllers.UserApi
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProfileController : ControllerBase
    {
        private readonly IUnitofWork _unitOfWork;
        private readonly SignInManager<AppUser> _signInManager;
        private readonly UserManager<AppUser> _userManager;
        private readonly SystemConfig _config;

        public ProfileController(IUnitofWork unitOfWork,
            SignInManager<AppUser> signInManager,
            UserManager<AppUser> userManager,
            IOptions<SystemConfig> systemConfig)
        {
            _unitOfWork = unitOfWork;
            _signInManager = signInManager;
            _userManager = userManager;
            _config = systemConfig.Value;
        }

        [HttpGet("/profile")]
        public async Task<IActionResult> GetProfile()
        {
            var user = await GetCurrentUser();
            if (user == null)
                return NotFound("User not found");

            return Ok(new ProfileViewModel()
            {
                Email = user.Email,
                FirstName = user.FirstName,
                LastName = user.LastName
            });
        }

        [HttpPut("/profile/edit")]
        public async Task<IActionResult> UpdateProfile([FromBody] ChangeProfileViewModel model)
        {
            var user = await GetCurrentUser();
            if (user == null)
                return NotFound("User not found");

            user.FirstName = model.FirstName;
            user.LastName = model.LastName;
            user.Email = model.Email;
            user.Avatar = model.Avatar;
            var result = await _userManager.UpdateAsync(user);

            if (!result.Succeeded)
                return BadRequest("Update profile failed");

            return Ok("Update profile successful");
        }

        [HttpPut("/profile/change-password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordViewModel model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var userProfile = await GetCurrentUser();
            if (userProfile == null)
                return NotFound("User not found");

            var isPasswordValid = await _userManager.CheckPasswordAsync(userProfile, model.OldPassword);
            if (!isPasswordValid)
                return BadRequest("Old password is not correct");

            var result = await _userManager.ChangePasswordAsync(userProfile, model.OldPassword, model.NewPassword);
            if (!result.Succeeded)
                return BadRequest(result.Errors);

            await _signInManager.RefreshSignInAsync(userProfile);
            return Ok("Change password successful");
        }

        [HttpPost("/profile/logout")]
        public async Task<IActionResult> Logout()
        {
            await _signInManager.SignOutAsync();
            await HttpContext.SignOutAsync();

            return Ok("Logout successful");
        }

        [HttpPost("/profile/posts/create")]
        public async Task<IActionResult> CreatePost([FromBody] CreatePostViewModel model, [FromForm] IFormFile thumbnail)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var user = await GetCurrentUser();
            var category = await _unitOfWork.PostCategories.GetByIdAsync(model.CategoryId);

            if (category == null)
                return NotFound("Category not found");

            var post = new Post()
            {
                Name = model.Title,
                CategoryName = category.Name,
                CategorySlug = category.Slug,
                Slug = TextHelper.ToUnsignedString(model.Title),
                CategoryId = model.CategoryId,
                Content = model.Content,
                SeoDescription = model.SeoDescription,
                Status = PostStatus.Draft,
                AuthorUserId = user.Id,
                AuthorName = user.GetFullName(),
                AuthorUserName = user.UserName,
                Description = model.Description
            };

            _unitOfWork.Posts.Add(post);

            if (thumbnail != null)
                await UploadThumbnail(thumbnail, post);

            int result = await _unitOfWork.CompleteAsync();
            if (result > 0)
                return Ok("Post is created successfully");

            return BadRequest("Create post failed");
        }

        [HttpGet("/profile/posts/list")]
        public async Task<IActionResult> ListPosts(string keyword, int page = 1)
        {
            var posts = await _unitOfWork.Posts.GetPostByUserPaging(keyword, User.GetUserId(), page, 12);
            return Ok(new ListPostByUserViewModel()
            {
                Posts = posts
            });
        }

        private async Task UploadThumbnail(IFormFile thumbnail, Post post)
        {
            using (var client = new HttpClient())
            {
                client.BaseAddress = new Uri(_config.BackendApiUrl);

                byte[] data;
                using (var br = new BinaryReader(thumbnail.OpenReadStream()))
                {
                    data = br.ReadBytes((int)thumbnail.OpenReadStream().Length);
                }

                var bytes = new ByteArrayContent(data);

                var multiContent = new MultipartFormDataContent
            {
                { bytes, "file", thumbnail.FileName }
            };

                var uploadResult = await client.PostAsync("api/admin/media?type=posts", multiContent);
                if (uploadResult.StatusCode != HttpStatusCode.OK)
                    throw new Exception(await uploadResult.Content.ReadAsStringAsync());

                var path = await uploadResult.Content.ReadAsStringAsync();
                var pathObj = JsonSerializer.Deserialize<UploadResponse>(path);
                post.Thumbnail = pathObj?.Path;
            }
        }

        private async Task<AppUser> GetCurrentUser()
        {
            var userId = User.GetUserId();
            return await _userManager.FindByIdAsync(userId.ToString());
        }
    }
}
