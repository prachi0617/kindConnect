package com.kindconnect.controller;

import com.kindconnect.model.HelpRequest;
import com.kindconnect.model.Volunteer;
import com.kindconnect.repository.HelpRequestRepository;
import com.kindconnect.repository.VolunteerRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/matches")
@CrossOrigin(origins = "*")
public class VolunteerMatchController {

    private final HelpRequestRepository helpRequestRepository;
    private final VolunteerRepository volunteerRepository;

    public VolunteerMatchController(
            HelpRequestRepository helpRequestRepository,
            VolunteerRepository volunteerRepository) {
        this.helpRequestRepository = helpRequestRepository;
        this.volunteerRepository = volunteerRepository;
    }

    @GetMapping("/help-request/{id}")
    public String matchVolunteer(@PathVariable Long id) {
        HelpRequest request = helpRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Help request not found"));

        List<Volunteer> volunteers = volunteerRepository.findAll();

        for (Volunteer volunteer : volunteers) {
            if (volunteer.getActive() != null &&
                    volunteer.getActive() &&
                    volunteer.getSkill() != null &&
                    request.getRequestType() != null &&
                    volunteer.getSkill().equalsIgnoreCase(request.getRequestType())) {
                request.setStatus("Matched");
                helpRequestRepository.save(request);

                return "Matched with " + volunteer.getName()
                        + " | Phone: " + volunteer.getPhone()
                        + " | Email: " + volunteer.getEmail()
                        + " | Available: " + volunteer.getAvailableDay()
                        + " at " + volunteer.getAvailableTime();
            }
        }

        return "No volunteer match found yet.";
    }
}