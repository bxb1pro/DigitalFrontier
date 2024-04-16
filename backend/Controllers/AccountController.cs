using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using DigitalGamesMarketplace2.Models;
using Microsoft.AspNetCore.Authorization;
using System.Data;

namespace DigitalGamesMarketplace2.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly UserManager<IdentityUser> _userManager;
        private readonly SignInManager<IdentityUser> _signInManager;
        private readonly EmailService _emailService;
        private readonly IConfiguration _configuration;
        private readonly ILogger<AccountController> _logger; // Add ILogger field

        public AccountController(
            UserManager<IdentityUser> userManager,
            SignInManager<IdentityUser> signInManager,
            EmailService emailService,
            IConfiguration configuration,
            ILogger<AccountController> logger) // Add logger
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _emailService = emailService;
            _configuration = configuration;
            _logger = logger; // Initialise the logger
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(AuthModel model)
        {
            var user = new IdentityUser { UserName = model.Email, Email = model.Email };
            var result = await _userManager.CreateAsync(user, model.Password);

            if (result.Succeeded)
            {
                var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);
                var verificationLink = Url.Action("VerifyEmail", "Account", new { userId = user.Id, token = token }, Request.Scheme);
                var emailSubject = "Email Verification";
                var emailBody = $"Please verify your email by clicking the following link: {verificationLink}";
                _emailService.SendEmail(user.Email, emailSubject, emailBody);

                _logger.LogInformation($"User {model.Email} registered successfully.");

                return Ok("User registered successfully. An email verification link has been sent.");
            }
            else
            {
                _logger.LogWarning($"Registration failed for user {model.Email}. Errors: {string.Join(", ", result.Errors.Select(e => e.Description))}");
                return BadRequest(result.Errors);
            }
        }

        // Add an action to handle email verification
        [HttpGet("verify-email")]
        public async Task<IActionResult> VerifyEmail(string userId, string token)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                _logger.LogWarning($"Email verification failed. User ID {userId} not found.");
                return NotFound("User not found.");
            }

            // Additional check to see if user email is already verified
            if (user.EmailConfirmed)
            {
                _logger.LogInformation($"User {user.Email} email is already verified.");
                return Ok("Email is already verified.");
            }

            var result = await _userManager.ConfirmEmailAsync(user, token);
            if (result.Succeeded)
            {
                _logger.LogInformation($"User {user.Email} email verification successful.");
                return Ok("Email verification successful.");
            }
            else
            {
                _logger.LogWarning($"Email verification failed for user {user.Email}. Errors: {string.Join(", ", result.Errors.Select(e => e.Description))}");
                return BadRequest("Email verification failed.");
            }
        }

        [HttpPost("login")] // Additional logging for login success/failure
        public async Task<IActionResult> Login(AuthModel model)
        {
            var result = await _signInManager.PasswordSignInAsync(model.Email, model.Password, isPersistent: false, lockoutOnFailure: false);

            if (result.Succeeded)
            {
                var user = await _userManager.FindByEmailAsync(model.Email);
                var roles = await _userManager.GetRolesAsync(user);
                var token = GenerateJwtToken(user, roles);

                _logger.LogInformation($"User {model.Email} logged in successfully.");

                return Ok(new { Token = token });
            }
            else if (result.IsLockedOut)
            {
                _logger.LogWarning($"User {model.Email} account locked.");
                return Unauthorized("Account is locked.");
            }
            else if (result.IsNotAllowed)
            {
                _logger.LogWarning($"User {model.Email} login not allowed.");
                return Unauthorized("Login not allowed.");
            }
            else
            {
                _logger.LogWarning($"Failed login attempt for user {model.Email}.");
                return Unauthorized("Invalid login attempt.");
            }
        }

        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            var userName = User.Identity?.Name; // Get the current user's name from User Identity
            await _signInManager.SignOutAsync();
            _logger.LogInformation($"User {userName} logged out successfully.");
            return Ok("Logged out");
        }
        private string GenerateJwtToken(IdentityUser user, IList<string> roles)
        {
            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Email),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            };

            // Add roles as claims
            foreach (var role in roles)
            {
                claims.Add(new Claim(ClaimTypes.Role, role));
            }

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var expires = DateTime.Now.AddHours(Convert.ToDouble(_configuration["Jwt:ExpireHours"]));

            var token = new JwtSecurityToken(
                _configuration["Jwt:Issuer"],
                _configuration["Jwt:Issuer"],
                claims,
                expires: expires,
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

    }

}