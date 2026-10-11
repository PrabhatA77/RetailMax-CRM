package com.prabhat.crm.service;

import com.prabhat.crm.dto.CompanyCount;
import com.prabhat.crm.dto.ReportSummary;
import com.prabhat.crm.dto.StatusCount;
import com.prabhat.crm.model.Contact;
import com.prabhat.crm.model.ContactStatus;
import com.prabhat.crm.repository.ContactRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.EnumMap;
import java.util.List;
import java.util.Map;

@Service
public class ReportService {

    @Autowired
    private ContactRepository contactRepository;

    @Autowired
    private ContactService contactService;

    public ReportSummary getSummary() {
        // Start every status at 0 so the chart always has all four bars
        Map<ContactStatus, Long> byStatus = new EnumMap<>(ContactStatus.class);
        for (ContactStatus status : ContactStatus.values()) {
            byStatus.put(status, 0L);
        }

        for (StatusCount row : contactRepository.countContactsByStatus()) {
            // older rows saved before the status column existed count as NEW
            ContactStatus status = row.status() == null ? ContactStatus.NEW : row.status();
            byStatus.merge(status, row.count(), Long::sum);
        }

        long total = byStatus.values().stream().mapToLong(Long::longValue).sum();
        long closed = byStatus.get(ContactStatus.CLOSED);
        double conversionRate = total == 0 ? 0 : Math.round(closed * 1000.0 / total) / 10.0;

        // Reuse the automation rule from ContactService instead of repeating it here
        long needsFollowUp = contactService.getAllContacts().stream()
                .filter(Contact::isNeedsFollowUp)
                .count();

        List<CompanyCount> topCompanies = contactRepository.findTopCompanies(PageRequest.of(0, 5));

        return new ReportSummary(total, closed, conversionRate, needsFollowUp, byStatus, topCompanies);
    }
}