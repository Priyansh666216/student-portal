package com.studentportal.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDate;
import java.util.List;

/**
 * Student – JPA Entity mapped to the `students` table in MySQL.
 *
 * Lombok annotations:
 *   @Data        → generates getters, setters, equals, hashCode, toString
 *   @NoArgsConstructor / @AllArgsConstructor → constructors
 *   @Builder     → builder pattern for clean object creation
 */
@Entity
@Table(name = "students")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Student {

    /* ── Primary Key ─────────────────────────────────────────── */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)  // AUTO_INCREMENT in MySQL
    private Long id;

    /* ── Basic Profile ───────────────────────────────────────── */
    @NotBlank(message = "Name is required")
    @Column(nullable = false)
    private String name;

    @NotBlank(message = "Roll number is required")
    @Column(name = "roll_number", nullable = false, unique = true)
    private String rollNumber;

    @Email(message = "Invalid email format")
    @NotBlank(message = "Email is required")
    @Column(nullable = false, unique = true)
    private String email;

    @NotBlank(message = "Department is required")
    private String department;

    @NotNull(message = "Semester is required")
    @Min(1) @Max(8)
    private Integer semester;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    @Column(name = "phone_number")
    private String phoneNumber;

    @Column(columnDefinition = "TEXT")
    private String address;

    @Column(name = "profile_picture_url")
    private String profilePictureUrl;

    @Column(name = "enrollment_year")
    private Integer enrollmentYear;

    /* ── Relationship ────────────────────────────────────────── */
    /**
     * One student can have many results.
     * cascade = ALL  → save/delete Student also saves/deletes its Results
     * fetch = LAZY   → results are NOT loaded until explicitly accessed (performance)
     * mappedBy       → the owning side is Result.student
     */
    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Result> results;
}
