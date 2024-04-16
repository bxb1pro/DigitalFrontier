using Microsoft.AspNetCore.Mvc;

// Extra additional feature to check health and availability of endpoints
namespace DigitalGamesMarketplace2.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HealthCheckController : ControllerBase
    {
        [HttpGet]
        public IActionResult Get() => Ok("API is up and running.");
    }
}