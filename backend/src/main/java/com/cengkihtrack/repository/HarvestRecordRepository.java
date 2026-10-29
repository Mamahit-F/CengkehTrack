package com.cengkihtrack.repository;

import com.cengkihtrack.entity.HarvestRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface HarvestRecordRepository extends JpaRepository<HarvestRecord, Long> {

    List<HarvestRecord> findByUserIdOrderByHarvestDateDesc(Long userId);

    Optional<HarvestRecord> findByIdAndUserId(Long id, Long userId);

    List<HarvestRecord> findByUserIdAndHarvestDateBetweenOrderByHarvestDateDesc(
            Long userId, LocalDate startDate, LocalDate endDate);

    @Query("SELECT COALESCE(SUM(h.quantityLiters), 0) FROM HarvestRecord h WHERE h.user.id = :userId")
    BigDecimal sumQuantityByUserId(@Param("userId") Long userId);

    @Query("SELECT COALESCE(SUM(h.quantityLiters), 0) FROM HarvestRecord h " +
           "WHERE h.user.id = :userId AND h.harvestDate BETWEEN :startDate AND :endDate")
    BigDecimal sumQuantityByUserIdAndDateRange(@Param("userId") Long userId,
                                               @Param("startDate") LocalDate startDate,
                                               @Param("endDate") LocalDate endDate);

    long countByUserId(Long userId);
}
