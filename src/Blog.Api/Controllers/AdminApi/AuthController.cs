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
    public AuthController(UserManager<AppUser> userManager,
        SignInManager<AppUser> signInManager,
        ITokenService tokenService,
        RoleManager<AppRole> roleManager)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _tokenService = tokenService;
        _roleManager = roleManager;
    }


    [HttpPost("register")]
    [AllowAnonymous]
    public async Task<IActionResult> Register([FromBody] RegsiterViewModel model)
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
            IsActive = true
        }, model.Password);

        if (result.Succeeded)
        {
            var user = await _userManager.FindByNameAsync(model.Email);
            var roleResult = await _userManager.AddToRoleAsync(user, "User");
            await _signInManager.SignInAsync(user, true);
            return Ok(new { message = "Registration successful" });
        }

        return BadRequest(ModelState);
    }

    [HttpPost]
    [AllowAnonymous]
    public async Task<ActionResult<AuthenticatedResult>> Login([FromBody] LoginRequest request)
    {
        if (request == null)
        {
            return BadRequest("Invalid request");
        }

        var user = await _userManager.FindByNameAsync(request.UserName);
        if (user == null || user.IsActive == false || user.LockoutEnabled)
        {
            return Unauthorized();
        }

        var result = await _signInManager.PasswordSignInAsync(request.UserName, request.Password, false, true);
        if (!result.Succeeded)
        {
            return Unauthorized();
        }

        var roles = await _userManager.GetRolesAsync(user);
        var permissions = await GetPermissionsByUserIdAsync(user.Id.ToString());
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
            Token = accessToken,
            RefreshToken = refreshToken
        });
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