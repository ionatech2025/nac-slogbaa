package com.nac.slogbaa.iam.adapters.rest.dto.response;

/**
 * Generic response with a message.
 */
public class MessageResponse {

    private final String message;

    public MessageResponse(String message) {
        this.message = message;
    }

    public String getMessage() {
        return message;
    }
}
