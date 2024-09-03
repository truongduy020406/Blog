using Blog.Core.Repository;
using System;


namespace Blog.Core.SeedWorks
{
    public interface IUnitofWork
    {
        IPostRepository Posts { get; }
        Task<int> CompleteAsync();

    }
}
