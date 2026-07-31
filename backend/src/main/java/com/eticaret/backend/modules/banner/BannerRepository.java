package com.eticaret.backend.modules.banner;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BannerRepository extends JpaRepository<Banner, String> {

    List<Banner> findByIsActiveTrueAndPositionOrderBySortOrder(Banner.BannerPosition position);

    List<Banner> findByIsActiveTrueOrderBySortOrder();
}
