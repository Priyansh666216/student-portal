package com.studentportal.controller;

import com.studentportal.model.Result;
import com.studentportal.service.ResultService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * ResultController – REST endpoints for managing student results.
 * Base path: /api/results
 */
@RestController
@RequestMapping("/api/results")
@RequiredArgsConstructor
public class ResultController {

    private final ResultService resultService;

    // ── GET all results for a student ─────────────────────────────
    // GET /api/results/student/1
    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<Result>> getByStudent(@PathVariable Long studentId) {
        return ResponseEntity.ok(resultService.getResultsByStudent(studentId));
    }

    // ── GET results by student + semester ─────────────────────────
    // GET /api/results/student/1/semester/3
    @GetMapping("/student/{studentId}/semester/{semester}")
    public ResponseEntity<List<Result>> getBySemester(
            @PathVariable Long studentId,
            @PathVariable Integer semester) {
        return ResponseEntity.ok(resultService.getResultsByStudentAndSemester(studentId, semester));
    }

    // ── GET single result ─────────────────────────────────────────
    // GET /api/results/5
    @GetMapping("/{id}")
    public ResponseEntity<Result> getResultById(@PathVariable Long id) {
        return ResponseEntity.ok(resultService.getResultById(id));
    }

    // ── GET semester-wise performance summary ─────────────────────
    // GET /api/results/student/1/summary
    @GetMapping("/student/{studentId}/summary")
    public ResponseEntity<Map<Integer, Double>> getSummary(@PathVariable Long studentId) {
        return ResponseEntity.ok(resultService.getSemesterWisePercentage(studentId));
    }

    // ── GET overall average ───────────────────────────────────────
    // GET /api/results/student/1/average
    @GetMapping("/student/{studentId}/average")
    public ResponseEntity<Double> getAverage(@PathVariable Long studentId) {
        return ResponseEntity.ok(resultService.getAverageMarks(studentId));
    }

    // ── ADD result for a student ──────────────────────────────────
    // POST /api/results/student/1
    @PostMapping("/student/{studentId}")
    public ResponseEntity<Result> addResult(
            @PathVariable Long studentId,
            @Valid @RequestBody Result result) {
        Result saved = resultService.addResult(studentId, result);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    // ── UPDATE result ─────────────────────────────────────────────
    // PUT /api/results/5
    @PutMapping("/{id}")
    public ResponseEntity<Result> updateResult(
            @PathVariable Long id,
            @Valid @RequestBody Result result) {
        return ResponseEntity.ok(resultService.updateResult(id, result));
    }

    // ── DELETE result ─────────────────────────────────────────────
    // DELETE /api/results/5
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteResult(@PathVariable Long id) {
        resultService.deleteResult(id);
        return ResponseEntity.ok("Result deleted successfully");
    }
}
