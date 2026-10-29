package com.cengkihtrack.controller;

import com.cengkihtrack.dto.request.SaleRequest;
import com.cengkihtrack.dto.response.ApiResponse;
import com.cengkihtrack.dto.response.SaleResponse;
import com.cengkihtrack.service.SaleService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sales")
@RequiredArgsConstructor
public class SaleController {

    private final SaleService saleService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<SaleResponse>>> getAll(
            @AuthenticationPrincipal UserDetails userDetails) {
        List<SaleResponse> sales = saleService.getAllSales(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.ok(sales));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<SaleResponse>> getById(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        SaleResponse sale = saleService.getSaleById(id, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.ok(sale));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<SaleResponse>> create(
            @Valid @RequestBody SaleRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        SaleResponse sale = saleService.createSale(request, userDetails.getUsername());
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok(sale, "Penjualan berhasil dicatat"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<SaleResponse>> update(
            @PathVariable Long id,
            @Valid @RequestBody SaleRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        SaleResponse sale = saleService.updateSale(id, request, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.ok(sale, "Penjualan berhasil diperbarui"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        saleService.deleteSale(id, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.ok(null, "Penjualan berhasil dihapus"));
    }
}
