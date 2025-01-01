

namespace Blog.Core.Model.Auth
{
    public class AuthenticatedResult
    {
        public string? fullName {  get; set; }
        public required string Token { get; set; }
        public required string RefreshToken { get; set; }
    }
}
