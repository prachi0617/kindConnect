package com.kindconnect.service;

import com.kindconnect.dto.MoodSupportResponse;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MoodSupportService {

    public MoodSupportResponse getSupportForMood(String mood) {
        if (mood == null) {
            mood = "";
        }

        String cleanMood = mood.trim().toLowerCase();

        if (cleanMood.equals("sad")) {
            return new MoodSupportResponse(
                    "Sad",
                    "💙 A Little Smile For You",
                    "Feeling sad is okay. Let’s try something small that can help your heart feel lighter.",
                    "Sad Mood Flyer",
                    List.of(
                            "😂 Watch a laugh video",
                            "🎵 Play a happy playlist",
                            "🎤 Read a quick funny talk",
                            "🌟 Remember: this feeling will pass"),
                    List.of(
                            "Laugh Video",
                            "Happy Playlist",
                            "Funny Talk"));
        }

        if (cleanMood.equals("lonely")) {
            return new MoodSupportResponse(
                    "Lonely",
                    "💜 You Are Not Alone",
                    "Feeling lonely happens, but you do not have to sit with it alone. Try one connection step right now.",
                    "Lonely Support Flyer",
                    List.of(
                            "☎️ Request a friendly call",
                            "🎬 Watch comfort movie clips",
                            "😂 Watch something funny",
                            "💬 Read a kind message"),
                    List.of(
                            "Friendly Call",
                            "Comfort Movie",
                            "Kind Talk"));
        }

        if (cleanMood.equals("stressed")) {
            return new MoodSupportResponse(
                    "Stressed",
                    "🌿 Pause. Breathe. Reset.",
                    "Stress can feel heavy. Let’s give your mind a short break with something relaxing or fun.",
                    "Stress Relief Flyer",
                    List.of(
                            "🌬️ Take 3 slow breaths",
                            "😂 Watch one funny video",
                            "🎵 Listen to calm music",
                            "🎤 Find concerts or events near you"),
                    List.of(
                            "Relaxing Music",
                            "Concerts Near Me",
                            "Funny Break"));
        }

        return new MoodSupportResponse(
                "General",
                "💙 Thank you for checking in",
                "KindConnect is here to support you.",
                "General Support",
                List.of(
                        "Take one small step",
                        "Drink water",
                        "Take a breath"),
                List.of(
                        "Resources",
                        "Friendly Call"));
    }
}
