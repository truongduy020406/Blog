using AutoMapper;
using Blog.Core.Domain.Content;
using Blog.Core.Domain.Identity;
using Blog.Core.Model.Content;
using Blog.Core.Model;
using Blog.Core.Repository;
using Blog.Data.SeedWorks;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Blog.Core.Model.Client;

namespace Blog.Data.Repositorys
{
    public class QuestionRepository : RepositoryBase<Question, Guid>, IQuestionRepository
    {

        private readonly IMapper _mapper;
        private readonly UserManager<AppUser> _userManager;
        public QuestionRepository(BlogContext context, IMapper mapper,
            UserManager<AppUser> userManager) : base(context)
        {
            _mapper = mapper;
            _userManager = userManager;
        }

        public async Task<PagedResult<QuestionDTO>> GetAllPaging(string? keyword, Guid? categoryId, int pageIndex = 1, int pageSize = 10)
        {
            var query = _context.Questions.AsQueryable();

            if (!string.IsNullOrEmpty(keyword))
            {
                query = query.Where(x => x.Title.Contains(keyword) || x.Content.Contains(keyword));
            }

            var totalRow = await query.CountAsync();

            var data = await query
                .OrderByDescending(x => x.CreatedAt)
                .Skip((pageIndex - 1) * pageSize)
                .Take(pageSize)
                .Join(
                    _context.Users, 
                    question => question.UserId, 
                    user => user.Id, 
                    (question, user) => new QuestionDTO
                    {
                        QuestionId = question.QuestionId,
                        Title = question.Title,
                        Content = question.Content,
                        CreatedAt = question.CreatedAt,
                        UserId = user.Id,
                        UserName = user.GetFullName() 
                    }
                )
                .ToListAsync();

            return new PagedResult<QuestionDTO>
            {
                Results = data,
                CurrentPage = pageIndex,
                RowCount = totalRow,
                PageSize = pageSize
            };
        }


        public async Task<Question> GetQuestionByIdAsync(Guid id)
        {
            return await _context.Questions.Include(q => q.UserId).FirstOrDefaultAsync(q => q.QuestionId == id);
        }


        public async Task<bool> ExistsAsync(Guid id)
        {
            return await _context.Questions.AnyAsync(q => q.QuestionId == id);
        }

        public async Task<PagedResult<QuestionDTO>> GetQuestionByUserPaging(string keyword, Guid userId, int pageIndex = 1, int pageSize = 10)
        {
            var query = _context.Questions.Where(x => x.UserId == userId)
                .AsQueryable();


            var totalRow = await query.CountAsync();

            query = query.OrderByDescending(x => x.CreatedAt)
               .Skip((pageIndex - 1) * pageSize)
               .Take(pageSize);

            return new PagedResult<QuestionDTO>
            {
                Results = await _mapper.ProjectTo<QuestionDTO>(query).ToListAsync(),
                CurrentPage = pageIndex,
                RowCount = totalRow,
                PageSize = pageSize
            };
        }

        public async Task<List<QuestionDTO>> GetLatestQuestionsAsync()
        {
            var latestQuestions = await _context.Questions
                .OrderByDescending(q => q.CreatedAt)
                .Take(5) 
                .Join(
                    _context.Users,
                    question => question.UserId,
                    user => user.Id, 
                    (question, user) => new QuestionDTO
                    {
                        QuestionId = question.QuestionId,
                        Title = question.Title,
                        Content = question.Content,
                        CreatedAt = question.CreatedAt,
                        UserName = user.GetFullName() 
                    }
                )
                .ToListAsync();

            return latestQuestions;
        }

    }
}
