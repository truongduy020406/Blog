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
    public class CreateLikeDTO
    {

        public Guid? PostId { get; set; }

        public Guid? QuestionId { get; set; }

        public DateTime? LikeAt { get; set; } = DateTime.UtcNow;

        public class AutoMapperProfiles : Profile
        {
            public AutoMapperProfiles()
            {
                // Create map from Question to QuestionDTO
                CreateMap<CreateLikeDTO, Like>();
            }
        }
    }
}
