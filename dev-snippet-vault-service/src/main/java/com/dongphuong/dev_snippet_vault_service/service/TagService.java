package com.dongphuong.dev_snippet_vault_service.service;

import com.dongphuong.dev_snippet_vault_service.dto.TagDTO;
import java.util.List;

public interface TagService {
    List<TagDTO> getAllUserTags(String username);
    List<TagDTO> getPopularTags();
}