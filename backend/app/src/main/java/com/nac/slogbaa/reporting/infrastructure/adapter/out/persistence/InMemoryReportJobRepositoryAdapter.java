package com.nac.slogbaa.reporting.infrastructure.adapter.out.persistence;

import com.nac.slogbaa.reporting.application.port.out.ReportJobRepositoryPort;
import com.nac.slogbaa.reporting.domain.aggregate.ReportJob;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

/**
 * In-memory repository for rapid prototyping.
 * TODO: Replace with JpaReportJobRepositoryAdapter once database tables are defined.
 */
@Component
public class InMemoryReportJobRepositoryAdapter implements ReportJobRepositoryPort {

    private final Map<UUID, ReportJob> store = new ConcurrentHashMap<>();

    @Override
    public void save(ReportJob reportJob) {
        store.put(reportJob.getJobId(), reportJob);
    }

    @Override
    public Optional<ReportJob> findById(UUID jobId) {
        return Optional.ofNullable(store.get(jobId));
    }
}
