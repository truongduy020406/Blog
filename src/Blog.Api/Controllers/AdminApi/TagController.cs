using AutoMapper;
using Blog.Core.Domain.Content;
using Blog.Core.Model.Content;
using Blog.Core.SeedWorks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Blog.Api.Controllers.AdminApi
{
    [Route("api/[controller]")]
    [ApiController]
    public class TagController : ControllerBase
    {
        private readonly IUnitofWork _unitOfWork;
        private readonly IMapper _mapper;

        public TagController(IMapper mapper, IUnitofWork unitofWork)
        {
            _mapper = mapper;
            _unitOfWork = unitofWork;
        }

        [HttpPost]
        public async Task<IActionResult> CreateTag([FromBody] CreateUpdateTagRequest request)
        {
            if (request == null)
            {
                return BadRequest("Invalid request data.");
            }

            var tag = _mapper.Map<CreateUpdateTagRequest, Tag>(request);

            if (tag == null)
            {
                return BadRequest("Mapping failed.");
            }

            _unitOfWork.Tags.Add(tag);

            var result = await _unitOfWork.CompleteAsync();
            return result > 0 ? Ok() : BadRequest();
        }

    }
}
