package com.example.WebSummarizer.service;

import com.example.WebSummarizer.config.ScalaServiceProperties;
import com.example.WebSummarizer.dto.SummaryRequest;
import com.example.WebSummarizer.dto.SummaryResponse;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;
import java.util.List;

@Slf4j
@Service
public class SummarizerService {

    private static final Logger logger = LoggerFactory.getLogger(SummarizerService.class);

    private final RestTemplate restTemplate;
    private final ScalaServiceProperties props;

    @Autowired
    public SummarizerService(RestTemplate restTemplate, ScalaServiceProperties props) {
        this.restTemplate = restTemplate;
        this.props = props;
    }

    public SummaryResponse summarizeUrl(SummaryRequest request) {
        String url = props.getBaseUrl() + props.getEndpointSummarize();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<SummaryRequest> entity = new HttpEntity<>(request, headers);

        logger.info("Sending summarize request to Scala backend at {}", url);
        logger.info("Sending summarize request to Scala backend with userId: {}", request.getUserId());
        ResponseEntity<SummaryResponse> response = restTemplate.postForEntity(url, entity, SummaryResponse.class);

        logger.info(" Successfully connected to Scala. Summary received for URL: {}", request.getUrl());

        return response.getBody();
    }

    @PostConstruct
    public void printScalaConfig() {
        logger.info("Scala base URL: {}", props.getBaseUrl());
        logger.info("Summarize endpoint: {}", props.getEndpointSummarize());
        logger.info("History endpoint: {}", props.getEndpointHistory());
    }

    public List<SummaryResponse> getHistory(String userId) {
        String url = props.getBaseUrl() + props.getEndpointHistory() + "?userId=" + userId;

        logger.info("Fetching history for user {} from Scala backend at {}", userId, url);

        ResponseEntity<List> response = restTemplate.getForEntity(url, List.class);

        logger.info("Successfully fetched history");

        return response.getBody();
    }
}
