package com.mayuresh.onlinedoctorsclinic.service;

import org.springframework.stereotype.Service;

@Service
public class NotificationService {

    public void sendWhatsAppNotification(String mobile, String message) {
        // Log simulation in console
        System.out.println("ALERT: Triggering WhatsApp API Gateway...");
        System.out.println("To: " + mobile);
        System.out.println("Message: " + message);
        
        /* 
         * ENTERPRISE LOGIC (Future Scope):
         * RestTemplate restTemplate = new RestTemplate();
         * String apiUrl = "https://api.twilio.com/v1/whatsapp/send";
         * // API Call logic goes here
         */
    }
}