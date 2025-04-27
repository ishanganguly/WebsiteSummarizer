package com.example.WebSummarizer.dto;

import lombok.Data;

@Data
public class SummaryResponse {
    private String url;
    private String summary;
    private String timestamp;
}
