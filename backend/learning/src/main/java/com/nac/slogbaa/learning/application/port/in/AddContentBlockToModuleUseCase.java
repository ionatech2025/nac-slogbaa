package com.nac.slogbaa.learning.application.port.in;

import com.nac.slogbaa.learning.application.dto.command.AddContentBlockCommand;
import com.nac.slogbaa.learning.core.valueobject.BlockId;

/**
 * Use case: add a content block to a module.
 */
public interface AddContentBlockToModuleUseCase {

    BlockId execute(AddContentBlockCommand command);
}
