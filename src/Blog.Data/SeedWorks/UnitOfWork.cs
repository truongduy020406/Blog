using AutoMapper;
using Blog.Core.Domain.Content;
using Blog.Core.Domain.Identity;
using Blog.Core.Repository;
using Blog.Core.SeedWorks;
using Blog.Data.Repositorys;
using Microsoft.AspNetCore.Identity;


namespace Blog.Data.SeedWorks
{
    public class UnitOfWork : IUnitofWork
    {
        private readonly BlogContext _context;

        public UnitOfWork(BlogContext context, IMapper mapper, UserManager<AppUser> userManager)
        {
            _context = context;
            Posts = new PostRepository(context, mapper, userManager);
            PostCategories = new PostCategoryRepository(context, mapper);
            Series = new SeriesRepository(context, mapper);
            Tags = new TagRepository(context, mapper);
            Transactions = new TransactionRepository(context, mapper);
            Users = new UserRepository(context);
            Question = new QuestionRepository(context, mapper , userManager);
            Comment = new CommentRepository(context, mapper, userManager);
            Like = new LikeRepository(context, mapper, userManager);

        }
        public IPostRepository Posts { get; private set; }
        public IPostCategoryRepository PostCategories { get; private set; }
        public ISeriesRepository Series { get; private set; }

        public ITagRepository Tags {  get; private set; }
        public ITransactionRepository Transactions { get; private set; }
        public IUserRepository Users { get; private set; }

        public IQuestionRepository Question { get; private set; }

        public ICommentRepository Comment { get; private set; }

        public ILikeRepository Like { get; private set; }

        public async Task<int> CompleteAsync()
        {
            return await _context.SaveChangesAsync();
        }

        public void Dispose()
        {
            _context.Dispose();
        }
    }
}
