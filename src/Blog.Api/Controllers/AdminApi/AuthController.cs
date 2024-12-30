using Blog.Api.Services;
using Blog.Core.Domain.Identity;
using Blog.Core.Model.Auth;
using Blog.Core.Model.System;
using Blog.Core.SeedWorks.Constants;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;
using System.Reflection;
using System.Security.Claims;
using System.Text.Json;
using Blog.Api.Extensions;
using Microsoft.AspNetCore.Authorization;
using Blog.Core.Model.Client;
using Blog.Core.ConfigOption;
using Microsoft.Extensions.Options;

namespace TeduBlog.Api.Controllers.AdminApi
{
       
}
[Route("api/admin/auth")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly UserManager<AppUser> _userManager;
    private readonly SignInManager<AppUser> _signInManager;
    private readonly ITokenService _tokenService;
    private readonly RoleManager<AppRole> _roleManager;
    private readonly IEmailSender _emailSender;
    private readonly SystemConfig _systemConfig;
    public AuthController(UserManager<AppUser> userManager,
        SignInManager<AppUser> signInManager,
        ITokenService tokenService,
        RoleManager<AppRole> roleManager,
        IEmailSender emailSender, 
        IOptions<SystemConfig> systemConfig
        )
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _tokenService = tokenService;
        _roleManager = roleManager;
        _emailSender = emailSender;
        _systemConfig = systemConfig.Value;
    }


    [HttpPost("register")]
    [AllowAnonymous]
    public async Task<IActionResult> Register([FromBody] RegisterViewModel model)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var result = await _userManager.CreateAsync(new AppUser
        {
            FirstName = model.FirstName,
            LastName = model.LastName,
            Email = model.Email,
            UserName = model.Email,
            IsActive = true,
            EmailConfirmed = true
        }, model.Password);


        if (result.Succeeded)
        {
            var user = await _userManager.FindByNameAsync(model.Email);
            var roleResult = await _userManager.AddToRoleAsync(user, "User");
            var code = await _userManager.GeneratePasswordResetTokenAsync(user);


            var callbackUrlConfirm = Url.LoginCallbacklink(user.Id.ToString(), code, Request.Scheme);

            var callbackUrlCancel = Url.RegisterCancleCallbacklink(user.Id.ToString(), null, Request.Scheme);
            // Tạo nội dung email HTML
            var emailContent = $@"
                 <html>
                 <body>
                     <p>Hi {user.FirstName},</p>
                     <p>You comfirm  email. Please click the button below to reset your password:</p>
                     <br>
                     <a href='{callbackUrlConfirm}' style='padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;'>Reset Password</a>
                     <br><br>
                     <a href='{callbackUrlCancel}' style='padding: 10px 20px; background-color: #f44336; color: white; text-decoration: none; border-radius: 5px;'>Cancel</a>
                 </body>
                 </html>";
            // Gửi email với nội dung HTML
            var emailData = new EmailData
            {
                ToEmail = user.Email ?? string.Empty,
                Subject = $"{_systemConfig.AppName} - Password Reset",
                Content = emailContent // Đảm bảo nội dung là HTML
            };

            await _emailSender.SendEmail(emailData);

            await _signInManager.SignInAsync(user, true);
            return Ok(new { message = "Registration successful" });
        }

        return BadRequest(ModelState);
    }

    [HttpPost]
    public async Task<ActionResult<AuthenticatedResult>> Login([FromBody] LoginRequest request)
    {
        //Authentication
        if (request == null)
        {
            return BadRequest("Invalid request");
        }

        var user = await _userManager.FindByNameAsync(request.UserName);
        if (user == null || user.IsActive == false || user.LockoutEnabled)
        {
            return BadRequest("Đăng nhập không đúng");
        }

        var result = await _signInManager.PasswordSignInAsync(request.UserName, request.Password, false, true);
        if (!result.Succeeded)
        {
            return BadRequest("Đăng nhập không đúng");
        }

        //Authorization
        var roles = await _userManager.GetRolesAsync(user);
        var permissions = await this.GetPermissionsByUserIdAsync(user.Id.ToString());
        var claims = new[]
        {
                    new Claim(JwtRegisteredClaimNames.Email, user.Email),
                    new Claim(UserClaims.Id, user.Id.ToString()),
                    new Claim(ClaimTypes.NameIdentifier, user.UserName),
                    new Claim(ClaimTypes.Name, user.UserName),
                    new Claim(UserClaims.FirstName, user.FirstName),
                    new Claim(UserClaims.Roles, string.Join(";", roles)),
                    new Claim(UserClaims.Permissions, JsonSerializer.Serialize(permissions)),
                    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };
        var accessToken = _tokenService.GenerateAccessToken(claims);
        var refreshToken = _tokenService.GenerateRefreshToken();

        user.RefreshToken = refreshToken;
        user.RefreshTokenExpiryTime = DateTime.Now.AddDays(30);
        await _userManager.UpdateAsync(user);

        return Ok(new AuthenticatedResult()
        {
            fullName = user.GetFullName(),
            Token = accessToken,
            RefreshToken = refreshToken
        });
    }
    [HttpPost("forgot-password")]
    public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordModel model)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var user = await _userManager.FindByEmailAsync(model.Email);
        if (user == null)
        {
            return NotFound(new { message = "Cannot find any user matching this email." });
        }

        var code = await _userManager.GeneratePasswordResetTokenAsync(user);
        var callbackUrl = Url.Action(
            "ResetPassword",
            "Account",
            new { userId = user.Id, code },
            protocol: HttpContext.Request.Scheme
        );

        var emailData = new EmailData
        {
            ToEmail = user.Email ?? string.Empty,
            Subject = $"{_systemConfig.AppName} - Password Reset",
            Content = $"Hello {user.FirstName},\n\nYou requested a password reset. Please click the link below to reset your password:\n\n{callbackUrl}\n\nBest regards,\n{_systemConfig.AppName} Team"
        };

        await _emailSender.SendEmail(emailData);

        return Ok(new { message = "A password reset email has been sent. Please check your email." });
    }


    [HttpPost("reset-password")]
    [AllowAnonymous]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordModel model)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var user = await _userManager.FindByEmailAsync(model.Email);
        if (user == null)
        {
            // Don't reveal that the user does not exist
            return BadRequest(new { message = "Email is not existed" });
        }

        var result = await _userManager.ResetPasswordAsync(user, model.Code, model.Password);
        if (result.Succeeded)
        {
            return Ok(new { message = "Reset password successful" });
        }

        // If resetting password failed, return the errors
        return BadRequest(new { message = "Failed to reset password", errors = result.Errors });
    }

    private async Task<List<string>> GetPermissionsByUserIdAsync(string userId)
    {
        var user = await _userManager.FindByIdAsync(userId);
        var roles = await _userManager.GetRolesAsync(user);
        var permissions = new List<string>();

        var allPermissions = new List<RoleClaimsDto>();
        if (roles.Contains(Roles.Admin))
        {
            var types = typeof(Permissions).GetTypeInfo().DeclaredNestedTypes;
            foreach (var type in types)
            {
                allPermissions.GetPermissions(type);
            }
            permissions.AddRange(allPermissions.Select(x => x.Value));
        }
        else
        {
            var typePosts = typeof(Permissions.Posts).GetTypeInfo().DeclaredFields;
            foreach (var field in typePosts)
            {
                permissions.Add((string)field.GetValue(null));
            }

            // Lấy quyền CRUD cho Series
            var typeSeries = typeof(Permissions.Series).GetTypeInfo().DeclaredFields;
            foreach (var field in typeSeries)
            {
                permissions.Add((string)field.GetValue(null));
            }
            permissions.AddRange(allPermissions.Select(x => x.Value));
        }
        return permissions.Distinct().ToList();
    }
}