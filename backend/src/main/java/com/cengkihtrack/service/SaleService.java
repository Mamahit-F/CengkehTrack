package com.cengkihtrack.service;

import com.cengkihtrack.dto.request.SaleRequest;
import com.cengkihtrack.dto.response.SaleResponse;
import com.cengkihtrack.entity.Garden;
import com.cengkihtrack.entity.Sale;
import com.cengkihtrack.entity.User;
import com.cengkihtrack.exception.BadRequestException;
import com.cengkihtrack.exception.ResourceNotFoundException;
import com.cengkihtrack.repository.GardenRepository;
import com.cengkihtrack.repository.SaleRepository;
import com.cengkihtrack.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SaleService {

    private final SaleRepository saleRepository;
    private final GardenRepository gardenRepository;
    private final UserRepository userRepository;

    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Pengguna tidak ditemukan: " + email));
    }

    /**
     * Server selalu menghitung ulang totalPrice dari quantityLiters * pricePerLiter.
     * Nilai dari frontend tidak dipercaya.
     */
    private BigDecimal computeTotal(BigDecimal quantity, BigDecimal pricePerLiter) {
        return quantity.multiply(pricePerLiter).setScale(2, RoundingMode.HALF_UP);
    }

    @Transactional(readOnly = true)
    public List<SaleResponse> getAllSales(String email) {
        User user = getUser(email);
        return saleRepository.findByUserIdOrderBySaleDateDesc(user.getId())
                .stream()
                .map(SaleResponse::from)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public SaleResponse getSaleById(Long id, String email) {
        User user = getUser(email);
        Sale sale = saleRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Penjualan", id));
        return SaleResponse.from(sale);
    }

    @Transactional
    public SaleResponse createSale(SaleRequest request, String email) {
        User user = getUser(email);

        Garden garden = null;
        if (request.getGardenId() != null) {
            garden = gardenRepository.findByIdAndUserId(request.getGardenId(), user.getId())
                    .orElseThrow(() -> new BadRequestException("Kebun tidak ditemukan atau bukan milik Anda"));
        }

        BigDecimal totalPrice = computeTotal(request.getQuantityLiters(), request.getPricePerLiter());

        Sale sale = Sale.builder()
                .user(user)
                .garden(garden)
                .saleDate(request.getSaleDate())
                .buyerName(request.getBuyerName())
                .quantityLiters(request.getQuantityLiters())
                .pricePerLiter(request.getPricePerLiter())
                .totalPrice(totalPrice)
                .notes(request.getNotes())
                .build();

        return SaleResponse.from(saleRepository.save(sale));
    }

    @Transactional
    public SaleResponse updateSale(Long id, SaleRequest request, String email) {
        User user = getUser(email);
        Sale sale = saleRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Penjualan", id));

        Garden garden = null;
        if (request.getGardenId() != null) {
            garden = gardenRepository.findByIdAndUserId(request.getGardenId(), user.getId())
                    .orElseThrow(() -> new BadRequestException("Kebun tidak ditemukan atau bukan milik Anda"));
        }

        BigDecimal totalPrice = computeTotal(request.getQuantityLiters(), request.getPricePerLiter());

        sale.setGarden(garden);
        sale.setSaleDate(request.getSaleDate());
        sale.setBuyerName(request.getBuyerName());
        sale.setQuantityLiters(request.getQuantityLiters());
        sale.setPricePerLiter(request.getPricePerLiter());
        sale.setTotalPrice(totalPrice);
        sale.setNotes(request.getNotes());

        return SaleResponse.from(saleRepository.save(sale));
    }

    @Transactional
    public void deleteSale(Long id, String email) {
        User user = getUser(email);
        Sale sale = saleRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Penjualan", id));
        saleRepository.delete(sale);
    }
}
