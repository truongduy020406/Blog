using Blog.Core.Model.Client;

namespace Blog.Api.Services
{
    public interface IEmailSender
    {
        Task SendEmail(EmailData emailData);
    }
}
