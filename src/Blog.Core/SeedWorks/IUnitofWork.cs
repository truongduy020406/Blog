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
        Task<int> CompleteAsync();

    }
}
