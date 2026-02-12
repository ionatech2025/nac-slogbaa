package com.nac.slogbaa.iam.core.valueobject;

import java.util.Objects;

public final class PhysicalAddress {
    private final String street;
    private final String city;
    private final String postalCode;

    public PhysicalAddress(String street, String city, String postalCode) {
        this.street = street != null ? street.trim() : null;
        this.city = city != null ? city.trim() : null;
        this.postalCode = postalCode != null ? postalCode.trim() : null;
    }

    public String getStreet() {
        return street;
    }

    public String getCity() {
        return city;
    }

    public String getPostalCode() {
        return postalCode;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        PhysicalAddress that = (PhysicalAddress) o;
        return Objects.equals(street, that.street)
                && Objects.equals(city, that.city)
                && Objects.equals(postalCode, that.postalCode);
    }

    @Override
    public int hashCode() {
        return Objects.hash(street, city, postalCode);
    }
}
