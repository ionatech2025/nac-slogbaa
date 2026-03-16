package com.nac.slogbaa.iam.adapters.security;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import org.springframework.stereotype.Component;

/**
 * Structured audit logger for security-sensitive events.
 * Writes to a dedicated "AUDIT" logger for easy filtering
 * and routing to a separate log sink (SIEM, CloudWatch, etc.).
 */
@Component
public class AuditLogger {

    private static final Logger audit = LoggerFactory.getLogger("AUDIT");

    public void loginSuccess(String userId, String email, String role, String clientIp) {
        audit.info("event=LOGIN_SUCCESS userId={} email={} role={} clientIp={} traceId={}",
                userId, email, role, clientIp, MDC.get("traceId"));
    }

    public void loginFailure(String email, String reason, String clientIp) {
        audit.warn("event=LOGIN_FAILURE email={} reason={} clientIp={} traceId={}",
                email, reason, clientIp, MDC.get("traceId"));
    }

    public void passwordResetRequested(String email, String clientIp) {
        audit.info("event=PASSWORD_RESET_REQUESTED email={} clientIp={} traceId={}",
                email, clientIp, MDC.get("traceId"));
    }

    public void passwordResetCompleted(String email, String clientIp) {
        audit.info("event=PASSWORD_RESET_COMPLETED email={} clientIp={} traceId={}",
                email, clientIp, MDC.get("traceId"));
    }

    public void accountRegistered(String userId, String email, String clientIp) {
        audit.info("event=ACCOUNT_REGISTERED userId={} email={} clientIp={} traceId={}",
                userId, email, clientIp, MDC.get("traceId"));
    }

    public void accessDenied(String userId, String path, String clientIp) {
        audit.warn("event=ACCESS_DENIED userId={} path={} clientIp={} traceId={}",
                userId, path, clientIp, MDC.get("traceId"));
    }
}
