package com.kindconnect.dto;

import java.util.List;

public class MoodSupportResponse {

    private String mood;
    private String title;
    private String message;
    private String flyerTitle;
    private List<String> suggestions;
    private List<String> buttons;

    public MoodSupportResponse() {
    }

    public MoodSupportResponse(String mood, String title, String message, String flyerTitle,
            List<String> suggestions, List<String> buttons) {
        this.mood = mood;
        this.title = title;
        this.message = message;
        this.flyerTitle = flyerTitle;
        this.suggestions = suggestions;
        this.buttons = buttons;
    }

    public String getMood() {
        return mood;
    }

    public String getTitle() {
        return title;
    }

    public String getMessage() {
        return message;
    }

    public String getFlyerTitle() {
        return flyerTitle;
    }

    public List<String> getSuggestions() {
        return suggestions;
    }

    public List<String> getButtons() {
        return buttons;
    }

    public void setMood(String mood) {
        this.mood = mood;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public void setFlyerTitle(String flyerTitle) {
        this.flyerTitle = flyerTitle;
    }

    public void setSuggestions(List<String> suggestions) {
        this.suggestions = suggestions;
    }

    public void setButtons(List<String> buttons) {
        this.buttons = buttons;
    }
}
