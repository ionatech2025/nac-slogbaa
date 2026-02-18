```markdown
# Email Notification Strategy for SLOGBAA Platform

## 1. Overview
This document outlines the strategy for implementing automated email notifications (e.g., Trainee Registration, Password Resets) within the SLOGBAA platform using Spring Boot Starter Mail.

## 2. Rationale

### Security
By handling email logic in the Backend (`iam` module), we keep SMTP credentials (like Gmail App Passwords) hidden from the client-side.

### Decoupling
Using Spring's `JavaMailSender` abstraction allows us to switch from Gmail (Dev) to SendGrid or Organizational SMTP (Prod) by changing a properties file, without touching a single line of Java code.

### Reliability
Backend-driven emails allow for "Retry" logic and logging, ensuring government-standard communication reliability.

## 3. Technical Implementation

### A. Dependency Management
Add the following to your `iam/pom.xml`. Since your parent POM manages Spring Boot versions, you do not need to specify a version here.

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-mail</artifactId>
</dependency>
```

### B. Environment Configuration
We will use Spring Profiles to switch between Development and Production settings.

**Development (`application-dev.properties`):**
Using Gmail App Password.

```properties
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=2060newty@gmail.com
spring.mail.password=${GMAIL_APP_PASSWORD:oaxa ojug ozza kcfg}
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
```

**Production (`application-prod.properties`):**
Example configuration for SendGrid or Organizational SMTP.

```properties
spring.mail.host=smtp.sendgrid.net
spring.mail.port=465
spring.mail.username=apikey
spring.mail.password=${SENDGRID_API_KEY}
spring.mail.properties.mail.smtp.ssl.enable=true
```

### C. The Email Service (IAM Module)
The service is designed to be generic so it can handle different types of notifications across the platform.

```java
@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String senderEmail;

    public void sendSimpleEmail(String to, String subject, String body) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(senderEmail);
        message.setTo(to);
        message.setSubject(subject);
        message.setText(body);
        mailSender.send(message);
    }
}
```

## 4. Operational Workflow

1. **Trigger**: A Trainee registers via the React frontend.
2. **Request**: The Frontend sends a POST request to `/api/v1/auth/register`.
3. **Action**: The `iam` module saves the user to PostgreSQL and calls `EmailService.sendSimpleEmail()`.
4. **Delivery**: The Spring Backend connects to the configured SMTP (Gmail for now) and delivers the message.

## 5. Security Notes

### Secrets
Never hardcode your Gmail App Password or SendGrid API Key in the `.properties` files. Use environment variables (e.g., `${EMAIL_PASS}`).

### Rate Limiting
Gmail has a limit (approx. 500 emails/day). For production scaling, move to SendGrid/SES.
```