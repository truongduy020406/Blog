using AutoMapper;
using Blog.Core.Domain.Content;
using Blog.Core.Model.Content;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Blog.Core.Model.Client
{
    public class QuestionDTO
    {
        public Guid? QuestionId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public Guid? UserId { get; set; }
        public DateTime? CreatedAt { get; set; } = DateTime.Now;
        public string? UserName { get; set; }
        public class AutoMapperProfiles : Profile
        {
            public AutoMapperProfiles()
            {
                CreateMap<Question, QuestionDTO>();
            }
        }
    }
}
