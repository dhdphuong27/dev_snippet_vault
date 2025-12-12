package com.dongphuong.dev_snippet_vault_service.service.impl;

import com.dongphuong.dev_snippet_vault_service.dto.*;
import com.dongphuong.dev_snippet_vault_service.entity.*;
import com.dongphuong.dev_snippet_vault_service.repository.*;
import com.dongphuong.dev_snippet_vault_service.service.SnippetService;
import java.util.*;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class SnippetServiceImpl implements SnippetService {

    @Autowired
    private SnippetRepository snippetRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TagRepository tagRepository;

    private SnippetDTO toDTO(Snippet s) {
        return SnippetDTO.builder()
                .id(s.getId())
                .title(s.getTitle())
                .content(s.getContent())
                .language(s.getLanguage())
                .tags(s.getTags().stream().map(Tag::getName).collect(Collectors.toSet()))
                .isFavorite(s.isFavorite())
                .isPublic(s.isPublic())
                .ownerUsername(s.getUser().getUsername())
                .createdAt(s.getCreatedAt())
                .updatedAt(s.getUpdatedAt())
                .build();
    }

    @Override
    @Transactional
    public SnippetDTO createSnippet(CreateSnippetRequest request, String ownerUsername) {
        User user = userRepository.findByUsername(ownerUsername)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Snippet snippet = Snippet.builder()
                .title(request.getTitle())
                .content(request.getContent())
                .language(request.getLanguage())
                .isPublic(request.getIsPublic())
                .isFavorite(request.getIsFavorite())
                .user(user)
                .tags(processTags(request.getTags())) // ✅ Add this
                .build();

        // handle tags
        if (request.getTags() != null) {
            for (String t : request.getTags()) {
                Tag tag = tagRepository.findByNameIgnoreCase(t.trim())
                        .orElseGet(() -> tagRepository.save(Tag.builder().name(t.trim()).build()));
                snippet.getTags().add(tag);
            }
        }

        Snippet saved = snippetRepository.save(snippet);
        return toDTO(saved);
    }

    @Override
    public List<SnippetDTO> getMySnippets(String username) {
        return snippetRepository.findByUserUsernameOrderByCreatedAtDesc(username).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<SnippetDTO> getPublicSnippets() {
        return snippetRepository.findPublicSnippets().stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public SnippetDTO updateSnippet(Long id, CreateSnippetRequest request, String username) {
        Snippet snippet = snippetRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Snippet not found"));

        if (!snippet.getUser().getUsername().equals(username)) {
            throw new SecurityException("Not allowed");
        }

        snippet.setTitle(request.getTitle());
        snippet.setContent(request.getContent());
        snippet.setLanguage(request.getLanguage());
        snippet.setPublic(Boolean.TRUE.equals(request.getIsPublic()));

        // tags: clear & repopulate
        snippet.getTags().clear();
        if (request.getTags() != null) {
            for (String t : request.getTags()) {
                Tag tag = tagRepository.findByNameIgnoreCase(t.trim())
                        .orElseGet(() -> tagRepository.save(Tag.builder().name(t.trim()).build()));
                snippet.getTags().add(tag);
            }
        }

        Snippet updated = snippetRepository.save(snippet);
        return toDTO(updated);
    }

    @Override
    public void deleteSnippet(Long id, String username) {
        Snippet snippet = snippetRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Snippet not found"));

        if (!snippet.getUser().getUsername().equals(username)) {
            throw new SecurityException("Not allowed");
        }

        snippetRepository.delete(snippet);
    }

    @Override
    public List<SnippetDTO> search(String keyword) {
        return snippetRepository.searchByKeyword(keyword).stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Override
    public List<SnippetDTO> getFavorites(String username) {
        return snippetRepository.findByUserUsernameAndIsFavoriteTrueOrderByUpdatedAtDesc(username).stream()
                .map(this::toDTO).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public SnippetDTO toggleFavorite(Long id, String username) {
        Snippet snippet = snippetRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Snippet not found"));

        if (!snippet.getUser().getUsername().equals(username)) {
            throw new SecurityException("Not allowed");
        }

        snippet.setFavorite(!snippet.isFavorite());
        return toDTO(snippetRepository.save(snippet));
    }

    @Override
    public List<SnippetDTO> searchPublicSnippets(String keyword) {
        List<Snippet> snippets = snippetRepository.searchByKeyword(keyword);
        return snippets.stream()
                .filter(Snippet::isPublic)
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<SnippetDTO> searchMySnippets(String keyword, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Snippet> allResults = snippetRepository.searchByKeyword(keyword);
        return allResults.stream()
                .filter(s -> s.getUser().getId().equals(user.getId()))
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private SnippetDTO convertToDTO(Snippet snippet) {
        return SnippetDTO.builder()
                .id(snippet.getId())
                .title(snippet.getTitle())
                .content(snippet.getContent())
                .language(snippet.getLanguage())
                .isPublic(snippet.isPublic())
                .isFavorite(snippet.isFavorite())
                .tags(snippet.getTags() != null ?
                        snippet.getTags().stream()
                                .map(Tag::getName)
                                .collect(Collectors.toSet()) : new HashSet<>()) // ✅ Add this
                .createdAt(snippet.getCreatedAt())
                .updatedAt(snippet.getUpdatedAt())
                .build();
    }
    private Set<Tag> processTags(Set<String> tagNames) {
        if (tagNames == null || tagNames.isEmpty()) {
            return new HashSet<>();
        }

        return tagNames.stream()
                .map(name -> name.trim().toLowerCase())
                .filter(name -> !name.isEmpty())
                .map(name -> tagRepository.findByName(name)
                        .orElseGet(() -> {
                            Tag newTag = new Tag();
                            newTag.setName(name);
                            return tagRepository.save(newTag);
                        }))
                .collect(Collectors.toSet());
    }
    @Override
    public SnippetDTO getPublicSnippetById(Long id) {
        Snippet snippet = snippetRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Snippet not found"));

        if (!snippet.isPublic()) {
            throw new RuntimeException("This snippet is not public");
        }

        return convertToDTO(snippet);
    }
}
