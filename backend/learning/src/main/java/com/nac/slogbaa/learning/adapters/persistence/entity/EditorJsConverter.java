package com.nac.slogbaa.learning.adapters.persistence.entity;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

/**
 * Converts Editor.js JSON string to/from EditorJsData for the rich_text column.
 * Tolerates legacy or invalid data by returning empty EditorJsData when parse fails.
 */
@Converter
public class EditorJsConverter implements AttributeConverter<EditorJsData, String> {

    private static final ObjectMapper OBJECT_MAPPER = new ObjectMapper();

    @Override
    public String convertToDatabaseColumn(EditorJsData attribute) {
        if (attribute == null) {
            return null;
        }
        try {
            return OBJECT_MAPPER.writeValueAsString(attribute);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to serialize EditorJsData", e);
        }
    }

    @Override
    public EditorJsData convertToEntityAttribute(String dbData) {
        if (dbData == null || dbData.isBlank()) {
            return new EditorJsData(0L, java.util.List.of());
        }
        if (dbData.trim().startsWith("<")) {
            return new EditorJsData(0L, java.util.List.of());
        }
        try {
            EditorJsData data = OBJECT_MAPPER.readValue(dbData, EditorJsData.class);
            return data != null ? data : new EditorJsData(0L, java.util.List.of());
        } catch (Exception e) {
            return new EditorJsData(0L, java.util.List.of());
        }
    }
}
