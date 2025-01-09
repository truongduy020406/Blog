using AutoMapper;
using Blog.Core.Domain.Content;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Blog.Core.Model.Client
{
    public class CreateorUpdateQuestion
    {
        public string Title { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;

        public class AutoMapperProfiles : Profile
        {
            public AutoMapperProfiles()
            {
                // Map from Question to CreateorUpdateQuestion
                CreateMap<Question, CreateorUpdateQuestion>()
                    .ForMember(dest => dest.Title, opt => opt.MapFrom(src => src.Title))  // Explicitly map Title
                    .ForMember(dest => dest.Content, opt => opt.MapFrom(src => src.Content)); // Explicitly map Content
            }
        }
    }
}
