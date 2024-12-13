using Blog.Core.Domain.Content;
using Blog.Core.SeedWorks;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Blog.Core.Repository
{
    public interface ITagRepository : IRepository<Tag, Guid>
    {
       
    }
}
