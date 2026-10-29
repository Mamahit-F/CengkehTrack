package com.cengkihtrack.service;

import com.cengkihtrack.dto.request.SaleRequest;
import com.cengkihtrack.dto.response.SaleResponse;
import com.cengkihtrack.entity.Garden;
import com.cengkihtrack.entity.Sale;
import com.cengkihtrack.entity.User;
import com.cengkihtrack.exception.ResourceNotFoundException;
import com.cengkihtrack.repository.GardenRepository;
import com.cengkihtrack.repository.SaleRepository;
import com.cengkihtrack.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("SaleService - Unit Tests")
class SaleServiceTest {

    @Mock private SaleRepository saleRepository;
    @Mock private GardenRepository gardenRepository;
    @Mock private UserRepository userRepository;

    @InjectMocks private SaleService saleService;

    private User testUser;
    private Garden testGarden;

    @BeforeEach
    void setUp() {
        testUser = User.builder()
                .id(1L)
                .name("Budi Santoso")
                .email("budi@example.com")
                .password("hashed")
                .role(User.Role.USER)
                .build();

        testGarden = Garden.builder()
                .id(1L)
                .user(testUser)
                .name("Kebun Utara")
                .areaHectares(new BigDecimal("2.5"))
                .build();
    }

    @Test
    @DisplayName("createSale - total dihitung server: quantity * pricePerLiter")
    void createSale_shouldComputeTotalServerSide() {
        // Arrange
        SaleRequest request = new SaleRequest();
        request.setGardenId(1L);
        request.setSaleDate(LocalDate.of(2024, 1, 15));
        request.setBuyerName("Pembeli A");
        request.setQuantityLiters(new BigDecimal("10.5"));
        request.setPricePerLiter(new BigDecimal("50000"));
        request.setNotes("Penjualan pertama");

        when(userRepository.findByEmail("budi@example.com")).thenReturn(Optional.of(testUser));
        when(gardenRepository.findByIdAndUserId(1L, 1L)).thenReturn(Optional.of(testGarden));
        when(saleRepository.save(any(Sale.class))).thenAnswer(inv -> {
            Sale s = inv.getArgument(0);
            s.setId(1L);
            return s;
        });

        // Act
        SaleResponse response = saleService.createSale(request, "budi@example.com");

        // Assert
        // 10.5 * 50000 = 525000.00
        assertThat(response.getTotalPrice()).isEqualByComparingTo(new BigDecimal("525000.00"));
        assertThat(response.getQuantityLiters()).isEqualByComparingTo(new BigDecimal("10.5"));
        assertThat(response.getPricePerLiter()).isEqualByComparingTo(new BigDecimal("50000"));
        verify(saleRepository, times(1)).save(any(Sale.class));
    }

    @Test
    @DisplayName("createSale - total dihitung ulang, bukan dari frontend")
    void createSale_totalIsAlwaysServerComputed() {
        // Arrange: frontend mengirim quantity & price, totalPrice TIDAK dikirim (tidak ada di request)
        SaleRequest request = new SaleRequest();
        request.setSaleDate(LocalDate.now());
        request.setQuantityLiters(new BigDecimal("5.0"));
        request.setPricePerLiter(new BigDecimal("100000"));
        // gardenId null — tidak wajib

        when(userRepository.findByEmail("budi@example.com")).thenReturn(Optional.of(testUser));
        when(saleRepository.save(any(Sale.class))).thenAnswer(inv -> {
            Sale s = inv.getArgument(0);
            s.setId(2L);
            return s;
        });

        // Act
        SaleResponse response = saleService.createSale(request, "budi@example.com");

        // Assert: 5.0 * 100000 = 500000.00
        assertThat(response.getTotalPrice()).isEqualByComparingTo(new BigDecimal("500000.00"));
    }

    @Test
    @DisplayName("getSaleById - throws ResourceNotFoundException jika tidak ditemukan")
    void getSaleById_notFound_shouldThrow() {
        when(userRepository.findByEmail("budi@example.com")).thenReturn(Optional.of(testUser));
        when(saleRepository.findByIdAndUserId(99L, 1L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> saleService.getSaleById(99L, "budi@example.com"))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    @DisplayName("deleteSale - memanggil repository delete")
    void deleteSale_shouldCallRepositoryDelete() {
        Sale sale = Sale.builder()
                .id(1L)
                .user(testUser)
                .garden(testGarden)
                .saleDate(LocalDate.now())
                .quantityLiters(new BigDecimal("5"))
                .pricePerLiter(new BigDecimal("50000"))
                .totalPrice(new BigDecimal("250000"))
                .build();

        when(userRepository.findByEmail("budi@example.com")).thenReturn(Optional.of(testUser));
        when(saleRepository.findByIdAndUserId(1L, 1L)).thenReturn(Optional.of(sale));

        saleService.deleteSale(1L, "budi@example.com");

        verify(saleRepository, times(1)).delete(sale);
    }
}
