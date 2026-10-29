package com.cengkihtrack.service;

import com.cengkihtrack.dto.request.GardenRequest;
import com.cengkihtrack.dto.response.GardenResponse;
import com.cengkihtrack.entity.Garden;
import com.cengkihtrack.entity.User;
import com.cengkihtrack.exception.ResourceNotFoundException;
import com.cengkihtrack.repository.GardenRepository;
import com.cengkihtrack.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GardenService {

    private final GardenRepository gardenRepository;
    private final UserRepository userRepository;

    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Pengguna tidak ditemukan: " + email));
    }

    @Transactional(readOnly = true)
    public List<GardenResponse> getAllGardens(String email) {
        User user = getUser(email);
        return gardenRepository.findByUserIdOrderByCreatedAtDesc(user.getId())
                .stream()
                .map(GardenResponse::from)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public GardenResponse getGardenById(Long id, String email) {
        User user = getUser(email);
        Garden garden = gardenRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Kebun", id));
        return GardenResponse.from(garden);
    }

    @Transactional
    public GardenResponse createGarden(GardenRequest request, String email) {
        User user = getUser(email);

        Garden garden = Garden.builder()
                .user(user)
                .name(request.getName())
                .location(request.getLocation())
                .areaHectares(request.getAreaHectares())
                .treeCount(request.getTreeCount())
                .notes(request.getNotes())
                .build();

        return GardenResponse.from(gardenRepository.save(garden));
    }

    @Transactional
    public GardenResponse updateGarden(Long id, GardenRequest request, String email) {
        User user = getUser(email);
        Garden garden = gardenRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Kebun", id));

        garden.setName(request.getName());
        garden.setLocation(request.getLocation());
        garden.setAreaHectares(request.getAreaHectares());
        garden.setTreeCount(request.getTreeCount());
        garden.setNotes(request.getNotes());

        return GardenResponse.from(gardenRepository.save(garden));
    }

    @Transactional
    public void deleteGarden(Long id, String email) {
        User user = getUser(email);
        Garden garden = gardenRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Kebun", id));
        gardenRepository.delete(garden);
    }
}
