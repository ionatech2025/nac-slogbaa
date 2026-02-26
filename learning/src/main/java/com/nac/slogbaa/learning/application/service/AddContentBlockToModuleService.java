package com.nac.slogbaa.learning.application.service;

import com.nac.slogbaa.learning.application.dto.command.AddContentBlockCommand;
import com.nac.slogbaa.learning.application.port.in.AddContentBlockToModuleUseCase;
import com.nac.slogbaa.learning.application.port.out.CourseWritePort;
import com.nac.slogbaa.learning.core.valueobject.BlockId;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AddContentBlockToModuleService implements AddContentBlockToModuleUseCase {

    private final CourseWritePort courseWritePort;

    public AddContentBlockToModuleService(CourseWritePort courseWritePort) {
        this.courseWritePort = courseWritePort;
    }

    @Override
    @Transactional
    public BlockId execute(AddContentBlockCommand command) {
        return courseWritePort.addContentBlock(command);
    }
}
