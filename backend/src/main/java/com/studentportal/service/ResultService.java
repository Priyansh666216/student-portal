package com.studentportal.service;

import com.studentportal.model.Result;
import com.studentportal.model.Student;
import com.studentportal.repository.ResultRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.LinkedHashMap;

@Service
@RequiredArgsConstructor
public class ResultService {

    private final ResultRepository resultRepository;
    private final StudentService studentService;

    /* ── CREATE ───────────────────────────────────────────────── */
    @Transactional
    public Result addResult(Long studentId, Result result) {
        Student student = studentService.getStudentById(studentId);
        result.setStudent(student);
        // Auto-compute grade if not provided
        if (result.getGrade() == null || result.getGrade().isBlank()) {
            result.setGrade(computeGrade(result.getMarksObtained(), result.getTotalMarks()));
        }
        return resultRepository.save(result);
    }

    /* ── READ ─────────────────────────────────────────────────── */
    public List<Result> getResultsByStudent(Long studentId) {
        return resultRepository.findByStudentId(studentId);
    }

    public List<Result> getResultsByStudentAndSemester(Long studentId, Integer semester) {
        return resultRepository.findByStudentIdAndSemester(studentId, semester);
    }

    public Result getResultById(Long id) {
        return resultRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Result not found with id: " + id));
    }

    /** Returns semester-wise average percentage as a Map for easy JSON serialisation */
    public Map<Integer, Double> getSemesterWisePercentage(Long studentId) {
        List<Object[]> raw = resultRepository.findSemesterWisePercentage(studentId);
        Map<Integer, Double> semesterMap = new LinkedHashMap<>();
        for (Object[] row : raw) {
            Integer semester = (Integer) row[0];
            Double avg = (Double) row[1];
            semesterMap.put(semester, Math.round(avg * 100.0) / 100.0);
        }
        return semesterMap;
    }

    public Double getAverageMarks(Long studentId) {
        return resultRepository.findAverageMarksByStudentId(studentId);
    }

    /* ── UPDATE ───────────────────────────────────────────────── */
    @Transactional
    public Result updateResult(Long id, Result updated) {
        Result existing = getResultById(id);
        existing.setSubject(updated.getSubject());
        existing.setMarksObtained(updated.getMarksObtained());
        existing.setTotalMarks(updated.getTotalMarks());
        existing.setSemester(updated.getSemester());
        existing.setCredits(updated.getCredits());
        existing.setExamType(updated.getExamType());
        existing.setAcademicYear(updated.getAcademicYear());
        existing.setGrade(computeGrade(updated.getMarksObtained(), updated.getTotalMarks()));
        return resultRepository.save(existing);
    }

    /* ── DELETE ───────────────────────────────────────────────── */
    @Transactional
    public void deleteResult(Long id) {
        if (!resultRepository.existsById(id)) {
            throw new RuntimeException("Result not found with id: " + id);
        }
        resultRepository.deleteById(id);
    }

    /* ── HELPER ───────────────────────────────────────────────── */
    private String computeGrade(Double marks, Double total) {
        if (marks == null || total == null || total == 0) return "N/A";
        double pct = (marks / total) * 100;
        if (pct >= 90) return "A+";
        if (pct >= 80) return "A";
        if (pct >= 70) return "B+";
        if (pct >= 60) return "B";
        if (pct >= 50) return "C";
        if (pct >= 40) return "D";
        return "F";
    }
}
