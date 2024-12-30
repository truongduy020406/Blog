using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Blog.Core.Model.Client
{
    public class ChangeProfileViewModel
    {
        [Required(ErrorMessage = "First name is required")]
        [DisplayName("First Name")]
        public string FirstName { get; set; }

        [Required(ErrorMessage = "Last name is required")]
        [DisplayName("Last Name")]

        public string LastName { get; set; }

        public string Email { get; set; }
        public string Avatar { get; set; }

    }
}
