package com.prabhat.crm.controller;

import com.prabhat.crm.model.Contact;
import com.prabhat.crm.model.ContactStatus;
import com.prabhat.crm.service.ContactService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/contacts")
public class ContactController {

    @Autowired
    private ContactService contactService;

    // Request body for PATCH /api/contacts/{id}/status  ->  { "status": "CONTACTED" }
    public record StatusUpdateRequest(@NotNull(message = "Status is required") ContactStatus status) {}

    @GetMapping
    public List<Contact> getAllContacts() {
        return contactService.getAllContacts();
    }

    @GetMapping("/{id}")
    public Contact getContactById(@PathVariable Long id) {
        return contactService.getContactById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Contact createContact(@Valid @RequestBody Contact contact) {
        return contactService.createContact(contact);
    }

    @PutMapping("/{id}")
    public Contact updateContact(@PathVariable Long id, @Valid @RequestBody Contact contact) {
        return contactService.updateContact(id, contact);
    }

    @PatchMapping("/{id}/status")
    public Contact updateStatus(@PathVariable Long id, @Valid @RequestBody StatusUpdateRequest request) {
        return contactService.updateStatus(id, request.status());
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteContact(@PathVariable Long id) {
        contactService.deleteContact(id);
    }
}