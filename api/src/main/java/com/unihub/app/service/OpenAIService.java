package com.unihub.app.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;
import com.fasterxml.jackson.databind.JsonNode;

@Service
public class OpenAIService {
    @Value("${openai.api-key}")
    private String apiKey;

    private final RestTemplate restTemplate;

    public OpenAIService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public float[] generateEmbedding(String text) {
        String url = "https://api.openai.com/v1/embeddings";
        String model = "text-embedding-ada-002"; // Update as needed

        String requestBody = String.format("{\"model\": \"%s\", \"input\": \"%s\"}", model, text);

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + apiKey);
        headers.set("Content-Type", "application/json");

        HttpEntity<String> entity = new HttpEntity<>(requestBody, headers);

        ResponseEntity<JsonNode> response = restTemplate.exchange(url, HttpMethod.POST, entity, JsonNode.class);

        JsonNode data = response.getBody().get("data").get(0);
        JsonNode embeddingNode = data.get("embedding");


        float[] embedding = new float[embeddingNode.size()];
        for (int i = 0; i < embeddingNode.size(); i++) {
            embedding[i] = (float) embeddingNode.get(i).asDouble();
        }

        return embedding;
    }
}

