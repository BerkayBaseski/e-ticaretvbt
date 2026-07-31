package com.eticaret.backend.modules.banner;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/banners")
@CrossOrigin(origins = "*")
public class BannerController {

    @Autowired
    private BannerRepository bannerRepository;

    @GetMapping
    public List<Banner> getBanners(@RequestParam(required = false) String position) {
        if (position != null && !position.isBlank()) {
            try {
                Banner.BannerPosition pos = Banner.BannerPosition.valueOf(position.toUpperCase());
                return bannerRepository.findByIsActiveTrueAndPositionOrderBySortOrder(pos);
            } catch (IllegalArgumentException e) {
                return bannerRepository.findByIsActiveTrueOrderBySortOrder();
            }
        }
        return bannerRepository.findByIsActiveTrueOrderBySortOrder();
    }
}
