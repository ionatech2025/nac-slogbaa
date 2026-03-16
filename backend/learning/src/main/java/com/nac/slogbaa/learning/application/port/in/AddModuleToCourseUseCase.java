package com.nac.slogbaa.learning.application.port.in;

import com.nac.slogbaa.learning.application.dto.command.AddModuleCommand;
import com.nac.slogbaa.learning.core.valueobject.ModuleId;

/**
 * Use case: add a module to a course.
 */
public interface AddModuleToCourseUseCase {

    ModuleId execute(AddModuleCommand command);
}
