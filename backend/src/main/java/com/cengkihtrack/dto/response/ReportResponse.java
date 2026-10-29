package com.cengkihtrack.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReportResponse {

    private LocalDate startDate;
    private LocalDate endDate;

    private BigDecimal totalHarvestLiters;
    private long harvestCount;

    /** Pendapatan penjualan dalam periode. Bukan keuntungan. */
    private BigDecimal totalRevenue;
    private BigDecimal totalSoldLiters;
    private long saleCount;

    private List<HarvestRecordResponse> harvests;
    private List<SaleResponse> sales;
}
