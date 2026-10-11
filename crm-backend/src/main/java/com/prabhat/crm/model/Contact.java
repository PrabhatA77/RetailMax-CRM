package com.prabhat.crm.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

import java.time.LocalDateTime;

@Entity
@Table(name = "CONTACTS")
public class Contact {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Name is required")
    @Column(nullable = false)
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Email is not valid")
    @Column(nullable = false, unique = true)
    private String email;

    private String phone;
    private String company;

    @Enumerated(EnumType.STRING)
    private ContactStatus status = ContactStatus.NEW;

    // Set automatically by the backend whenever the status changes (automation rule 1)
    private LocalDateTime statusChangedAt;

    // Calculated on read (automation rule 2), not stored in the database
    @Transient
    private boolean needsFollowUp;

    public Contact() {}

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getCompany() { return company; }
    public void setCompany(String company) { this.company = company; }

    // Older rows have no status in the DB yet, so treat "empty" as NEW
    public ContactStatus getStatus() {
        return status == null ? ContactStatus.NEW : status;
    }
    public void setStatus(ContactStatus status) { this.status = status; }

    public LocalDateTime getStatusChangedAt() { return statusChangedAt; }
    public void setStatusChangedAt(LocalDateTime statusChangedAt) { this.statusChangedAt = statusChangedAt; }

    public boolean isNeedsFollowUp() { return needsFollowUp; }
    public void setNeedsFollowUp(boolean needsFollowUp) { this.needsFollowUp = needsFollowUp; }
}