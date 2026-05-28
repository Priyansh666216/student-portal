package com.studentportal.repository;

import com.studentportal.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * StudentRepository – extends JpaRepository to get full CRUD out of the box.
 *
 * JpaRepository<Student, Long> provides:
 *   save(), findById(), findAll(), deleteById(), count(), existsById() … etc.
 *
 * We add CUSTOM QUERIES below using:
 *   1. Spring Data method naming convention (derived queries)
 *   2. @Query with JPQL (Java Persistence Query Language)
 */
@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {

    // Derived query: Spring generates SQL from the method name
    Optional<Student> findByRollNumber(String rollNumber);

    Optional<Student> findByEmail(String email);

    // Find all students in a department
    List<Student> findByDepartment(String department);

    // Find all students in a specific semester
    List<Student> findBySemester(Integer semester);

    // Check if roll number already exists (for validation)
    boolean existsByRollNumber(String rollNumber);

    boolean existsByEmail(String email);

    // Custom JPQL query – search by name or roll number (case-insensitive)
    @Query("SELECT s FROM Student s WHERE " +
           "LOWER(s.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(s.rollNumber) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Student> searchByNameOrRollNumber(@Param("keyword") String keyword);

    // Students filtered by department and semester
    List<Student> findByDepartmentAndSemester(String department, Integer semester);
}
