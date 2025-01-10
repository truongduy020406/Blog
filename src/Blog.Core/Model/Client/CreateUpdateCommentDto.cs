using AutoMapper;
using Blog.Core.Domain.Content;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Blog.Core.Model.Client
{
    public class CreateUpdateCommentDto
    {
 
        public string Content { get; set; }
        public Guid? ParentCommentId { get; set; }

        public Guid? PostId { get; set; }
        public Guid? QuestionId { get; set; }

        public class AutoMapperProfiles : Profile
        {
            public AutoMapperProfiles()
            {
                CreateMap<CreateUpdateCommentDto, Comment>();

            }
        }
    }

}
