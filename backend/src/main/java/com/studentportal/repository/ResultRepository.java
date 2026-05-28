package com.studentportal.repository;

import com.studentportal.model.Result;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * ResultRepository – Data access layer for the Result entity.
 */
@Repository
public interface ResultRepository extends JpaRepository<Result, Long> {

    // All results for a given student
    List<Result> findByStudentId(Long studentId);

    // All results for a student in a specific semester
    List<Result> findByStudentIdAndSemester(Long studentId, Integer semester);

    // All results for a specific subject across all students
    List<Result> findBySubject(String subject);

    // Calculate average marks for a student
    @Query("SELECT AVG(r.marksObtained) FROM Result r WHERE r.student.id = :studentId")
    Double findAverageMarksByStudentId(@Param("studentId") Long studentId);

    // Calculate CGPA-style aggregate (average percentage per student per semester)
    @Query("SELECT r.semester, AVG((r.marksObtained / r.totalMarks) * 100) " +
           "FROM Result r WHERE r.student.id = :studentId " +
           "GROUP BY r.semester ORDER BY r.semester")
    List<Object[]> findSemesterWisePercentage(@Param("studentId") Long studentId);

    // Count total results for a student
    long countByStudentId(Long studentId);
}
