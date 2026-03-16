package com.nac.slogbaa.learning.application.service;

import com.nac.slogbaa.learning.application.dto.command.AddModuleCommand;
import com.nac.slogbaa.learning.application.port.in.AddModuleToCourseUseCase;
import com.nac.slogbaa.learning.application.port.out.CourseWritePort;
import com.nac.slogbaa.learning.core.valueobject.ModuleId;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AddModuleToCourseService implements AddModuleToCourseUseCase {

    private final CourseWritePort courseWritePort;

    public AddModuleToCourseService(CourseWritePort courseWritePort) {
        this.courseWritePort = courseWritePort;
    }

    @Override
    @Transactional
    public ModuleId execute(AddModuleCommand command) {
        return courseWritePort.addModule(command);
    }
}
