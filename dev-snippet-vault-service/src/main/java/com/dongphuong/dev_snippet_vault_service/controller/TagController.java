package com.dongphuong.dev_snippet_vault_service.controller;

import com.dongphuong.dev_snippet_vault_service.dto.TagDTO;
import com.dongphuong.dev_snippet_vault_service.service.TagService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/tags")
public class TagController {

    @Autowired
    private TagService tagService;

    @GetMapping
    public ResponseEntity<List<TagDTO>> getAllTags(Principal principal) {
        return ResponseEntity.ok(tagService.getAllUserTags(principal.getName()));
    }

    @GetMapping("/popular")
    public ResponseEntity<List<TagDTO>> getPopularTags() {
        return ResponseEntity.ok(tagService.getPopularTags());
    }
}