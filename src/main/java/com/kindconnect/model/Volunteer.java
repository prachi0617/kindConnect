package com.kindconnect.model;

import jakarta.persistence.*;

@Entity
public class Volunteer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String email;
    private String phone;
    private String skill;
    private String availableDay;
    private String availableTime;

    @Column(length = 1000)
    private String note;

    private Boolean active = true;

    public Volunteer() {
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public String getPhone() {
        return phone;
    }

    public String getSkill() {
        return skill;
    }

    public String getAvailableDay() {
        return availableDay;
    }

    public String getAvailableTime() {
        return availableTime;
    }

    public String getNote() {
        return note;
    }

    public Boolean getActive() {
        return active;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public void setSkill(String skill) {
        this.skill = skill;
    }

    public void setAvailableDay(String availableDay) {
        this.availableDay = availableDay;
    }

    public void setAvailableTime(String availableTime) {
        this.availableTime = availableTime;
    }

    public void setNote(String note) {
        this.note = note;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }
}