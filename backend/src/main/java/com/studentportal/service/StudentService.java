package com.studentportal.service;

import com.studentportal.model.Student;
import com.studentportal.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * StudentService – Business logic layer.
 *
 * @Service  → marks this as a Spring service bean (auto-detected by component scan)
 * @RequiredArgsConstructor → Lombok generates a constructor injecting all final fields
 * @Transactional → wraps write operations in a DB transaction; rolls back on exception
 */
@Service
@RequiredArgsConstructor
public class StudentService {

    private final StudentRepository studentRepository;

    /* ── CREATE ───────────────────────────────────────────────── */
    @Transactional
    public Student createStudent(Student student) {
        // Business rule: roll number must be unique
        if (studentRepository.existsByRollNumber(student.getRollNumber())) {
            throw new RuntimeException("Roll number already exists: " + student.getRollNumber());
        }
        if (studentRepository.existsByEmail(student.getEmail())) {
            throw new RuntimeException("Email already registered: " + student.getEmail());
        }
        return studentRepository.save(student);
    }

    /* ── READ ─────────────────────────────────────────────────── */
    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    public Student getStudentById(Long id) {
        return studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found with id: " + id));
    }

    public Student getStudentByRollNumber(String rollNumber) {
        return studentRepository.findByRollNumber(rollNumber)
                .orElseThrow(() -> new RuntimeException("Student not found with roll number: " + rollNumber));
    }

    public List<Student> getStudentsByDepartment(String department) {
        return studentRepository.findByDepartment(department);
    }

    public List<Student> searchStudents(String keyword) {
        return studentRepository.searchByNameOrRollNumber(keyword);
    }

    /* ── UPDATE ───────────────────────────────────────────────── */
    @Transactional
    public Student updateStudent(Long id, Student updatedStudent) {
        Student existing = getStudentById(id);

        // Only update non-null fields provided
        existing.setName(updatedStudent.getName());
        existing.setEmail(updatedStudent.getEmail());
        existing.setDepartment(updatedStudent.getDepartment());
        existing.setSemester(updatedStudent.getSemester());
        existing.setPhoneNumber(updatedStudent.getPhoneNumber());
        existing.setAddress(updatedStudent.getAddress());
        existing.setDateOfBirth(updatedStudent.getDateOfBirth());
        existing.setProfilePictureUrl(updatedStudent.getProfilePictureUrl());

        return studentRepository.save(existing);
    }

    /* ── DELETE ───────────────────────────────────────────────── */
    @Transactional
    public void deleteStudent(Long id) {
        if (!studentRepository.existsById(id)) {
            throw new RuntimeException("Student not found with id: " + id);
        }
        studentRepository.deleteById(id);
    }
}
