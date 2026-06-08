package com.kindconnect.controller;

import com.kindconnect.dto.AgentChatRequest;
import com.kindconnect.dto.AgentChatResponse;
import com.kindconnect.service.OpenAIService;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "*")
public class ChatController {

    private final OpenAIService openAIService;

    public ChatController(OpenAIService openAIService) {
        this.openAIService = openAIService;
    }

    @PostMapping("/chat")
    public AgentChatResponse chat(@RequestBody AgentChatRequest request) {
        String reply = openAIService.askOpenAI(request.getMessage());
        return new AgentChatResponse(reply);
    }
}