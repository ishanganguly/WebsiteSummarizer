package com.example.WebSummarizer.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Data
@Component
@ConfigurationProperties(prefix = "scala.service")
public class ScalaServiceProperties {
    private String baseUrl;
    private String endpointSummarize;
    private String endpointHistory;
}
