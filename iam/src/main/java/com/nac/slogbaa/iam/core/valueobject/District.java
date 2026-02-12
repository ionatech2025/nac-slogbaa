package com.nac.slogbaa.iam.core.valueobject;

import java.util.Objects;

public final class District {
    private final String name;

    public District(String name) {
        if (name == null || name.isBlank()) {
            throw new IllegalArgumentException("District name must not be blank");
        }
        this.name = name.trim();
    }

    public String getName() {
        return name;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        District district = (District) o;
        return name.equals(district.name);
    }

    @Override
    public int hashCode() {
        return Objects.hash(name);
    }

    @Override
    public String toString() {
        return name;
    }
}
