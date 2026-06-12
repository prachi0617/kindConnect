package com.kindconnect.controller;

import com.kindconnect.dto.MoodSupportResponse;
import com.kindconnect.service.MoodSupportService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/mood-support")
@CrossOrigin(origins = "*")
public class MoodSupportController {

    private final MoodSupportService moodSupportService;

    public MoodSupportController(MoodSupportService moodSupportService) {
        this.moodSupportService = moodSupportService;
    }

    @GetMapping("/{mood}")
    public MoodSupportResponse getMoodSupport(@PathVariable String mood) {
        return moodSupportService.getSupportForMood(mood);
    }
}