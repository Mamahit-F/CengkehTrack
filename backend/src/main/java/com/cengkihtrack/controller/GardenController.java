package com.cengkihtrack.controller;

import com.cengkihtrack.dto.request.GardenRequest;
import com.cengkihtrack.dto.response.ApiResponse;
import com.cengkihtrack.dto.response.GardenResponse;
import com.cengkihtrack.service.GardenService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/gardens")
@RequiredArgsConstructor
public class GardenController {

    private final GardenService gardenService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<GardenResponse>>> getAll(
            @AuthenticationPrincipal UserDetails userDetails) {
        List<GardenResponse> gardens = gardenService.getAllGardens(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.ok(gardens));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<GardenResponse>> getById(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        GardenResponse garden = gardenService.getGardenById(id, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.ok(garden));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<GardenResponse>> create(
            @Valid @RequestBody GardenRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        GardenResponse garden = gardenService.createGarden(request, userDetails.getUsername());
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok(garden, "Kebun berhasil ditambahkan"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<GardenResponse>> update(
            @PathVariable Long id,
            @Valid @RequestBody GardenRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        GardenResponse garden = gardenService.updateGarden(id, request, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.ok(garden, "Kebun berhasil diperbarui"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        gardenService.deleteGarden(id, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.ok(null, "Kebun berhasil dihapus"));
    }
}
