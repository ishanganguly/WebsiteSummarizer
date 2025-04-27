package com.example.WebSummarizer.controller;

import com.example.WebSummarizer.dto.SummaryRequest;
import com.example.WebSummarizer.dto.SummaryResponse;
import com.example.WebSummarizer.service.SummarizerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/")
@CrossOrigin(origins = "*")
public class SummaryController {

    private final SummarizerService summarizerService;

    @Autowired
    public SummaryController(SummarizerService summarizerService) {
        this.summarizerService = summarizerService;
    }

    @PostMapping("/summarize")
    public SummaryResponse summarize(@RequestBody SummaryRequest request) {
        return summarizerService.summarizeUrl(request);
    }

    @GetMapping("/history")
    public List<SummaryResponse> history(@RequestParam(name = "userId") String userId) {
        return summarizerService.getHistory(userId);
    }
}

