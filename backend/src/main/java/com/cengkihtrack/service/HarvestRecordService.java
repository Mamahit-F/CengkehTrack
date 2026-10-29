package com.cengkihtrack.service;

import com.cengkihtrack.dto.request.HarvestRecordRequest;
import com.cengkihtrack.dto.response.HarvestRecordResponse;
import com.cengkihtrack.entity.Garden;
import com.cengkihtrack.entity.HarvestRecord;
import com.cengkihtrack.entity.User;
import com.cengkihtrack.exception.BadRequestException;
import com.cengkihtrack.exception.ResourceNotFoundException;
import com.cengkihtrack.repository.GardenRepository;
import com.cengkihtrack.repository.HarvestRecordRepository;
import com.cengkihtrack.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class HarvestRecordService {

    private final HarvestRecordRepository harvestRecordRepository;
    private final GardenRepository gardenRepository;
    private final UserRepository userRepository;

    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Pengguna tidak ditemukan: " + email));
    }

    @Transactional(readOnly = true)
    public List<HarvestRecordResponse> getAllHarvestRecords(String email) {
        User user = getUser(email);
        return harvestRecordRepository.findByUserIdOrderByHarvestDateDesc(user.getId())
                .stream()
                .map(HarvestRecordResponse::from)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public HarvestRecordResponse getHarvestRecordById(Long id, String email) {
        User user = getUser(email);
        HarvestRecord record = harvestRecordRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Catatan panen", id));
        return HarvestRecordResponse.from(record);
    }

    @Transactional
    public HarvestRecordResponse createHarvestRecord(HarvestRecordRequest request, String email) {
        User user = getUser(email);
        Garden garden = gardenRepository.findByIdAndUserId(request.getGardenId(), user.getId())
                .orElseThrow(() -> new BadRequestException("Kebun tidak ditemukan atau bukan milik Anda"));

        HarvestRecord record = HarvestRecord.builder()
                .user(user)
                .garden(garden)
                .harvestDate(request.getHarvestDate())
                .quantityLiters(request.getQuantityLiters())
                .qualityGrade(request.getQualityGrade())
                .notes(request.getNotes())
                .build();

        return HarvestRecordResponse.from(harvestRecordRepository.save(record));
    }

    @Transactional
    public HarvestRecordResponse updateHarvestRecord(Long id, HarvestRecordRequest request, String email) {
        User user = getUser(email);
        HarvestRecord record = harvestRecordRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Catatan panen", id));

        Garden garden = gardenRepository.findByIdAndUserId(request.getGardenId(), user.getId())
                .orElseThrow(() -> new BadRequestException("Kebun tidak ditemukan atau bukan milik Anda"));

        record.setGarden(garden);
        record.setHarvestDate(request.getHarvestDate());
        record.setQuantityLiters(request.getQuantityLiters());
        record.setQualityGrade(request.getQualityGrade());
        record.setNotes(request.getNotes());

        return HarvestRecordResponse.from(harvestRecordRepository.save(record));
    }

    @Transactional
    public void deleteHarvestRecord(Long id, String email) {
        User user = getUser(email);
        HarvestRecord record = harvestRecordRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Catatan panen", id));
        harvestRecordRepository.delete(record);
    }
}
