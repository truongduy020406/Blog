using AutoMapper;
using Blog.Core.Domain.Content;
using Blog.Core.Domain.Identity;
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

namespace Blog.Data.Repositorys
{
    public class AnswerRepository: RepositoryBase<Answer, Guid>, IAnswerRepository
    {
        private readonly IMapper _mapper;
        private readonly UserManager<AppUser> _userManager;
        public AnswerRepository(BlogContext context, IMapper mapper,
            UserManager<AppUser> userManager) : base(context)
        {
            _mapper = mapper;
            _userManager = userManager;
        }

       


        public async Task<bool> ExistsAsync(Guid id)
        {
            return await _context.Questions.AnyAsync(q => q.QuestionId == id);
        }
    }
}
