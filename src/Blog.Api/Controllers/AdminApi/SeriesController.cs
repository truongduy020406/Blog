using AutoMapper;
using Blog.Core.Model.Content;
using Blog.Core.Model;
using Blog.Core.SeedWorks.Constants;
using Blog.Core.SeedWorks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Blog.Api.Extensions;

namespace Blog.Api.Controllers.AdminApi
{
    [Route("api/admin/series")]
    public class SeriesController : ControllerBase
    {
        private readonly IUnitofWork _unitOfWork;
        private readonly IMapper _mapper;
        public SeriesController(IUnitofWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        [HttpPost]
        [Authorize(Permissions.Series.Create)]
        public async Task<IActionResult> CreateSeries([FromBody] CreateUpdateSeriesRequest request)
        {
            var userId = User.GetUserId();
            var serie = _mapper.Map<CreateUpdateSeriesRequest, Core.Domain.Content.Series>(request);
            serie.AuthorUserId = userId;
            _unitOfWork.Series.Add(serie);

            var result = await _unitOfWork.CompleteAsync();
            return result > 0 ? Ok() : BadRequest();
        }

        [HttpPut]
        [Authorize(Permissions.Series.Edit)]
        public async Task<IActionResult> UpdateSeries(Guid id, [FromBody] CreateUpdateSeriesRequest request)
        {
            var userId = User.GetUserId();
            if (userId == Guid.Empty)
            {
                return BadRequest("Không thể xác định UserId.");
            }
            var serie = await _unitOfWork.Series.GetByIdAsync(id);
            if (serie == null)
            {
                return NotFound($"Không tìm thấy Series với Id: {id}");
            }
            request.AuthorUserId = userId;
 
            _mapper.Map(request, serie);
            var result = await _unitOfWork.CompleteAsync();
            if (result > 0)
            {
                return Ok("Cập nhật thành công.");
            }

            return BadRequest("Không thể lưu thay đổi. Vui lòng thử lại.");
        }


        [Route("post-series")]
        [HttpPut()]
        [Authorize(Permissions.Series.Edit)]
        public async Task<IActionResult> AddPostSeries([FromBody] AddPostSeriesRequest request)
        {
            var isExisted = await _unitOfWork.Series.IsPostInSeries(request.SeriesId, request.PostId);
            if (isExisted)
            {
                return BadRequest($"Bài viết này đã nằm trong loạt bài.");
            }
            await _unitOfWork.Series.AddPostToSeries(request.SeriesId, request.PostId, request.SortOrder);
            var result = await _unitOfWork.CompleteAsync();
            return result > 0 ? Ok() : BadRequest();
        }

        [Route("post-series")]
        [HttpDelete()]
        [Authorize(Permissions.Series.Edit)]
        public async Task<IActionResult> DeletePostSeries([FromBody] AddPostSeriesRequest request)
        {
            var isExisted = await _unitOfWork.Series.IsPostInSeries(request.SeriesId, request.PostId);
            if (!isExisted)
            {
                return NotFound();
            }
            await _unitOfWork.Series.RemovePostToSeries(request.SeriesId, request.PostId);
            var result = await _unitOfWork.CompleteAsync();
            return result > 0 ? Ok() : BadRequest();
        }
   

        [Route("post-series/{seriesId}")]
        [HttpGet()]
        [Authorize(Permissions.Series.Edit)]
        public async Task<ActionResult<List<PostInListDto>>> GetPostsInSeries(Guid seriesId)
        {
            var posts = await _unitOfWork.Series.GetAllPostsInSeries(seriesId);
            return Ok(posts);
        }

        [HttpDelete]
        [Authorize(Permissions.Series.Delete)]
        public async Task<IActionResult> DeleteSeries([FromQuery] Guid[] ids)
        {
            foreach (var id in ids)
            {
                var series = await _unitOfWork.Series.GetByIdAsync(id);
                if (series == null)
                {
                    return NotFound();
                }
                if (await _unitOfWork.Series.HasPost(id))
                {
                    return BadRequest("Loạt bài đang chứa bài viết, không thể xóa");
                }
                _unitOfWork.Series.Remove(series);
            }
            var result = await _unitOfWork.CompleteAsync();
            return result > 0 ? Ok() : BadRequest();
        }

        [HttpGet]
        [Route("{id}")]
        [Authorize(Permissions.Series.View)]
        public async Task<ActionResult<SeriesDto>> GetSeriesById(Guid id)
        {
            var post = await _unitOfWork.Series.GetByIdAsync(id);
            if (post == null)
            {
                return NotFound();
            }
            return Ok(post);
        }

        [HttpGet]
        [Route("paging")]
        [Authorize(Permissions.Series.View)]
        public async Task<ActionResult<PagedResult<SeriesInListDto>>> GetSeriesPaging(string? keyword,
            int pageIndex, int pageSize = 10)
        {
            var result = await _unitOfWork.Series.GetAllPaging(keyword, pageIndex, pageSize);

            return Ok(result);
        }

        [HttpGet]
        [Route("byuser")]
        [Authorize(Permissions.Series.View)]
        public async Task<ActionResult<PagedResult<SeriesInListDto>>> GetSeriesUserPaging(string? keyword,
         int pageIndex, int pageSize = 10)
        {
            var userId = User.GetUserId();
            var result = await _unitOfWork.Series.GetSeriesUserPaging(keyword, userId, pageIndex, pageSize);

            return Ok(result);
        }

        [HttpGet]
        [Authorize(Permissions.Series.View)]
        public async Task<ActionResult<List<SeriesInListDto>>> GetAllSeries()
        {
            var result = await _unitOfWork.Series.GetAllAsync();
            var series = _mapper.Map<List<SeriesInListDto>>(result);
            return Ok(series);
        }
    }
}
