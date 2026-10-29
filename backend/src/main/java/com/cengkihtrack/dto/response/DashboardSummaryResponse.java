package com.cengkihtrack.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardSummaryResponse {

    private long totalGardens;
    private long totalHarvestRecords;
    private BigDecimal totalHarvestLiters;
    private long totalSales;
    /** Pendapatan penjualan — BUKAN keuntungan bersih (biaya belum dicatat) */
    private BigDecimal totalRevenue;
    private BigDecimal totalSoldLiters;
}
