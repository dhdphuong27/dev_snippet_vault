package com.dongphuong.dev_snippet_vault_service.dto;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.time.LocalDateTime;
import java.util.Set;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SnippetDTO {
    private Long id;
    private String title;
    private String content;
    private String language;
    private Set<String> tags;
    @JsonProperty("isFavorite")
    private boolean isFavorite;
    @JsonProperty("isPublic")
    private boolean isPublic;
    private String ownerUsername;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
