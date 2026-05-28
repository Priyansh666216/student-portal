package com.studentportal.controller;

import com.studentportal.model.Student;
import com.studentportal.service.StudentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * StudentController – exposes REST endpoints under /api/students.
 *
 * @RestController = @Controller + @ResponseBody (every method returns JSON)
 * @RequestMapping – base path for all endpoints in this class
 * @CrossOrigin    – already handled globally in CorsConfig; kept here for clarity
 */
@RestController
@RequestMapping("/api/students")
@RequiredArgsConstructor
public class StudentController {

    private final StudentService studentService;

    // ── GET all students ─────────────────────────────────────────
    // GET /api/students
    @GetMapping
    public ResponseEntity<List<Student>> getAllStudents() {
        return ResponseEntity.ok(studentService.getAllStudents());
    }

    // ── GET student by ID ─────────────────────────────────────────
    // GET /api/students/1
    @GetMapping("/{id}")
    public ResponseEntity<Student> getStudentById(@PathVariable Long id) {
        return ResponseEntity.ok(studentService.getStudentById(id));
    }

    // ── GET by roll number ────────────────────────────────────────
    // GET /api/students/roll/CS2021001
    @GetMapping("/roll/{rollNumber}")
    public ResponseEntity<Student> getByRollNumber(@PathVariable String rollNumber) {
        return ResponseEntity.ok(studentService.getStudentByRollNumber(rollNumber));
    }

    // ── GET by department ─────────────────────────────────────────
    // GET /api/students/department/CSE
    @GetMapping("/department/{department}")
    public ResponseEntity<List<Student>> getByDepartment(@PathVariable String department) {
        return ResponseEntity.ok(studentService.getStudentsByDepartment(department));
    }

    // ── SEARCH ────────────────────────────────────────────────────
    // GET /api/students/search?keyword=john
    @GetMapping("/search")
    public ResponseEntity<List<Student>> search(@RequestParam String keyword) {
        return ResponseEntity.ok(studentService.searchStudents(keyword));
    }

    // ── CREATE student ────────────────────────────────────────────
    // POST /api/students    Body: { "name": "John", "rollNumber": "CS001", ... }
    @PostMapping
    public ResponseEntity<Student> createStudent(@Valid @RequestBody Student student) {
        Student created = studentService.createStudent(student);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    // ── UPDATE student ────────────────────────────────────────────
    // PUT /api/students/1   Body: updated student JSON
    @PutMapping("/{id}")
    public ResponseEntity<Student> updateStudent(
            @PathVariable Long id,
            @Valid @RequestBody Student student) {
        return ResponseEntity.ok(studentService.updateStudent(id, student));
    }

    // ── DELETE student ────────────────────────────────────────────
    // DELETE /api/students/1
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteStudent(@PathVariable Long id) {
        studentService.deleteStudent(id);
        return ResponseEntity.ok("Student deleted successfully");
    }
}
