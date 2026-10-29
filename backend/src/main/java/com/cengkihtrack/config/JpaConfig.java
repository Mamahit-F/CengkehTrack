package com.cengkihtrack.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@Configuration
@EnableJpaAuditing
public class JpaConfig {
    // Mengaktifkan @CreatedDate dan @LastModifiedDate pada entity
}
