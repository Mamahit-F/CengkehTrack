package com.cengkihtrack.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class HarvestRecordRequest {

    @NotNull(message = "ID kebun tidak boleh kosong")
    private Long gardenId;

    @NotNull(message = "Tanggal panen tidak boleh kosong")
    private LocalDate harvestDate;

    @NotNull(message = "Jumlah panen tidak boleh kosong")
    @DecimalMin(value = "0.001", message = "Jumlah panen harus lebih dari 0")
    private BigDecimal quantityLiters;

    @Size(max = 20, message = "Grade kualitas maksimal 20 karakter")
    private String qualityGrade;

    private String notes;
}
