package com.nac.slogbaa.learning.application.service;

import com.nac.slogbaa.learning.application.dto.command.UpdateContentBlockCommand;
import com.nac.slogbaa.learning.application.port.in.UpdateContentBlockUseCase;
import com.nac.slogbaa.learning.application.port.out.CourseWritePort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UpdateContentBlockService implements UpdateContentBlockUseCase {

    private final CourseWritePort courseWritePort;

    public UpdateContentBlockService(CourseWritePort courseWritePort) {
        this.courseWritePort = courseWritePort;
    }

    @Override
    @Transactional
    public void execute(UpdateContentBlockCommand command) {
        courseWritePort.updateContentBlock(command);
    }
}
