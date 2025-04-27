package com.example.WebSummarizer;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;

@SpringBootApplication
@ConfigurationPropertiesScan("com.example.WebSummarizer.config")
public class WebSummarizerApplication {
	public static void main(String[] args) {
		SpringApplication.run(WebSummarizerApplication.class, args);
	}
}
