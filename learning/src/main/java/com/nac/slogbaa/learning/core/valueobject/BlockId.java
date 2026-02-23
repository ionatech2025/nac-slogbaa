package com.nac.slogbaa.learning.core.valueobject;

import java.util.Objects;
import java.util.UUID;

public final class BlockId {
    private final UUID value;

    public BlockId(UUID value) {
        this.value = Objects.requireNonNull(value, "BlockId must not be null");
    }

    public static BlockId of(UUID uuid) {
        return new BlockId(uuid);
    }

    public static BlockId fromString(String s) {
        return new BlockId(UUID.fromString(s));
    }

    public UUID getValue() {
        return value;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        BlockId that = (BlockId) o;
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
