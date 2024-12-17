using AutoMapper;
using Blog.Core.Domain.Content;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Blog.Core.Model.Content
{
    public class SeriesDto : SeriesInListDto
    {
        [MaxLength(250)]
        public string? SeoDescription { get; set; }

        [MaxLength(250)]
        public string? Thumbnail { set; get; }

        public string? Content { get; set; }

        public class AutoMapperProfiles : Profile
        {
            public AutoMapperProfiles()
            {
                CreateMap<Series, SeriesDto>();
            }
        }
    }
}
