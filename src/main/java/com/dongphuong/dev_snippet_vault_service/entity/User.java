package com.dongphuong.dev_snippet_vault_service.entity;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;
import lombok.*;

@Entity
@Table(name = "users", indexes = {
        @Index(columnList = "username"),
        @Index(columnList = "email")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User extends Auditable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 64)
    private String username;

    @Column(nullable = false, unique = true, length = 128)
    private String email;

    @Column(nullable = false)
    private String password; // hashed

    @Column(nullable = false)
    @Builder.Default
    private String role = "USER";

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Snippet> snippets = new ArrayList<>();

    // convenience helpers
    public void addSnippet(Snippet snippet) {
        snippets.add(snippet);
        snippet.setUser(this);
    }

    public void removeSnippet(Snippet snippet) {
        snippets.remove(snippet);
        snippet.setUser(null);
    }
}
