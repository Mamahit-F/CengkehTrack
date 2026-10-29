package com.cengkihtrack.service;

import com.cengkihtrack.dto.response.DashboardSummaryResponse;
import com.cengkihtrack.dto.response.ReportResponse;
import com.cengkihtrack.dto.response.HarvestRecordResponse;
import com.cengkihtrack.dto.response.SaleResponse;
import com.cengkihtrack.entity.User;
import com.cengkihtrack.exception.BadRequestException;
import com.cengkihtrack.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final UserRepository userRepository;
    private final GardenRepository gardenRepository;
    private final HarvestRecordRepository harvestRecordRepository;
    private final SaleRepository saleRepository;

    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Pengguna tidak ditemukan: " + email));
    }

    @Transactional(readOnly = true)
    public DashboardSummaryResponse getDashboardSummary(String email) {
        User user = getUser(email);
        Long userId = user.getId();

        return DashboardSummaryResponse.builder()
                .totalGardens(gardenRepository.countByUserId(userId))
                .totalHarvestRecords(harvestRecordRepository.countByUserId(userId))
                .totalHarvestLiters(harvestRecordRepository.sumQuantityByUserId(userId))
                .totalSales(saleRepository.countByUserId(userId))
                .totalRevenue(saleRepository.sumTotalPriceByUserId(userId))
                .totalSoldLiters(saleRepository.sumQuantityByUserId(userId))
                .build();
    }

    @Transactional(readOnly = true)
    public ReportResponse getReport(String email, LocalDate startDate, LocalDate endDate) {
        if (startDate.isAfter(endDate)) {
            throw new BadRequestException("Tanggal awal tidak boleh setelah tanggal akhir");
        }

        User user = getUser(email);
        Long userId = user.getId();

        List<HarvestRecordResponse> harvests = harvestRecordRepository
                .findByUserIdAndHarvestDateBetweenOrderByHarvestDateDesc(userId, startDate, endDate)
                .stream()
                .map(HarvestRecordResponse::from)
                .collect(Collectors.toList());

        List<SaleResponse> sales = saleRepository
                .findByUserIdAndSaleDateBetweenOrderBySaleDateDesc(userId, startDate, endDate)
                .stream()
                .map(SaleResponse::from)
                .collect(Collectors.toList());

        return ReportResponse.builder()
                .startDate(startDate)
                .endDate(endDate)
                .totalHarvestLiters(harvestRecordRepository.sumQuantityByUserIdAndDateRange(userId, startDate, endDate))
                .harvestCount(harvests.size())
                .totalRevenue(saleRepository.sumTotalPriceByUserIdAndDateRange(userId, startDate, endDate))
                .totalSoldLiters(saleRepository.sumQuantityByUserId(userId))
                .saleCount(sales.size())
                .harvests(harvests)
                .sales(sales)
                .build();
    }
}
