package com.cengkihtrack.controller;

import com.cengkihtrack.dto.response.ApiResponse;
import com.cengkihtrack.dto.response.DashboardSummaryResponse;
import com.cengkihtrack.dto.response.ReportResponse;
import com.cengkihtrack.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @GetMapping("/api/dashboard/summary")
    public ResponseEntity<ApiResponse<DashboardSummaryResponse>> getDashboardSummary(
            @AuthenticationPrincipal UserDetails userDetails) {
        DashboardSummaryResponse summary = reportService.getDashboardSummary(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.ok(summary));
    }

    @GetMapping("/api/reports")
    public ResponseEntity<ApiResponse<ReportResponse>> getReport(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        ReportResponse report = reportService.getReport(userDetails.getUsername(), startDate, endDate);
        return ResponseEntity.ok(ApiResponse.ok(report));
    }
}
