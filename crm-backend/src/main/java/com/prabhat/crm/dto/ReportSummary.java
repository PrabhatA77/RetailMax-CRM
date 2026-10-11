package com.prabhat.crm.dto;

import com.prabhat.crm.model.ContactStatus;

import java.util.List;
import java.util.Map;

public record ReportSummary(
        long totalContacts,
        long closedContacts,
        double conversionRate,
        long needsFollowUp,
        Map<ContactStatus, Long> contactsByStatus,
        List<CompanyCount> topCompanies
) {}