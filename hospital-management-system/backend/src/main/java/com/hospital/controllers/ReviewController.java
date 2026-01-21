package com.hospital.controllers;

import com.hospital.dto.CreateReviewRequest;
import com.hospital.dto.CreateReviewResponse;
import com.hospital.repositories.ReviewRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    @PostMapping("/new")
    public ResponseEntity<CreateReviewResponse> createNewReview(@RequestBody CreateReviewRequest request) {
        return ResponseEntity.ok(ReviewRepository.createReview(request));
    }
}
