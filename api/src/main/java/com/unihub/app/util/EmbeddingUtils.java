package com.unihub.app.util;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

public class EmbeddingUtils {
    private static final ObjectMapper mapper = new ObjectMapper();

    public static String toString(float[] vector) {
        try {
            return mapper.writeValueAsString(vector);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }

    public static float[] fromString(String str) {
        try {
            return mapper.readValue(str, float[].class);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }
}
