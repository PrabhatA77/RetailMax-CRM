package com.prabhat.crm.service;

import com.prabhat.crm.exception.ResourceNotFoundException;
import com.prabhat.crm.model.Contact;
import com.prabhat.crm.model.ContactStatus;
import com.prabhat.crm.repository.ContactRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ContactService {

    @Autowired
    private ContactRepository contactRepository;

    // Reads crm.automation.followup-days from application.properties (default 3)
    @Value("${crm.automation.followup-days:3}")
    private int followUpDays;

    public List<Contact> getAllContacts() {
        List<Contact> contacts = contactRepository.findAll();
        contacts.forEach(this::applyRules);
        return contacts;
    }

    public Contact getContactById(Long id) {
        Contact contact = contactRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Contact not found with id: " + id));
        return applyRules(contact);
    }

    public Contact createContact(Contact contact) {
        contact.setStatus(ContactStatus.NEW); // every new lead starts at the beginning of the pipeline
        contact.setStatusChangedAt(LocalDateTime.now()); // rule 1
        return contactRepository.save(contact);
    }

    public Contact updateContact(Long id, Contact updatedContact) {
        Contact contact = getContactById(id);
        contact.setName(updatedContact.getName());
        contact.setEmail(updatedContact.getEmail());
        contact.setPhone(updatedContact.getPhone());
        contact.setCompany(updatedContact.getCompany());
        return applyRules(contactRepository.save(contact));
    }

    public Contact updateStatus(Long id, ContactStatus status) {
        Contact contact = getContactById(id);
        if (contact.getStatus() != status) {
            contact.setStatus(status);
            contact.setStatusChangedAt(LocalDateTime.now()); // rule 1: auto-stamp on real changes only
        }
        return applyRules(contactRepository.save(contact));
    }

    public void deleteContact(Long id) {
        if (!contactRepository.existsById(id)) {
            throw new ResourceNotFoundException("Contact not found with id: " + id);
        }
        contactRepository.deleteById(id);
    }

    // Rule 2: an open contact with no status change for N days needs a follow-up
    private Contact applyRules(Contact contact) {
        boolean isOpen = contact.getStatus() != ContactStatus.CLOSED;
        LocalDateTime changedAt = contact.getStatusChangedAt();
        boolean stale = changedAt != null
                && changedAt.isBefore(LocalDateTime.now().minusDays(followUpDays));
        contact.setNeedsFollowUp(isOpen && stale);
        return contact;
    }
}