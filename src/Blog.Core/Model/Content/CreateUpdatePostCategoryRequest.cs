using AutoMapper;
using Blog.Core.Domain.Content;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Blog.Core.Model.Content
{
    public class CreateUpdatePostCategoryRequest
    {
        [MaxLength(250)]
        public required string Name { set; get; }

        [Column(TypeName = "varchar(250)")]
        public required string Slug { set; get; }
        public Guid? ParentId { set; get; }
        public bool IsActive { set; get; }
        public string? SeoKeywords { set; get; }
        public string? SeoDescription { set; get; }
        public int SortOrder { set; get; }
        public class AutoMapperProfiles : Profile
        {
            public AutoMapperProfiles()
            {
                CreateMap<CreateUpdatePostCategoryRequest, PostCategory>();
            }
        }
    }
}
