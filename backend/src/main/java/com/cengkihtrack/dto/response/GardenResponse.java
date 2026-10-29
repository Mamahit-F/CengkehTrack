package com.cengkihtrack.dto.response;

import com.cengkihtrack.entity.Garden;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GardenResponse {

    private Long id;
    private String name;
    private String location;
    private BigDecimal areaHectares;
    private Integer treeCount;
    private String notes;
    private Instant createdAt;
    private Instant updatedAt;

    public static GardenResponse from(Garden garden) {
        return GardenResponse.builder()
                .id(garden.getId())
                .name(garden.getName())
                .location(garden.getLocation())
                .areaHectares(garden.getAreaHectares())
                .treeCount(garden.getTreeCount())
                .notes(garden.getNotes())
                .createdAt(garden.getCreatedAt())
                .updatedAt(garden.getUpdatedAt())
                .build();
    }
}
