package com.grafka

import org.springframework.context.annotation.Configuration
import org.springframework.web.servlet.config.annotation.CorsRegistry
import org.springframework.web.servlet.config.annotation.EnableWebMvc
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer

@Configuration
class CorsConfiguration : WebMvcConfigurer {
    override fun addCorsMappings(registry: CorsRegistry) {
        registry.addMapping("/graphql").allowedOrigins("http://localhost:3000"); // TODO Setting
        registry.addMapping("/altair").allowedOrigins("http://localhost:3000"); // TODO Setting
        registry.addMapping("/subscriptions").allowedOrigins("http://localhost:3000"); // TODO Setting
    }
}
