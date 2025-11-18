package com.dongphuong.dev_snippet_vault_service.service.impl;

import com.dongphuong.dev_snippet_vault_service.dto.TagDTO;
import com.dongphuong.dev_snippet_vault_service.entity.Tag;
import com.dongphuong.dev_snippet_vault_service.entity.User;
import com.dongphuong.dev_snippet_vault_service.repository.TagRepository;
import com.dongphuong.dev_snippet_vault_service.repository.UserRepository;
import com.dongphuong.dev_snippet_vault_service.service.TagService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class TagServiceImpl implements TagService {

    @Autowired
    private TagRepository tagRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public List<TagDTO> getAllUserTags(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Get all tags used by this user's snippets
        Set<Tag> tags = new HashSet<>();
        user.getSnippets().forEach(snippet -> {
            if (snippet.getTags() != null) {
                tags.addAll(snippet.getTags());
            }
        });

        // Convert to DTO with usage count
        return tags.stream()
                .map(tag -> {
                    long count = user.getSnippets().stream()
                            .filter(snippet -> snippet.getTags() != null && snippet.getTags().contains(tag))
                            .count();
                    return TagDTO.builder()
                            .id(tag.getId())
                            .name(tag.getName())
                            .usageCount((int) count)
                            .build();
                })
                .sorted(Comparator.comparing(TagDTO::getName))
                .collect(Collectors.toList());
    }

    @Override
    public List<TagDTO> getPopularTags() {
        List<Tag> allTags = tagRepository.findAll();

        return allTags.stream()
                .map(tag -> TagDTO.builder()
                        .id(tag.getId())
                        .name(tag.getName())
                        .usageCount(tag.getSnippets() != null ? tag.getSnippets().size() : 0)
                        .build())
                .filter(dto -> dto.getUsageCount() > 0)
                .sorted(Comparator.comparing(TagDTO::getUsageCount).reversed())
                .limit(20) // Top 20 popular tags
                .collect(Collectors.toList());
    }
}