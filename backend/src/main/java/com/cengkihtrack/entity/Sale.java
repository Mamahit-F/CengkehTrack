package com.cengkihtrack.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

@Entity
@Table(name = "sales")
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Sale {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "garden_id")
    private Garden garden;

    @Column(name = "sale_date", nullable = false)
    private LocalDate saleDate;

    @Column(name = "buyer_name", length = 150)
    private String buyerName;

    @Column(name = "quantity_liters", nullable = false, precision = 12, scale = 3)
    private BigDecimal quantityLiters;

    @Column(name = "price_per_liter", nullable = false, precision = 15, scale = 2)
    private BigDecimal pricePerLiter;

    /**
     * Dihitung ulang di server: quantityLiters * pricePerLiter.
     * Jangan mempercayai nilai dari frontend.
     */
    @Column(name = "total_price", nullable = false, precision = 18, scale = 2)
    private BigDecimal totalPrice;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @CreatedDate
    @Column(name = "created_at", updatable = false)
    private Instant createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private Instant updatedAt;
}
