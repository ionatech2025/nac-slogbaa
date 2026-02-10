package com.nac.slogbaa.iam.core.valueobject;

/**
 * Role of an authenticated user. Kept in core so domain rules can reference it
 * without any framework dependency.
 */
public enum AuthenticatedRole {
    TRAINEE,
    SUPER_ADMIN,
    ADMIN
}
