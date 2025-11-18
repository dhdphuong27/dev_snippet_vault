package com.dongphuong.dev_snippet_vault_service.dto;

import java.util.Set;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateSnippetRequest {
    @NotBlank
    private String title;

    @NotBlank
    private String content;

    private String language;

    private Set<String> tags;

    private Boolean isPublic;

    private Boolean isFavorite;
}
