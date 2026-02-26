package com.nac.slogbaa.learning.adapters.persistence.entity;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.nac.slogbaa.learning.core.entity.TextLine;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

import java.util.List;

/**
 * Converts List&lt;TextLine&gt; to JSON string for the rich_text database column.
 */
@Converter
public class TextLineConverter implements AttributeConverter<List<TextLine>, String> {

    private static final ObjectMapper OBJECT_MAPPER = new ObjectMapper();

    @Override
    public String convertToDatabaseColumn(List<TextLine> attribute) {
        if (attribute == null || attribute.isEmpty()) {
            return null;
        }
        try {
            return OBJECT_MAPPER.writeValueAsString(attribute);
        } catch (Exception e) {
            throw new RuntimeException("Failed to serialize TextLine list", e);
        }
    }

    @Override
    public List<TextLine> convertToEntityAttribute(String dbData) {
        if (dbData == null || dbData.isBlank()) {
            return List.of();
        }
        try {
            return OBJECT_MAPPER.readValue(dbData, new TypeReference<List<TextLine>>() {});
        } catch (Exception e) {
            throw new RuntimeException("Failed to deserialize TextLine list", e);
        }
    }
}
