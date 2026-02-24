package com.nac.slogbaa.learning.core.valueobject;

import java.util.Objects;

/**
 * Encapsulates module ordering within a course. Position is 1-based; ensures sequential order.
 */
public final class ModuleOrder {
    private final int position;

    public ModuleOrder(int position) {
        if (position < 0) {
            throw new IllegalArgumentException("Module position must be >= 0, got: " + position);
        }
        this.position = position;
    }

    public static ModuleOrder of(int position) {
        return new ModuleOrder(position);
    }

    public int getPosition() {
        return position;
    }

    public boolean isFirst(int totalModules) {
        return totalModules > 0 && position == 0;
    }

    public boolean isLast(int totalModules) {
        return totalModules > 0 && position == totalModules - 1;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ModuleOrder that = (ModuleOrder) o;
        return position == that.position;
    }

    @Override
    public int hashCode() {
        return Objects.hash(position);
    }

    @Override
    public String toString() {
        return "ModuleOrder{" + position + "}";
    }
}
