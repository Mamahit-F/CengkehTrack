package com.cengkihtrack.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class SaleRequest {

    private Long gardenId;

    @NotNull(message = "Tanggal penjualan tidak boleh kosong")
    private LocalDate saleDate;

    @Size(max = 150, message = "Nama pembeli maksimal 150 karakter")
    private String buyerName;

    @NotNull(message = "Jumlah penjualan tidak boleh kosong")
    @DecimalMin(value = "0.001", message = "Jumlah penjualan harus lebih dari 0")
    private BigDecimal quantityLiters;

    @NotNull(message = "Harga per liter tidak boleh kosong")
    @DecimalMin(value = "0", inclusive = true, message = "Harga per liter tidak boleh negatif")
    private BigDecimal pricePerLiter;

    // totalPrice TIDAK dikirim dari frontend — dihitung ulang di server
    private String notes;
}
