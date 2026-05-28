package com.studentportal.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

/**
 * Result – JPA Entity mapped to the `results` table in MySQL.
 * Stores academic result data for each student per subject per semester.
 */
@Entity
@Table(name = "results")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Result {

    /* ── Primary Key ─────────────────────────────────────────── */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /* ── Subject & Marks ─────────────────────────────────────── */
    @NotBlank(message = "Subject is required")
    private String subject;

    @NotNull(message = "Marks obtained is required")
    @Min(0) @Max(100)
    @Column(name = "marks_obtained")
    private Double marksObtained;

    @NotNull(message = "Total marks is required")
    @Column(name = "total_marks")
    private Double totalMarks;

    /** Computed or stored grade – e.g. "A+", "B", "F" */
    private String grade;

    /** Credit hours for this subject */
    private Integer credits;

    @NotNull(message = "Semester is required")
    private Integer semester;

    @Column(name = "exam_type")
    private String examType;  // e.g. "Mid-Term", "End-Term", "Internal"

    @Column(name = "academic_year")
    private String academicYear;  // e.g. "2024-25"

    /* ── Relationship ────────────────────────────────────────── */
    /**
     * Many results belong to one student.
     * @JsonIgnoreProperties prevents infinite JSON recursion when
     * the result serializes its student and student serializes its results.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    @JsonIgnoreProperties({"results", "hibernateLazyInitializer"})
    private Student student;

    /* ── Utility ─────────────────────────────────────────────── */
    /** Calculate percentage on the fly */
    @Transient  // not stored in DB, computed at runtime
    public Double getPercentage() {
        if (totalMarks == null || totalMarks == 0) return 0.0;
        return (marksObtained / totalMarks) * 100;
    }
}
