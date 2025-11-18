package com.dongphuong.dev_snippet_vault_service.dto;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TagDTO {
    private Long id;
    private String name;
    private Integer usageCount; // How many snippets use this tag
}