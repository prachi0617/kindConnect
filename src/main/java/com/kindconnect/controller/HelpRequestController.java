package com.kindconnect.controller;

import com.kindconnect.model.HelpRequest;
import com.kindconnect.service.HelpRequestService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/help-requests")
@CrossOrigin(origins = "*")
public class HelpRequestController {

    private final HelpRequestService helpRequestService;

    public HelpRequestController(HelpRequestService helpRequestService) {
        this.helpRequestService = helpRequestService;
    }

    @GetMapping
    public List<HelpRequest> getAllHelpRequests() {
        return helpRequestService.getAllHelpRequests();
    }

    @PostMapping
    public HelpRequest createHelpRequest(@RequestBody HelpRequest helpRequest) {
        return helpRequestService.createHelpRequest(helpRequest);
    }

    @PutMapping("/{id}/complete")
    public HelpRequest completeHelpRequest(@PathVariable Long id) {
        return helpRequestService.completeHelpRequest(id);
    }

    @PutMapping("/{id}/status/{status}")
    public HelpRequest updateStatus(@PathVariable Long id, @PathVariable String status) {
        return helpRequestService.updateStatus(id, status);
    }

    @DeleteMapping("/{id}")
    public void deleteHelpRequest(@PathVariable Long id) {
        helpRequestService.deleteHelpRequest(id);
    }
}