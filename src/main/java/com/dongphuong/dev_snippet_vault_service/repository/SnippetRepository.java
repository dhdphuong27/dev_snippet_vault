package com.dongphuong.dev_snippet_vault_service.repository;

import com.dongphuong.dev_snippet_vault_service.entity.Snippet;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface SnippetRepository extends JpaRepository<Snippet, Long> {

    List<Snippet> findByUserUsernameOrderByCreatedAtDesc(String username);

    @Query("SELECT s FROM Snippet s WHERE s.isPublic = true ORDER BY s.createdAt DESC")
    List<Snippet> findPublicSnippets();

    @Query("SELECT s FROM Snippet s JOIN s.tags t WHERE LOWER(t.name) = LOWER(:tag) ORDER BY s.createdAt DESC")
    List<Snippet> findByTagName(@Param("tag") String tag);

    @Query("SELECT s FROM Snippet s WHERE " +
            "LOWER(s.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(s.content) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(s.language) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Snippet> searchByKeyword(@Param("keyword") String keyword);

    List<Snippet> findByUserUsernameAndIsFavoriteTrueOrderByUpdatedAtDesc(String username);
}
