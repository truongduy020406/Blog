using Blog.Core.Extensions;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Blog.Core.Model.Client
{
    public class ChangePasswordViewModel
    {
        [Required(ErrorMessage = "Old password is required")]
        public required string OldPassword { get; set; }

        [Required(ErrorMessage = "New password is required")]
        public required string NewPassword { get; set; }

        [Required(ErrorMessage = "Confirm new password required")]
        [PasswordMatch("NewPassword", ErrorMessage = "Confirm password is not matched")]
        public required string ConfirmPassword { get; set; }
    }
}
