using DigitalGamesMarketplace2.Services;
using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;
using Microsoft.Extensions.Options;

public class EmailService
{
    private readonly EmailSettings _emailSettings;
    private readonly ILogger<EmailService> _logger; // Add ILogger field

    public EmailService(IOptions<EmailSettings> emailSettings, ILogger<EmailService> logger) // Add logger
    {
        _emailSettings = emailSettings.Value;
        _logger = logger; // Initialise logger
    }
    public void SendEmail(string toEmail, string subject, string body)
    {
        try
        {
            var message = new MimeMessage();
            message.From.Add(new MailboxAddress("Digital Games Online Marketplace", _emailSettings.SmtpUsername));
            message.To.Add(new MailboxAddress("Receiver", toEmail));
            message.Subject = subject;

            var textPart = new TextPart("plain")
            {
                Text = body
            };

            message.Body = textPart;

            using (var client = new SmtpClient())
            {
                client.Connect(_emailSettings.SmtpServer, _emailSettings.SmtpPort, SecureSocketOptions.StartTls);
                client.Authenticate(_emailSettings.SmtpUsername, _emailSettings.SmtpPassword);
                client.Send(message);
                client.Disconnect(true);
            }
        }
        catch (SmtpCommandException ex)
        {
            // Handle SMTP command errors
            _logger.LogError(ex, "SMTP command failed: {Message}", ex.Message);
        }
        catch (SmtpProtocolException ex)
        {
            // Handle protocol errors
            _logger.LogError(ex, "SMTP protocol error: {Message}", ex.Message);
        }
        catch (Exception ex)
        {
            // Handle all other exceptions
            _logger.LogError(ex, "An unexpected error occurred: {Message}", ex.Message);
        }
    }
}


