package com.unihub.app.util;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import java.sql.*;
import java.util.Arrays;

@Converter(autoApply = true)
public class VectorConverter implements AttributeConverter<float[], String> {

    @Override
    public String convertToDatabaseColumn(float[] attribute) {
        if (attribute == null) return null;
        // PostgreSQL vector expects format: [0.1,0.2,0.3]
        StringBuilder sb = new StringBuilder();
        sb.append('[');
        for (int i = 0; i < attribute.length; i++) {
            sb.append(attribute[i]);
            if (i < attribute.length - 1) sb.append(',');
        }
        sb.append(']');
        return sb.toString();
    }

    @Override
    public float[] convertToEntityAttribute(String dbData) {
        if (dbData == null || dbData.isEmpty()) return null;
        // Remove brackets and split
        String cleaned = dbData.replace("[", "").replace("]", "");
        String[] parts = cleaned.split(",");
        float[] array = new float[parts.length];
        for (int i = 0; i < parts.length; i++) {
            array[i] = Float.parseFloat(parts[i]);
        }
        return array;
    }
}

