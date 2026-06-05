package com.kindconnect.service;

import org.springframework.stereotype.Service;

@Service
public class SmartChatService {

    public String getSmartResponse(String message) {
        String lowerMessage = message.toLowerCase();

        if (lowerMessage.contains("food") || lowerMessage.contains("grocery")) {
            return "I can help you find food resources or create a grocery help request.";
        }

        if (lowerMessage.contains("ride") || lowerMessage.contains("transportation")) {
            return "I can help you request a ride or find transportation support.";
        }

        if (lowerMessage.contains("tech") || lowerMessage.contains("computer") || lowerMessage.contains("phone")) {
            return "I can connect you with tech help for phones, computers, apps, or websites.";
        }

        if (lowerMessage.contains("lonely") || lowerMessage.contains("sad") || lowerMessage.contains("alone")) {
            return "I am sorry you are feeling that way. You can do a mood check-in or request a friendly call.";
        }

        if (lowerMessage.contains("medicine") || lowerMessage.contains("appointment")) {
            return "I can help you create a reminder for medicine or appointments.";
        }

        return "I can help with reminders, mood check-ins, resources, grocery help, rides, tech help, or friendly calls.";
    }
}