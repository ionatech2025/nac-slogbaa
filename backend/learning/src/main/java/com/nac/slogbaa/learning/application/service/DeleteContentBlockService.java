package com.nac.slogbaa.learning.application.service;

import com.nac.slogbaa.learning.application.port.in.DeleteContentBlockUseCase;
import com.nac.slogbaa.learning.application.port.out.CourseWritePort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class DeleteContentBlockService implements DeleteContentBlockUseCase {

    private final CourseWritePort courseWritePort;

    public DeleteContentBlockService(CourseWritePort courseWritePort) {
        this.courseWritePort = courseWritePort;
    }

    @Override
    @Transactional
    public void execute(UUID blockId) {
        courseWritePort.deleteContentBlock(blockId);
    }
}
