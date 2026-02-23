package com.nac.slogbaa.learning.core.valueobject;

/**
 * Content block type. Determines which content fields are relevant.
 */
public enum BlockType {
    TEXT,
    IMAGE,
    VIDEO,
    ACTIVITY;

    public static BlockType fromString(String s) {
        if (s == null || s.isBlank()) {
            throw new IllegalArgumentException("BlockType must not be null or blank");
        }
        return valueOf(s.trim().toUpperCase());
    }
}
