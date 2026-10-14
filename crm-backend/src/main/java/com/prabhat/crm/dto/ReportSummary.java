package com.prabhat.crm.dto;

import com.prabhat.crm.model.ContactStatus;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

public record ReportSummary(
        long totalContacts,
        long closedContacts,
        double conversionRate,
        long needsFollowUp,
        BigDecimal closedRevenue,
        BigDecimal pipelineValue,
        Map<ContactStatus, Long> contactsByStatus,
        List<CompanyCount> topCompanies
) {}