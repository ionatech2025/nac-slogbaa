package com.nac.slogbaa.assessment.application.dto;

import java.util.UUID;

/** Option for attempt (no correct flag exposed). */
public record OptionForAttemptDto(UUID id, String optionText, int optionOrder) {}
