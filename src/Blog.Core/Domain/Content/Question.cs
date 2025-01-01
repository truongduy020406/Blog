using Blog.Core.Domain.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static Blog.Core.SeedWorks.Constants.Permissions;

namespace Blog.Core.Domain.Content
{
    public class Question
    {
        public Guid QuestionId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public string? UserName { get; set; }

        public Guid UserId { get; set; }

       
    }

}
