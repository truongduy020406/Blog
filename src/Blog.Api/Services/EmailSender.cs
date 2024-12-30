using Blog.Core.ConfigOption;
using Blog.Core.Model.Client;
using HandlebarsDotNet;
using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Options;
using MimeKit;

namespace Blog.Api.Services
{
    public class EmailSender : IEmailSender
    {
        private readonly EmailSettings _emailSettings;

        public EmailSender(IOptions<EmailSettings> emailSetting)
        {
            _emailSettings = emailSetting.Value;
        }

        public async Task SendEmail(EmailData emailData)
        {
            // Kiểm tra email nhận có hợp lệ không
            if (string.IsNullOrEmpty(emailData.ToEmail))
            {
                throw new ArgumentException("Recipient email address cannot be empty.");
            }

            var message = new MimeMessage();
            message.From.Add(new MailboxAddress("email", _emailSettings.from));
            message.To.Add(new MailboxAddress(emailData.ToEmail ?? string.Empty, emailData.ToEmail));
            message.Subject = emailData.Subject;

            var bodyBuilder = new BodyBuilder();
            bodyBuilder.HtmlBody = emailData.Content;
            message.Body = bodyBuilder.ToMessageBody();

            message.Body = bodyBuilder.ToMessageBody();

            // Kết nối tới SMTP server và gửi email
            using (var client = new SmtpClient())
            {
                try
                {
                    // Kết nối tới server SMTP với cổng và mã hóa thích hợp
                    await client.ConnectAsync(_emailSettings.SmtpServer, _emailSettings.SmtpPort ?? 587, SecureSocketOptions.StartTls);

                    // Xác thực người dùng
                    await client.AuthenticateAsync(_emailSettings.SmtpUsername, _emailSettings.SmtpPassword);

                    // Gửi email
                    await client.SendAsync(message);
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Error sending email: {ex.Message}");
                    throw;
                }
                finally
                {
                    // Ngắt kết nối sau khi gửi email
                    await client.DisconnectAsync(true);
                }
            }
        }
    }
}
