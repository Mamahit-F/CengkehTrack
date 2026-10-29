package com.cengkihtrack.controller;

import com.cengkihtrack.dto.request.HarvestRecordRequest;
import com.cengkihtrack.dto.response.ApiResponse;
import com.cengkihtrack.dto.response.HarvestRecordResponse;
import com.cengkihtrack.service.HarvestRecordService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/harvest-records")
@RequiredArgsConstructor
public class HarvestRecordController {

    private final HarvestRecordService harvestRecordService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<HarvestRecordResponse>>> getAll(
            @AuthenticationPrincipal UserDetails userDetails) {
        List<HarvestRecordResponse> records = harvestRecordService.getAllHarvestRecords(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.ok(records));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<HarvestRecordResponse>> getById(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        HarvestRecordResponse record = harvestRecordService.getHarvestRecordById(id, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.ok(record));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<HarvestRecordResponse>> create(
            @Valid @RequestBody HarvestRecordRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        HarvestRecordResponse record = harvestRecordService.createHarvestRecord(request, userDetails.getUsername());
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok(record, "Catatan panen berhasil ditambahkan"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<HarvestRecordResponse>> update(
            @PathVariable Long id,
            @Valid @RequestBody HarvestRecordRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        HarvestRecordResponse record = harvestRecordService.updateHarvestRecord(id, request, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.ok(record, "Catatan panen berhasil diperbarui"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        harvestRecordService.deleteHarvestRecord(id, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.ok(null, "Catatan panen berhasil dihapus"));
    }
}
