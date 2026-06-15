package com.kindconnect.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
public class OllamaService {

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public OllamaService() {
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper();
    }

    public String askOllama(String userMessage) {
        try {
            String url = "http://localhost:11434/api/generate";

            Map<String, Object> request = new HashMap<>();
            request.put("model", "llama3.2:1b");
            request.put("prompt", buildPrompt(userMessage));
            request.put("stream", false);

            String response = restTemplate.postForObject(url, request, String.class);

            JsonNode jsonNode = objectMapper.readTree(response);

            if (jsonNode.has("response")) {
                String aiReply = jsonNode.get("response").asText();

                if (aiReply != null && !aiReply.trim().isEmpty()) {
                    return aiReply.trim();
                }
            }

            return fallbackResponse(userMessage);

        } catch (Exception error) {
            System.out.println("Ollama is not working: " + error.getMessage());
            return fallbackResponse(userMessage);
        }
    }

    private String buildPrompt(String userMessage) {
        return """
                You are KindConnect AI Assistant.
                You help users with:
                - daily reminders
                - mood support
                - food resources
                - transportation help
                - volunteer support
                - friendly calls
                - community resources

                Be kind, simple, short, and helpful.

                User message:
                """ + userMessage;
    }

    private String fallbackResponse(String userMessage) {
        if (userMessage == null || userMessage.trim().isEmpty()) {
            return "Hi, I am your AI assistant. How can I help you?";
        }

        String message = userMessage.toLowerCase();

        if (message.contains("hi") || message.contains("hello")) {
            return "Hi, I am your KindConnect AI assistant 💙 How can I help you today?";
        }

        if (message.contains("sad") || message.contains("lonely") || message.contains("stressed")) {
            return "I am sorry you are feeling this way 💙 I am here with you. You can try a mood check-in, calming music, or request a friendly call.";
        }

        if (message.contains("medicine") || message.contains("reminder")) {
            return "I can help with reminders. Click Daily Reminders, choose the date and time, and it will show on your dashboard.";
        }

        if (message.contains("food")) {
            return "I can help you find food resources. Open Community Resources and choose Food.";
        }

        if (message.contains("ride") || message.contains("transportation")) {
            return "I can help with transportation support. Open Resources and choose Rides.";
        }

        return "Hi, I am your AI assistant. How can I help you?";
    }
}