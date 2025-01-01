using Blog.Core.Domain.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static Blog.Core.SeedWorks.Constants.Permissions;

namespace Blog.Core.Domain.Content
{
    public class Answer
    {
        public Guid AnswerId { get; set; }
        public string Content { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.Now;

        public Guid QuestionId { get; set; }
        public Question? Question { get; set; }

        public Guid UserId { get; set; } 

        public Guid? ParentAnswerId { get; set; }
        public Answer? ParentAnswer { get; set; }
        public ICollection<Answer>? Replies { get; set; }
    }

}
