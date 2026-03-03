package com.nac.slogbaa.learning.application.port.out;

import com.nac.slogbaa.learning.application.dto.command.AddContentBlockCommand;
import com.nac.slogbaa.learning.application.dto.command.UpdateContentBlockCommand;
import com.nac.slogbaa.learning.application.dto.command.AddModuleCommand;
import com.nac.slogbaa.learning.application.dto.command.UpdateModuleCommand;
import com.nac.slogbaa.learning.application.dto.command.CreateCourseCommand;
import com.nac.slogbaa.learning.core.valueobject.BlockId;
import com.nac.slogbaa.learning.core.valueobject.CourseId;
import com.nac.slogbaa.learning.core.valueobject.ModuleId;

/**
 * Port for course write operations (create, update, add module, add block, publish).
 */
public interface CourseWritePort {

    CourseId createCourse(CreateCourseCommand command);

    void updateCourse(java.util.UUID courseId, String title, String description, String imageUrl);

    ModuleId addModule(AddModuleCommand command);

    void updateModule(UpdateModuleCommand command);

    BlockId addContentBlock(AddContentBlockCommand command);

    void updateContentBlock(UpdateContentBlockCommand command);

    void deleteContentBlock(java.util.UUID blockId);

    void publish(CourseId courseId);

    void unpublish(CourseId courseId);
}
