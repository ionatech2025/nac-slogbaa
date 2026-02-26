package com.nac.slogbaa.learning.application.port.in;

import com.nac.slogbaa.learning.application.dto.command.UpdateContentBlockCommand;

/**
 * Use case: update an existing content block.
 */
public interface UpdateContentBlockUseCase {

    void execute(UpdateContentBlockCommand command);
}
