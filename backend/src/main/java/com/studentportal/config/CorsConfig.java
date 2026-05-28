package com.studentportal.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.*;

import java.util.List;

/**
 * CorsConfig – allows the React frontend (running on port 5173)
 * to communicate with the Spring Boot backend (port 8080).
 *
 * Without this, browsers block cross-origin requests.
 */
@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry)
    {String frontendUrl=System.getenv("FRONTEND_URL")!=null
            ?System.getenv("FRONTEND_URL")
            :"http://localhost:5173";
        registry.addMapping("/api/**")          // applies to all /api/* routes
                .allowedOrigins(
                       "http://localhost:5173",
                        "http://localhost:3000",
                        frontendUrl
                )
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
