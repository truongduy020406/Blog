using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Blog.Core.Model.Client
{
    public class CreatePostViewModel
    {
        [Required(ErrorMessage = "Title is required")]
        public required string Title { get; set; }
        public string? Description { get; set; }
        public string? Content { get; set; }
        public string? ThumbnailImage { get; set; }
        public Guid CategoryId { get; set; }

        public IEnumerable<CategoryViewModel>? Categories { get; set; }

        public string? SeoDescription { get; set; }
    }

    public class CategoryViewModel
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
    }
}
