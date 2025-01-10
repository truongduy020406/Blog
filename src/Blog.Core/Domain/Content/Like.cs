using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Blog.Core.Domain.Content
{
    [Table("Like")]
    public class Like
    {
        [Key]
        public Guid Id { get; set; }

        public Guid AuthorUserId { get; set; }
        [MaxLength(500)]
        public string AuthorName { get; set; }
        public Guid? PostId { get; set; }

        public Guid? QuestionId { get; set; }

        public DateTime LikeAt { get; set; } = DateTime.UtcNow;
    }
}
