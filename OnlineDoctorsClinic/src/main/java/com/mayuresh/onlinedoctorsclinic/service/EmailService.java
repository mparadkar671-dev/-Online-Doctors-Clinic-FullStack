package com.mayuresh.onlinedoctorsclinic.service;

import java.time.Year;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    @Autowired(required = false)
    private JavaMailSender mailSender;

    @Value("${spring.mail.username:}")
    private String mailSenderFrom;

    /**
     * Dispatches password reset email with HTML formatting.
     * If JavaMailSender is configured with active SMTP credentials, it delivers to recipient's inbox.
     * If SMTP is not yet configured or fails, it falls back to secure server-log simulation so local testing is never blocked.
     * 
     * @param toEmail The destination registered email address.
     * @param resetLink The secure frontend reset link with the one-time token.
     * @param recipientName Username or display name.
     * @return true if sent via real SMTP, false if simulated/fallback.
     */
    public static class EmailSendResult {
        private final boolean success;
        private final String message;
        private final String errorDetail;

        public EmailSendResult(boolean success, String message, String errorDetail) {
            this.success = success;
            this.message = message;
            this.errorDetail = errorDetail;
        }

        public boolean isSuccess() { return success; }
        public String getMessage() { return message; }
        public String getErrorDetail() { return errorDetail; }
    }

    public EmailSendResult sendPasswordResetEmailWithResult(String toEmail, String resetLink, String recipientName) {
        String fromAddress = (mailSenderFrom != null && !mailSenderFrom.trim().isEmpty()) 
                ? mailSenderFrom.trim() 
                : "noreply@medipulseclinic.com";

        String detailedError = null;

        if (mailSender != null) {
            try {
                MimeMessage message = mailSender.createMimeMessage();
                MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
                helper.setFrom(fromAddress, "MediPulse Clinic Pro");
                helper.setTo(toEmail);
                helper.setSubject("Password Reset Request - MediPulse Clinic Pro");
                helper.setText(buildResetPasswordHtml(recipientName, resetLink), true);

                mailSender.send(message);
                logger.info("Successfully delivered password reset email to: {}", toEmail);
                return new EmailSendResult(true, "Email delivered to inbox successfully.", null);
            } catch (Exception ex) {
                String rawMsg = ex.getMessage() != null ? ex.getMessage() : ex.toString();
                logger.warn("SMTP mail dispatch to {} encountered an issue: {}. Activating console fallback.", toEmail, rawMsg);
                if (rawMsg.toLowerCase().contains("authentication failed") || rawMsg.contains("535")) {
                    detailedError = "Gmail rejected your password. Google requires a 16-character App Password (not your personal account password). Please generate an App Password at myaccount.google.com/apppasswords and paste it into application.properties.";
                } else {
                    detailedError = "SMTP Delivery error: " + rawMsg;
                }
            }
        }

        // Development / Fallback Console Simulation
        System.out.println("================================================================================");
        System.out.println("   [MEDIPULSE CLINIC] PASSWORD RESET EMAIL DISPATCHED (DEVELOPMENT MODE)");
        System.out.println("================================================================================");
        System.out.println("To:         " + toEmail);
        System.out.println("Recipient:  " + (recipientName != null ? recipientName : "Member"));
        System.out.println("Subject:    Password Reset Request - MediPulse Clinic Pro");
        System.out.println("Reset URL:  " + resetLink);
        System.out.println("Expires In: 30 minutes");
        if (detailedError != null) {
            System.out.println("SMTP Alert: " + detailedError);
        }
        System.out.println("================================================================================");

        return new EmailSendResult(false, "Sent via simulation fallback.", detailedError);
    }

    public boolean sendPasswordResetEmail(String toEmail, String resetLink, String recipientName) {
        return sendPasswordResetEmailWithResult(toEmail, resetLink, recipientName).isSuccess();
    }

    private String buildResetPasswordHtml(String recipientName, String resetLink) {
        String displayName = (recipientName != null && !recipientName.trim().isEmpty()) ? recipientName.trim() : "Healthcare Member";
        int currentYear = Year.now().getValue();

        return "<!DOCTYPE html>"
                + "<html>"
                + "<head>"
                + "<meta charset='UTF-8'>"
                + "<title>Password Reset</title>"
                + "<style>"
                + "body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f1f5f9; margin: 0; padding: 24px; color: #1e293b; }"
                + ".container { max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.08); border: 1px solid #e2e8f0; }"
                + ".header { background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%); padding: 32px 24px; text-align: center; color: #ffffff; }"
                + ".header h1 { margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.5px; }"
                + ".header p { margin: 6px 0 0 0; font-size: 13px; opacity: 0.9; text-transform: uppercase; letter-spacing: 1px; }"
                + ".body { padding: 32px 28px; }"
                + ".greeting { font-size: 18px; font-weight: 600; margin-bottom: 16px; color: #0f172a; }"
                + ".text { font-size: 15px; line-height: 1.6; color: #475569; margin-bottom: 24px; }"
                + ".button-container { text-align: center; margin: 32px 0; }"
                + ".reset-btn { background: #0284c7; color: #ffffff !important; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px; display: inline-block; box-shadow: 0 4px 12px rgba(2, 132, 199, 0.3); }"
                + ".reset-btn:hover { background: #0369a1; }"
                + ".alert-box { background: #f8fafc; border-left: 4px solid #0284c7; padding: 16px; border-radius: 6px; margin: 24px 0; font-size: 13px; color: #64748b; }"
                + ".link-fallback { word-break: break-all; font-size: 12px; color: #0284c7; background: #f8fafc; padding: 12px; border-radius: 6px; border: 1px solid #e2e8f0; }"
                + ".footer { background: #f8fafc; padding: 20px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; }"
                + "</style>"
                + "</head>"
                + "<body>"
                + "<div class='container'>"
                + "  <div class='header'>"
                + "    <h1>MediPulse Clinic Pro</h1>"
                + "    <p>Healthcare Practice Management Portal</p>"
                + "  </div>"
                + "  <div class='body'>"
                + "    <div class='greeting'>Hello " + displayName + ",</div>"
                + "    <p class='text'>We received a request to reset the password for your MediPulse Clinic portal account. Click the button below to choose a secure new password:</p>"
                + "    <div class='button-container'>"
                + "      <a href='" + resetLink + "' class='reset-btn' target='_blank'>Reset My Password</a>"
                + "    </div>"
                + "    <div class='alert-box'>"
                + "      <strong>Security Information:</strong>"
                + "      <ul style='margin: 8px 0 0 0; padding-left: 18px;'>"
                + "        <li>This reset link is valid for <strong>30 minutes</strong>.</li>"
                + "        <li>If you did not request this password reset, please ignore this email. Your password will remain unchanged.</li>"
                + "      </ul>"
                + "    </div>"
                + "    <p class='text' style='font-size: 13px;'>If the button above does not work, copy and paste this URL into your browser:</p>"
                + "    <div class='link-fallback'>" + resetLink + "</div>"
                + "  </div>"
                + "  <div class='footer'>"
                + "    &copy; " + currentYear + " MediPulse Clinic Pro. All rights reserved.<br/>"
                + "    Automated security notification — Please do not reply directly to this email."
                + "  </div>"
                + "</div>"
                + "</body>"
                + "</html>";
    }
}
