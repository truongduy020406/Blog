using AutoMapper;
using Blog.Core.Domain.Content;
using Blog.Core.Domain.Identity;
using Blog.Core.Model.Client;
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
    public class CommentRepository : RepositoryBase<Comment, Guid>, ICommentRepository
    {
        private readonly IMapper _mapper;
        private readonly UserManager<AppUser> _userManager;
        public CommentRepository(BlogContext context, IMapper mapper,
           UserManager<AppUser> userManager) : base(context)
        {
            _mapper = mapper;
            _userManager = userManager;
        }

        public async Task<IEnumerable<CommentDto>> GetCommentsByPostIdAsync(Guid postId)
        {
            var parentComments = await _context.Comments
                .Where(c => c.PostId == postId && c.ParentCommentId == null)
                .ToListAsync();

            var parentCommentDtos = _mapper.Map<List<CommentDto>>(parentComments);

            foreach (var parentCommentDto in parentCommentDtos)
            {
                parentCommentDto.Replies = await GetRepliesAsync(parentCommentDto.Id);
            }

            return parentCommentDtos;
        }



        public async Task<IEnumerable<CommentDto>> GetCommentsByQuestionIdAsync(Guid questionId)
        {
            var parentComments = await _context.Comments
                .Where(c => c.QuestionId == questionId && c.ParentCommentId == null)
                .ToListAsync();

            var parentCommentDtos = _mapper.Map<List<CommentDto>>(parentComments);

            foreach (var parentCommentDto in parentCommentDtos)
            {
                parentCommentDto.Replies = await GetRepliesAsync(parentCommentDto.Id);
            }

            return parentCommentDtos;
        }



        public async Task UpdateAsync(Guid commentId, CreateUpdateCommentDto commentDto)
        {
            var comment = await _context.Comments.FindAsync(commentId);
            _context.Comments.Update(comment);
            await _context.SaveChangesAsync();
        }


        private async Task<List<CommentDto>> GetRepliesAsync(Guid parentCommentId)
        {
            var replies = await _context.Comments
                .Where(c => c.ParentCommentId == parentCommentId)
                .ToListAsync();

            var replyDtos = _mapper.Map<List<CommentDto>>(replies);

            // Đệ quy lấy các phản hồi con
            foreach (var replyDto in replyDtos)
            {
                replyDto.Replies = await GetRepliesAsync(replyDto.Id);
            }

            return replyDtos;
        }

    }
}
