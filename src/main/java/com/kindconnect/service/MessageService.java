package com.kindconnect.service;

import com.kindconnect.model.Message;
import com.kindconnect.repository.MessageRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MessageService {

    private final MessageRepository messageRepository;

    public MessageService(MessageRepository messageRepository) {
        this.messageRepository = messageRepository;
    }

    public List<Message> getAllMessages() {
        return messageRepository.findAll();
    }

    public List<Message> getMessagesByUserId(Long userId) {
        return messageRepository.findAll()
                .stream()
                .filter(message -> message.getUserId() != null
                        && message.getUserId().equals(userId))
                .toList();
    }

    public Message addMessage(Message message) {
        if (message.getReadMessage() == null) {
            message.setReadMessage(false);
        }

        return messageRepository.save(message);
    }

    public Message markAsRead(Long id) {
        Message message = messageRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Message not found"));

        message.setReadMessage(true);
        return messageRepository.save(message);
    }

    public void deleteMessage(Long id) {
        messageRepository.deleteById(id);
    }
}