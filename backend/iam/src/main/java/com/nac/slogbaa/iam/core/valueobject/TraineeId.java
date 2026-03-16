package com.nac.slogbaa.iam.core.valueobject;

import java.util.Objects;
import java.util.UUID;

public final class TraineeId {
    private final UUID value;

    public TraineeId(UUID value) {
        this.value = Objects.requireNonNull(value, "TraineeId must not be null");
    }

    public static TraineeId of(UUID uuid) {
        return new TraineeId(uuid);
    }

    public static TraineeId fromString(String s) {
        return new TraineeId(UUID.fromString(s));
    }

    public UUID getValue() {
        return value;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        TraineeId that = (TraineeId) o;
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
