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
        public int QuestionId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.Now;

        public int UserId { get; set; }
        public AppUser? User { get; set; }

        // Navigation properties
        public ICollection<Answer>? Answers { get; set; }
        
    }
}
