package com.nac.slogbaa.shared.util;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

class FrontendAppBaseUrlTest {

    @Test
    void isProductionProfileDetectsProd() {
        assertTrue(FrontendAppBaseUrl.isProductionProfile("prod"));
        assertTrue(FrontendAppBaseUrl.isProductionProfile("dev,prod"));
        assertTrue(FrontendAppBaseUrl.isProductionProfile("production"));
        assertFalse(FrontendAppBaseUrl.isProductionProfile("dev"));
        assertFalse(FrontendAppBaseUrl.isProductionProfile(""));
    }

    @Test
    void normalizeProdPrefersHttps() {
        String raw = "http://localhost:5173,https://nac-slogbaa.vercel.app";
        assertTrue(FrontendAppBaseUrl.normalize(raw, true).startsWith("https://"));
    }

    @Test
    void normalizeDevPrefersLocalhost() {
        String raw = "http://localhost:5173,https://nac-slogbaa.vercel.app";
        assertTrue(FrontendAppBaseUrl.normalize(raw, false).startsWith("http://localhost"));
    }

    @Test
    void normalizeSingleValueUnchanged() {
        assertTrue(FrontendAppBaseUrl.normalize("https://nac-slogbaa.vercel.app", true)
                .startsWith("https://"));
        assertTrue(FrontendAppBaseUrl.normalize("http://localhost:5173", false)
                .startsWith("http://localhost"));
    }
}
