package com.nac.slogbaa.learning.application.service;

import com.nac.slogbaa.learning.application.port.in.DeleteModuleUseCase;
import com.nac.slogbaa.learning.application.port.out.CourseWritePort;
import com.nac.slogbaa.learning.core.exception.ModuleHasCompletionsException;
import com.nac.slogbaa.shared.ports.CourseDeletionCheckPort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class DeleteModuleService implements DeleteModuleUseCase {

    private final CourseDeletionCheckPort courseDeletionCheckPort;
    private final CourseWritePort courseWritePort;

    public DeleteModuleService(CourseDeletionCheckPort courseDeletionCheckPort,
                              CourseWritePort courseWritePort) {
        this.courseDeletionCheckPort = courseDeletionCheckPort;
        this.courseWritePort = courseWritePort;
    }

    @Override
    @Transactional
    public void execute(UUID moduleId) {
        long completions = courseDeletionCheckPort.countModuleCompletionsByModuleId(moduleId);
        if (completions > 0) {
            throw new ModuleHasCompletionsException(moduleId, completions);
        }
        courseWritePort.deleteModule(moduleId);
    }
}
