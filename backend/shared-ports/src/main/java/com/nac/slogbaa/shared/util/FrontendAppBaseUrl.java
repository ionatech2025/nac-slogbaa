package com.nac.slogbaa.shared.util;

/**
 * Normalizes frontend base URL from {@code app.password-reset.base-url} / {@code PASSWORD_RESET_BASE_URL}.
 * Comma-separated lists (often copied from CORS) produce invalid links in email.
 * <ul>
 *   <li><b>Production</b> ({@code prod} profile): prefers first {@code https://} URL (e.g. Vercel).</li>
 *   <li><b>Development</b> (e.g. {@code dev} profile): prefers first {@code http://localhost} or
 *       {@code http://127.0.0.1} so local runs are not forced to production links.</li>
 * </ul>
 */
public final class FrontendAppBaseUrl {

    private FrontendAppBaseUrl() {
    }

    /**
     * True when {@code spring.profiles.active} includes {@code prod} or {@code production}.
     */
    public static boolean isProductionProfile(String springProfilesActive) {
        if (springProfilesActive == null || springProfilesActive.isBlank()) {
            return false;
        }
        for (String segment : springProfilesActive.split(",")) {
            String p = segment.trim();
            if (p.equalsIgnoreCase("prod") || p.equalsIgnoreCase("production")) {
                return true;
            }
        }
        return false;
    }

    /**
     * @param productionBackend when true, comma-separated values prefer {@code https://}; when false, prefer localhost HTTP
     */
    public static String normalize(String raw, boolean productionBackend) {
        if (raw == null || raw.isBlank()) {
            return "";
        }
        String t = raw.trim();
        if (!t.contains(",")) {
            return t;
        }
        String[] parts = t.split(",");
        if (productionBackend) {
            for (String part : parts) {
                String p = part.trim();
                if (p.startsWith("https://")) {
                    return p;
                }
            }
            return parts[0].trim();
        }
        for (String part : parts) {
            String p = part.trim();
            String lower = p.toLowerCase();
            if (lower.startsWith("http://localhost") || lower.startsWith("http://127.0.0.1")) {
                return p;
            }
        }
        return parts[0].trim();
    }
}
