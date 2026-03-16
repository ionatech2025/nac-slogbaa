package com.nac.slogbaa.learning.core.valueobject;

import java.util.Objects;
import java.util.UUID;

public final class CourseId {
    private final UUID value;

    public CourseId(UUID value) {
        this.value = Objects.requireNonNull(value, "CourseId must not be null");
    }

    public static CourseId of(UUID uuid) {
        return new CourseId(uuid);
    }

    public static CourseId fromString(String s) {
        return new CourseId(UUID.fromString(s));
    }

    public UUID getValue() {
        return value;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        CourseId that = (CourseId) o;
        return value.equals(that.value);
    }

    @Override
    public int hashCode() {
        return value.hashCode();
    }

    @Override
    public String toString() {
        return value.toString();
    }
}
