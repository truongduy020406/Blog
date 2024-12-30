using Microsoft.AspNetCore.Mvc;

namespace Blog.Api.Extensions
{
    public static class UrlHelperExtensions
    {
        public static string LoginCallbacklink(this IUrlHelper urlHelper, string userId, string code, string scheme)
        {
            return "http://localhost:4200/#/Auth/login?userId=" + userId + "&code=" + code;
        }
        public static string RegisterCancleCallbacklink(this IUrlHelper urlHelper, string userId, string code, string scheme)
        {
            return "http://localhost:4200/#/Auth/register?userId=" + userId + "&code=" + code;
        }
        public static string ResetPasswordCallbackLink(this IUrlHelper urlHelper, string userId, string code, string scheme)
        {
            return urlHelper.Action(
                action: nameof(AuthController.ResetPassword),
                controller: "Auth",
                values: new { userId, code },
                protocol: scheme);
        }
    }
}
