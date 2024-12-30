using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Blog.Core.Model.Client
{
    public class ForgotPasswordModel
    {
        [Required(ErrorMessage = "Email required")]
        [Display(Name = "Email")]
        [EmailAddress(ErrorMessage = "Email format is not correct.")]
        public string Email { get; set; }
    }
}
