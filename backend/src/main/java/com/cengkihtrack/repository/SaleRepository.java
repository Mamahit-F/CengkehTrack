package com.cengkihtrack.repository;

import com.cengkihtrack.entity.Sale;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface SaleRepository extends JpaRepository<Sale, Long> {

    List<Sale> findByUserIdOrderBySaleDateDesc(Long userId);

    Optional<Sale> findByIdAndUserId(Long id, Long userId);

    List<Sale> findByUserIdAndSaleDateBetweenOrderBySaleDateDesc(
            Long userId, LocalDate startDate, LocalDate endDate);

    @Query("SELECT COALESCE(SUM(s.totalPrice), 0) FROM Sale s WHERE s.user.id = :userId")
    BigDecimal sumTotalPriceByUserId(@Param("userId") Long userId);

    @Query("SELECT COALESCE(SUM(s.totalPrice), 0) FROM Sale s " +
           "WHERE s.user.id = :userId AND s.saleDate BETWEEN :startDate AND :endDate")
    BigDecimal sumTotalPriceByUserIdAndDateRange(@Param("userId") Long userId,
                                                  @Param("startDate") LocalDate startDate,
                                                  @Param("endDate") LocalDate endDate);

    @Query("SELECT COALESCE(SUM(s.quantityLiters), 0) FROM Sale s WHERE s.user.id = :userId")
    BigDecimal sumQuantityByUserId(@Param("userId") Long userId);

    long countByUserId(Long userId);
}
