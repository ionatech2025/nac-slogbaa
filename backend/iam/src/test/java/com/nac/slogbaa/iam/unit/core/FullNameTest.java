package com.nac.slogbaa.iam.unit.core;

import com.nac.slogbaa.iam.core.valueobject.FullName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.NullAndEmptySource;
import org.junit.jupiter.params.provider.ValueSource;

import static org.junit.jupiter.api.Assertions.*;

class FullNameTest {

    @Test
    void validNameIsAccepted() {
        FullName name = new FullName("John", "Doe");
        assertEquals("John", name.getFirstName());
        assertEquals("Doe", name.getLastName());
    }

    @Test
    void trimsWhitespace() {
        FullName name = new FullName("  John  ", "  Doe  ");
        assertEquals("John", name.getFirstName());
        assertEquals("Doe", name.getLastName());
    }

    @Test
    void getFullNameConcatenates() {
        assertEquals("John Doe", new FullName("John", "Doe").getFullName());
    }

    @ParameterizedTest
    @NullAndEmptySource
    @ValueSource(strings = {"  ", "\t"})
    void blankFirstNameRejected(String first) {
        assertThrows(IllegalArgumentException.class, () -> new FullName(first, "Doe"));
    }

    @ParameterizedTest
    @NullAndEmptySource
    @ValueSource(strings = {"  ", "\t"})
    void blankLastNameRejected(String last) {
        assertThrows(IllegalArgumentException.class, () -> new FullName("John", last));
    }

    @Test
    void equalsAndHashCode() {
        FullName a = new FullName("John", "Doe");
        FullName b = new FullName("John", "Doe");
        assertEquals(a, b);
        assertEquals(a.hashCode(), b.hashCode());
    }

    @Test
    void differentNamesAreNotEqual() {
        assertNotEquals(new FullName("John", "Doe"), new FullName("Jane", "Doe"));
    }
}
