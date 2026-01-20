package com.hospital.controllers;

import com.hospital.dto.*;
import com.hospital.repositories.TestResultRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/tests")
public class TestResultController {

    @PostMapping("/results")
    public ResponseEntity<List<FindTestResultResponse>> findTestResults(@RequestBody FindTestResultRequest request) {
        return ResponseEntity.ok(TestResultRepository.findTestResults(request));
    }

    @PostMapping("/record")
    public ResponseEntity<RecordNewTestResultResponse> recordNewTest(@RequestBody RecordNewTestResultRequest request) {
        return ResponseEntity.ok(TestResultRepository.recordNewTest(request));
    }

    @PostMapping("/delete")
    public ResponseEntity<DeleteTestResultResponse> deleteTestResult(@RequestBody DeleteTestResultRequest request) {
        return ResponseEntity.ok(TestResultRepository.deleteTestResult(request));
    }
}
