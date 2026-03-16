package com.nac.slogbaa.learning.application.service;

import com.nac.slogbaa.learning.application.dto.command.UpdateModuleCommand;
import com.nac.slogbaa.learning.application.port.in.UpdateModuleUseCase;
import com.nac.slogbaa.learning.application.port.out.CourseWritePort;
import org.springframework.stereotype.Service;

@Service
public class UpdateModuleService implements UpdateModuleUseCase {

    private final CourseWritePort courseWritePort;

    public UpdateModuleService(CourseWritePort courseWritePort) {
        this.courseWritePort = courseWritePort;
    }

    @Override
    public void execute(UpdateModuleCommand command) {
        courseWritePort.updateModule(command);
    }
}
