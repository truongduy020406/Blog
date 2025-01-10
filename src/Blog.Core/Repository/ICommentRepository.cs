using Blog.Core.Domain.Content;
using Blog.Core.Model.Client;
using Blog.Core.SeedWorks;


namespace Blog.Core.Repository
{
    public interface ICommentRepository: IRepository<Comment, Guid>
    {
        Task<IEnumerable<CommentDto>> GetCommentsByPostIdAsync(Guid postId);
        Task<IEnumerable<CommentDto>> GetCommentsByQuestionIdAsync(Guid questionId);
        Task UpdateAsync(CreateUpdateCommentDto comment);
    }
}
