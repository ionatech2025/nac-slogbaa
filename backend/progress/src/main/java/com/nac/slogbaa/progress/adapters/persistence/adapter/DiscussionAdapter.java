package com.nac.slogbaa.progress.adapters.persistence.adapter;

import com.nac.slogbaa.progress.adapters.persistence.entity.DiscussionReplyEntity;
import com.nac.slogbaa.progress.adapters.persistence.entity.DiscussionThreadEntity;
import com.nac.slogbaa.progress.adapters.persistence.repository.JpaDiscussionReplyRepository;
import com.nac.slogbaa.progress.adapters.persistence.repository.JpaDiscussionThreadRepository;
import com.nac.slogbaa.progress.application.port.out.DiscussionPort;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Component
public class DiscussionAdapter implements DiscussionPort {

    private final JpaDiscussionThreadRepository threadRepository;
    private final JpaDiscussionReplyRepository replyRepository;

    public DiscussionAdapter(JpaDiscussionThreadRepository threadRepository,
                             JpaDiscussionReplyRepository replyRepository) {
        this.threadRepository = threadRepository;
        this.replyRepository = replyRepository;
    }

    @Override
    public DiscussionThreadEntity saveThread(DiscussionThreadEntity entity) {
        return threadRepository.save(entity);
    }

    @Override
    public DiscussionReplyEntity saveReply(DiscussionReplyEntity entity) {
        return replyRepository.save(entity);
    }

    @Override
    public List<DiscussionThreadEntity> findThreadsByCourse(UUID courseId) {
        return threadRepository.findByCourseIdOrderByCreatedAtDesc(courseId);
    }

    @Override
    public List<DiscussionThreadEntity> findThreadsByCourseAndModule(UUID courseId, UUID moduleId) {
        return threadRepository.findByCourseIdAndModuleIdOrderByCreatedAtDesc(courseId, moduleId);
    }

    @Override
    public Page<DiscussionThreadEntity> findThreadsByCourse(UUID courseId, Pageable pageable) {
        return threadRepository.findByCourseIdOrderByCreatedAtDesc(courseId, pageable);
    }

    @Override
    public Page<DiscussionThreadEntity> findThreadsByCourseAndModule(UUID courseId, UUID moduleId, Pageable pageable) {
        return threadRepository.findByCourseIdAndModuleIdOrderByCreatedAtDesc(courseId, moduleId, pageable);
    }

    @Override
    public Optional<DiscussionThreadEntity> findThreadById(UUID threadId) {
        return threadRepository.findById(threadId);
    }

    @Override
    public List<DiscussionReplyEntity> findRepliesByThread(UUID threadId) {
        return replyRepository.findByThreadIdOrderByCreatedAtAsc(threadId);
    }

    @Override
    @Transactional
    public void markResolved(UUID threadId) {
        threadRepository.findById(threadId).ifPresent(thread -> {
            thread.setResolved(true);
            threadRepository.save(thread);
        });
    }

    @Override
    public void deleteThread(UUID threadId) {
        threadRepository.deleteById(threadId);
    }

    @Override
    public void deleteReply(UUID replyId) {
        replyRepository.deleteById(replyId);
    }

    @Override
    @Transactional
    public void incrementReplyCount(UUID threadId) {
        threadRepository.incrementReplyCount(threadId);
    }

    @Override
    public long countThreadsByAuthorType(String authorType) {
        return threadRepository.countByAuthorType(authorType);
    }

    @Override
    public long countAllReplies() {
        return replyRepository.count();
    }

    @Override
    public List<Object[]> countTraineeThreadsPerUtcDaySince(Instant since) {
        return threadRepository.countTraineeThreadsPerUtcDaySince(since);
    }

    @Override
    public List<Object[]> countDiscussionRepliesPerUtcDaySince(Instant since) {
        return replyRepository.countPerUtcDaySince(since);
    }
}
