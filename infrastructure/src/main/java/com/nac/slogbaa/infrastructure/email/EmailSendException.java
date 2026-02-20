package com.nac.slogbaa.infrastructure.email;

/**
 * Thrown when sending an email fails.
 */
public class EmailSendException extends RuntimeException {

    public EmailSendException(String message, Throwable cause) {
        super(message, cause);
    }
}
