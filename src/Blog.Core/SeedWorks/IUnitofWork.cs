using Blog.Core.Repository;
using System;


namespace Blog.Core.SeedWorks
{
    public interface IUnitofWork
    {
        IPostRepository Posts { get; }
        ITagRepository Tags { get; }
        IPostCategoryRepository PostCategories { get; }
        ISeriesRepository Series { get; }
        ITransactionRepository Transactions { get; }
        IUserRepository Users { get; }

        IQuestionRepository Question { get; }
        IAnswerRepository Answer { get; }
        Task<int> CompleteAsync();

    }
}
