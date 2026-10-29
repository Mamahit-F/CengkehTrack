package com.cengkihtrack.repository;

import com.cengkihtrack.entity.Garden;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GardenRepository extends JpaRepository<Garden, Long> {

    List<Garden> findByUserIdOrderByCreatedAtDesc(Long userId);

    Optional<Garden> findByIdAndUserId(Long id, Long userId);

    boolean existsByIdAndUserId(Long id, Long userId);

    long countByUserId(Long userId);
}
