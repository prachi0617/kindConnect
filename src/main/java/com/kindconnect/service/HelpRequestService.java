package com.kindconnect.service;

import com.kindconnect.model.HelpRequest;
import com.kindconnect.repository.HelpRequestRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HelpRequestService {

    private final HelpRequestRepository helpRequestRepository;

    public HelpRequestService(HelpRequestRepository helpRequestRepository) {
        this.helpRequestRepository = helpRequestRepository;
    }

    public List<HelpRequest> getAllHelpRequests() {
        return helpRequestRepository.findAll();
    }

    public HelpRequest createHelpRequest(HelpRequest helpRequest) {
        if (helpRequest.getCompleted() == null) {
            helpRequest.setCompleted(false);
        }

        if (helpRequest.getStatus() == null || helpRequest.getStatus().isBlank()) {
            helpRequest.setStatus("Pending");
        }

        return helpRequestRepository.save(helpRequest);
    }

    public HelpRequest completeHelpRequest(Long id) {
        HelpRequest request = helpRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Help request not found"));

        request.setCompleted(true);
        request.setStatus("Completed");

        return helpRequestRepository.save(request);
    }

    public HelpRequest updateStatus(Long id, String status) {
        HelpRequest request = helpRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Help request not found"));

        request.setStatus(status);
        return helpRequestRepository.save(request);
    }

    public void deleteHelpRequest(Long id) {
        helpRequestRepository.deleteById(id);
    }
}