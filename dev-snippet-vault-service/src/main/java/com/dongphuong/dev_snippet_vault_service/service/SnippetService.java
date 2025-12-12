package com.dongphuong.dev_snippet_vault_service.service;

import com.dongphuong.dev_snippet_vault_service.dto.CreateSnippetRequest;
import com.dongphuong.dev_snippet_vault_service.dto.SnippetDTO;
import java.util.List;

public interface SnippetService {
    SnippetDTO createSnippet(CreateSnippetRequest request, String ownerUsername);
    List<SnippetDTO> getMySnippets(String username);
    List<SnippetDTO> getPublicSnippets();
    SnippetDTO updateSnippet(Long id, CreateSnippetRequest request, String username);
    void deleteSnippet(Long id, String username);
    List<SnippetDTO> search(String keyword);
    List<SnippetDTO> getFavorites(String username);
    SnippetDTO toggleFavorite(Long id, String username);
    List<SnippetDTO> searchPublicSnippets(String keyword);
    List<SnippetDTO> searchMySnippets(String keyword, String username);
    SnippetDTO getPublicSnippetById(Long id);
}
