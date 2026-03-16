package com.nac.slogbaa.learning.core.valueobject;

import java.util.Objects;
import java.util.UUID;

public final class ModuleId {
    private final UUID value;

    public ModuleId(UUID value) {
        this.value = Objects.requireNonNull(value, "ModuleId must not be null");
    }

    public static ModuleId of(UUID uuid) {
        return new ModuleId(uuid);
    }

    public static ModuleId fromString(String s) {
        return new ModuleId(UUID.fromString(s));
    }

    public UUID getValue() {
        return value;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ModuleId that = (ModuleId) o;
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
