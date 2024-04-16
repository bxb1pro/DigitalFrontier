using DigitalGamesMarketplace2.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authorization;

namespace DigitalGamesMarketplace2.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "SuperAdmin")]
    public class RolesController : ControllerBase
    {
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly UserManager<IdentityUser> _userManager;
        private readonly ILogger<RolesController> _logger; // Add ILogger field

        public RolesController(RoleManager<IdentityRole> roleManager, UserManager<IdentityUser> userManager, ILogger<RolesController> logger) // Add logger
        {
            _roleManager = roleManager;
            _userManager = userManager;
            _logger = logger; // Initialise the logger
        }

        [HttpGet]
        [Authorize(Roles = "SuperAdmin, Admin")]
        public IActionResult GetRoles()
        {
            var roles = _roleManager.Roles.ToList();
            _logger.LogInformation("Retrieved all roles successfully.");
            return Ok(roles);
        }

        [HttpGet("{roleId}")]
        [Authorize(Roles = "SuperAdmin, Admin")]
        public async Task<IActionResult> GetRole(string roleId)
        {
            var role = await _roleManager.FindByIdAsync(roleId);

            if (role == null)
            {
                _logger.LogWarning($"Attempt to retrieve a role failed. Role ID {roleId} not found.");
                return NotFound("Role not found.");
            }

            _logger.LogInformation($"Role retrieved successfully. Role ID: {roleId}, Role Name: {role.Name}");
            return Ok(role);
        }

        [HttpPost]
        public async Task<IActionResult> CreateRole([FromBody] string roleName)
        {
            var role = new IdentityRole(roleName);
            var result = await _roleManager.CreateAsync(role);

            if (result.Succeeded)
            {
                _logger.LogInformation($"Role {roleName} created successfully.");
                return Ok("Role created successfully.");
            }
            else
            {
                _logger.LogWarning($"Failed to create role {roleName}. Errors: {string.Join(", ", result.Errors.Select(e => e.Description))}");
                return BadRequest(result.Errors);
            }
        }

        [HttpPut]
        public async Task<IActionResult> UpdateRole([FromBody] UpdateRoleModel model)
        {
            var role = await _roleManager.FindByIdAsync(model.RoleId);

            if (role == null)
            {
                _logger.LogWarning($"Role ID {model.RoleId} not found for update.");
                return NotFound("Role not found.");
            }

            role.Name = model.NewRoleName;
            var result = await _roleManager.UpdateAsync(role);

            if (result.Succeeded)
            {
                _logger.LogInformation($"Role ID {model.RoleId} updated successfully to {model.NewRoleName}.");
                return Ok("Role updated successfully.");
            }
            else
            {
                _logger.LogWarning($"Failed to update role ID {model.RoleId}. Errors: {string.Join(", ", result.Errors.Select(e => e.Description))}");
                return BadRequest(result.Errors);
            }
        }

        [HttpDelete]
        public async Task<IActionResult> DeleteRole(string roleId)
        {
            var role = await _roleManager.FindByIdAsync(roleId);

            if (role == null)
            {
                _logger.LogWarning($"Delete operation failed. Role ID {roleId} not found.");
                return NotFound("Role not found.");
            }

            var result = await _roleManager.DeleteAsync(role);

            if (result.Succeeded)
            {
                _logger.LogInformation($"Role ID {roleId} deleted successfully.");
                return Ok("Role deleted successfully.");
            }
            else
            {
                _logger.LogWarning($"Failed to delete role ID {roleId}. Errors: {string.Join(", ", result.Errors.Select(e => e.Description))}");
                return BadRequest(result.Errors);
            }
        }

        [HttpPost("assign-role-to-user")]
        [Authorize(Roles = "Admin,SuperAdmin")]
        public async Task<IActionResult> AssignRoleToUser([FromBody] AssignRoleModel model)
        {
            var user = await _userManager.FindByIdAsync(model.UserId);

            if (user == null)
            {
                _logger.LogWarning($"Assign role operation failed. User ID {model.UserId} not found.");
                return NotFound("User not found.");
            }

            var roleExists = await _roleManager.RoleExistsAsync(model.RoleName);

            if (!roleExists)
            {
                _logger.LogWarning($"Assign role operation failed. Role {model.RoleName} not found.");
                return NotFound("Role not found.");
            }

            // Prevent Admin from assigning roles of Admin or SuperAdmin
            if (User.IsInRole("Admin") && (model.RoleName == "Admin" || model.RoleName == "SuperAdmin"))
            {
                return Forbid("Admins cannot assign Admin or SuperAdmin roles.");
            }

            var result = await _userManager.AddToRoleAsync(user, model.RoleName);

            if (result.Succeeded)
            {
                _logger.LogInformation($"Role {model.RoleName} assigned to user ID {model.UserId} successfully.");
                return Ok("Role assigned to user successfully.");
            }
            else
            {
                _logger.LogWarning($"Failed to assign role {model.RoleName} to user ID {model.UserId}. Errors: {string.Join(", ", result.Errors.Select(e => e.Description))}");
                return BadRequest(result.Errors);
            }

        }

    }
}