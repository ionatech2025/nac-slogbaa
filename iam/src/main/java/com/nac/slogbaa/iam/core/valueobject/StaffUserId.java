package com.nac.slogbaa.iam.core.valueobject;

import java.util.Objects;
import java.util.UUID;

public final class StaffUserId {
    private final UUID value;

    public StaffUserId(UUID value) {
        this.value = Objects.requireNonNull(value, "StaffUserId must not be null");
    }

    public static StaffUserId of(UUID uuid) {
        return new StaffUserId(uuid);
    }

    public static StaffUserId fromString(String s) {
        return new StaffUserId(UUID.fromString(s));
    }

    public UUID getValue() {
        return value;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        StaffUserId that = (StaffUserId) o;
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
