package com.unihub.app.service;

import com.unihub.app.dto.EmailDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {
    @Autowired
    private JavaMailSender javaMailSender;

    @Value("${spring.mail.username}") private String sender;

    public String sendSimpleEmail(EmailDTO details) {
        try {
            SimpleMailMessage mailMessage = new SimpleMailMessage();

            mailMessage.setFrom(sender);
            mailMessage.setTo(details.getRecipient());
            mailMessage.setText(details.getMessageBody());
            mailMessage.setSubject(details.getSubject());

            javaMailSender.send(mailMessage);

            return "Mail sent successfully.";
        } catch (Exception e) {
            return "Error while sending email.";
        }
    }

    @Async
    public void sendSimpleEmailAsync(EmailDTO email) {
        try {
            sendSimpleEmail(email);
        } catch (Exception e) {
            log.error("Failed to send email to: " + email.getRecipient(), e);
        }
    }
}
