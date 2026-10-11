package com.prabhat.crm.controller;

import com.prabhat.crm.dto.ReportSummary;
import com.prabhat.crm.service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    @Autowired
    private ReportService reportService;

    @GetMapping("/summary")
    public ReportSummary getSummary() {
        return reportService.getSummary();
    }
}