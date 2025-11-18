package com.dongphuong.dev_snippet_vault_service.controller;

import com.dongphuong.dev_snippet_vault_service.dto.*;
import com.dongphuong.dev_snippet_vault_service.service.SnippetService;
import jakarta.validation.Valid;
import java.security.Principal;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/snippets")
public class SnippetController {

    @Autowired
    private SnippetService snippetService;

    @PostMapping
    public ResponseEntity<SnippetDTO> create(@Valid @RequestBody CreateSnippetRequest request, Principal principal) {
        SnippetDTO dto = snippetService.createSnippet(request, principal.getName());
        return ResponseEntity.status(HttpStatus.CREATED).body(dto);
    }

    @GetMapping("/my")
    public ResponseEntity<List<SnippetDTO>> mySnippets(Principal principal) {
        return ResponseEntity.ok(snippetService.getMySnippets(principal.getName()));
    }

    @GetMapping("/public")
    public ResponseEntity<List<SnippetDTO>> publicSnippets() {
        return ResponseEntity.ok(snippetService.getPublicSnippets());
    }
    @GetMapping("/public/search")
    public ResponseEntity<List<SnippetDTO>> searchPublic(@RequestParam("keyword") String keyword) {
        return ResponseEntity.ok(snippetService.searchPublicSnippets(keyword));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SnippetDTO> update(@PathVariable Long id,
                                             @Valid @RequestBody CreateSnippetRequest request,
                                             Principal principal) {
        return ResponseEntity.ok(snippetService.updateSnippet(id, request, principal.getName()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id, Principal principal) {
        snippetService.deleteSnippet(id, principal.getName());
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/favorite")
    public ResponseEntity<SnippetDTO> toggleFavorite(@PathVariable Long id, Principal principal) {
        return ResponseEntity.ok(snippetService.toggleFavorite(id, principal.getName()));
    }

    @GetMapping("/favorites")
    public ResponseEntity<List<SnippetDTO>> favorites(Principal principal) {
        return ResponseEntity.ok(snippetService.getFavorites(principal.getName()));
    }

    @GetMapping("/search")
    public ResponseEntity<List<SnippetDTO>> search(@RequestParam("keyword") String keyword) {
        return ResponseEntity.ok(snippetService.search(keyword));
    }
}
