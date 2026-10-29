package com.cengkihtrack.dto.response;

import com.cengkihtrack.entity.Sale;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SaleResponse {

    private Long id;
    private Long gardenId;
    private String gardenName;
    private LocalDate saleDate;
    private String buyerName;
    private BigDecimal quantityLiters;
    private BigDecimal pricePerLiter;
    private BigDecimal totalPrice;
    private String notes;
    private Instant createdAt;
    private Instant updatedAt;

    public static SaleResponse from(Sale sale) {
        return SaleResponse.builder()
                .id(sale.getId())
                .gardenId(sale.getGarden() != null ? sale.getGarden().getId() : null)
                .gardenName(sale.getGarden() != null ? sale.getGarden().getName() : null)
                .saleDate(sale.getSaleDate())
                .buyerName(sale.getBuyerName())
                .quantityLiters(sale.getQuantityLiters())
                .pricePerLiter(sale.getPricePerLiter())
                .totalPrice(sale.getTotalPrice())
                .notes(sale.getNotes())
                .createdAt(sale.getCreatedAt())
                .updatedAt(sale.getUpdatedAt())
                .build();
    }
}
