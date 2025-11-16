package com.dongphuong.dev_snippet_vault_service.repository;

import com.dongphuong.dev_snippet_vault_service.entity.Tag;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TagRepository extends JpaRepository<Tag, Long> {
    Optional<Tag> findByNameIgnoreCase(String name);
    boolean existsByNameIgnoreCase(String name);
}
