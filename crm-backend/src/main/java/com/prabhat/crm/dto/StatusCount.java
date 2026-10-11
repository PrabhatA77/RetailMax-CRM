package com.prabhat.crm.dto;

import com.prabhat.crm.model.ContactStatus;

public record StatusCount(ContactStatus status, Long count) {}