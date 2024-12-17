using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Blog.Core.ConfigOption
{
    public class MediaSettings
    {
        public string? AllowImageFileTypes { get; set; }
        public string? ImageFolder { get; set; }
        public string? NoImage { get; set; }
    }
}
