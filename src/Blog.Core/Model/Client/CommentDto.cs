using AutoMapper;
using Blog.Core.Domain.Content;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Blog.Core.Model.Client
{
    public class CommentDto
    {
        public Guid Id { get; set; }
        public string Content { get; set; }
        public Guid? AuthorUserId { get; set; }
        public Guid? PostId { get; set; }
        public string? AuthorName { get; set; }
        public Guid? QuestionId { get; set; }
        public DateTime CreatedAt { get; set; }
        public List<CommentDto> Replies { get; set; } = new();

        public class AutoMapperProfiles : Profile
        {
            public AutoMapperProfiles()
            {
                // Create map from Question to QuestionDTO
                CreateMap<Comment, CommentDto>();
            }
        }
    }

}
