using Blog.Core.Domain.Content;
using Blog.Core.SeedWorks;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Blog.Core.Repository
{
    public interface IAnswerRepository: IRepository<Answer, Guid>
    {
        Task<IEnumerable<Answer>> GetAllAsync();
        Task<Answer> GetByIdAsync(Guid id);
    }
}
