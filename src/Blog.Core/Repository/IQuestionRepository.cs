using Blog.Core.Domain.Content;
using Blog.Core.Model.Content;
using Blog.Core.Model;
using Blog.Core.SeedWorks;
using Blog.Core.Model.Client;

namespace Blog.Core.Repository
{
    public interface IQuestionRepository :IRepository<Question, Guid>
    {
        Task<PagedResult<QuestionDTO>> GetAllPaging(string? keyword, Guid? categoryId, int pageIndex = 1, int pageSize = 10);
        Task<Question> GetQuestionByIdAsync(Guid questionId);
        Task<List<QuestionDTO>> GetLatestQuestionsAsync();
        Task<PagedResult<QuestionDTO>> GetQuestionByUserPaging(string keyword, Guid userId, int pageIndex = 1, int pageSize = 10);
        Task<bool> ExistsAsync(Guid id);
    }
}
