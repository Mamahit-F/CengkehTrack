package com.cengkihtrack.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class GardenRequest {

    @NotBlank(message = "Nama kebun tidak boleh kosong")
    @Size(max = 150, message = "Nama kebun maksimal 150 karakter")
    private String name;

    @Size(max = 255, message = "Lokasi maksimal 255 karakter")
    private String location;

    @NotNull(message = "Luas kebun tidak boleh kosong")
    @DecimalMin(value = "0.0001", message = "Luas kebun harus lebih dari 0")
    private BigDecimal areaHectares;

    private Integer treeCount;

    private String notes;
}
