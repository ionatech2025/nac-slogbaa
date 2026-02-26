package com.nac.slogbaa.learning.adapters.persistence.adapter;

import com.nac.slogbaa.learning.application.dto.command.AddContentBlockCommand;
import com.nac.slogbaa.learning.application.dto.command.AddModuleCommand;
import com.nac.slogbaa.learning.application.dto.command.CreateCourseCommand;
import com.nac.slogbaa.learning.application.port.out.CourseWritePort;
import com.nac.slogbaa.learning.adapters.persistence.entity.ContentBlockEntity;
import com.nac.slogbaa.learning.adapters.persistence.entity.CourseEntity;
import com.nac.slogbaa.learning.adapters.persistence.entity.ModuleEntity;
import com.nac.slogbaa.learning.adapters.persistence.entity.ContentBlockEntity.BlockTypeEnum;
import com.nac.slogbaa.learning.adapters.persistence.repository.JpaContentBlockRepository;
import com.nac.slogbaa.learning.adapters.persistence.repository.JpaCourseRepository;
import com.nac.slogbaa.learning.adapters.persistence.repository.JpaModuleRepository;
import com.nac.slogbaa.learning.core.exception.CourseNotFoundException;
import com.nac.slogbaa.learning.core.exception.ModuleNotFoundException;
import com.nac.slogbaa.learning.core.valueobject.BlockId;
import com.nac.slogbaa.learning.core.valueobject.CourseId;
import com.nac.slogbaa.learning.core.valueobject.ModuleId;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.UUID;

@Component
public class CourseWriteAdapter implements CourseWritePort {

    private final JpaCourseRepository jpaCourseRepository;
    private final JpaModuleRepository jpaModuleRepository;
    private final JpaContentBlockRepository jpaContentBlockRepository;

    public CourseWriteAdapter(JpaCourseRepository jpaCourseRepository,
                             JpaModuleRepository jpaModuleRepository,
                             JpaContentBlockRepository jpaContentBlockRepository) {
        this.jpaCourseRepository = jpaCourseRepository;
        this.jpaModuleRepository = jpaModuleRepository;
        this.jpaContentBlockRepository = jpaContentBlockRepository;
    }

    @Override
    public CourseId createCourse(CreateCourseCommand command) {
        CourseEntity entity = new CourseEntity();
        UUID id = UUID.randomUUID();
        entity.setId(id);
        entity.setTitle(command.getTitle());
        entity.setDescription(command.getDescription());
        entity.setPublished(false);
        entity.setCreatedBy(command.getCreatedBy());
        entity.setCreatedAt(Instant.now());
        entity.setUpdatedAt(Instant.now());
        jpaCourseRepository.save(entity);
        return new CourseId(id);
    }

    @Override
    public void updateCourse(UUID courseId, String title, String description) {
        CourseEntity entity = jpaCourseRepository.findById(courseId)
                .orElseThrow(() -> new CourseNotFoundException(courseId));
        entity.setTitle(title);
        entity.setDescription(description);
        entity.setUpdatedAt(Instant.now());
        jpaCourseRepository.save(entity);
    }

    @Override
    public ModuleId addModule(AddModuleCommand command) {
        CourseEntity course = jpaCourseRepository.findById(command.getCourseId())
                .orElseThrow(() -> new CourseNotFoundException(command.getCourseId()));

        ModuleEntity entity = new ModuleEntity();
        UUID id = UUID.randomUUID();
        entity.setId(id);
        entity.setCourse(course);
        entity.setTitle(command.getTitle());
        entity.setDescription(command.getDescription());
        entity.setModuleOrder(command.getModuleOrder());
        entity.setHasQuiz(command.isHasQuiz());
        entity.setCreatedAt(Instant.now());
        entity.setUpdatedAt(Instant.now());
        jpaModuleRepository.save(entity);
        return new ModuleId(id);
    }

    @Override
    public BlockId addContentBlock(AddContentBlockCommand command) {
        ModuleEntity module = jpaModuleRepository.findById(command.getModuleId())
                .orElseThrow(() -> new ModuleNotFoundException(command.getModuleId()));

        ContentBlockEntity entity = new ContentBlockEntity();
        UUID id = UUID.randomUUID();
        entity.setId(id);
        entity.setModule(module);
        entity.setBlockType(BlockTypeEnum.valueOf(command.getBlockType().toUpperCase()));
        entity.setBlockOrder(command.getBlockOrder());
        entity.setRichText(command.getRichText());
        entity.setImageUrl(command.getImageUrl());
        entity.setImageAltText(command.getImageAltText());
        entity.setImageCaption(command.getImageCaption());
        entity.setVideoUrl(command.getVideoUrl());
        entity.setVideoId(command.getVideoId());
        entity.setActivityInstructions(command.getActivityInstructions());
        entity.setActivityResources(command.getActivityResources());
        entity.setCreatedAt(Instant.now());
        entity.setUpdatedAt(Instant.now());
        jpaContentBlockRepository.save(entity);
        return new BlockId(id);
    }

    @Override
    public void publish(CourseId courseId) {
        CourseEntity entity = jpaCourseRepository.findById(courseId.getValue())
                .orElseThrow(() -> new CourseNotFoundException(courseId.getValue()));
        entity.setPublished(true);
        entity.setUpdatedAt(Instant.now());
        jpaCourseRepository.save(entity);
    }
}
