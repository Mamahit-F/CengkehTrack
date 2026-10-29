package com.cengkihtrack.dto.response;

import com.cengkihtrack.entity.HarvestRecord;
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
public class HarvestRecordResponse {

    private Long id;
    private Long gardenId;
    private String gardenName;
    private LocalDate harvestDate;
    private BigDecimal quantityLiters;
    private String qualityGrade;
    private String notes;
    private Instant createdAt;
    private Instant updatedAt;

    public static HarvestRecordResponse from(HarvestRecord record) {
        return HarvestRecordResponse.builder()
                .id(record.getId())
                .gardenId(record.getGarden().getId())
                .gardenName(record.getGarden().getName())
                .harvestDate(record.getHarvestDate())
                .quantityLiters(record.getQuantityLiters())
                .qualityGrade(record.getQualityGrade())
                .notes(record.getNotes())
                .createdAt(record.getCreatedAt())
                .updatedAt(record.getUpdatedAt())
                .build();
    }
}
