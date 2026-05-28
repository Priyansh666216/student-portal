package com.studentportal;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Entry point for the Student Portal Spring Boot Application.
 *
 * @SpringBootApplication combines:
 *   - @Configuration        – marks this as a config class
 *   - @EnableAutoConfiguration – enables Spring Boot auto-config
 *   - @ComponentScan        – scans the package for beans
 */
@SpringBootApplication
public class StudentPortalApplication {

    public static void main(String[] args) {

        SpringApplication.run(StudentPortalApplication.class, args);
        System.out.println("LocalHost Running ON 8080");
    }
}
