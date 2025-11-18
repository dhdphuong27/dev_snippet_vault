package com.dongphuong.dev_snippet_vault_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class DeveloperSnippetVaultApplication {
	public static void main(String[] args) {
		SpringApplication.run(DeveloperSnippetVaultApplication.class, args);
	}
}
