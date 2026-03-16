package com.nac.slogbaa.learning.application.port.in;

import java.util.UUID;

/**
 * Use case: delete a content block.
 */
public interface DeleteContentBlockUseCase {

    void execute(UUID blockId);
}
