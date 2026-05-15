package com.nac.slogbaa.reporting.application.port.out;

import com.nac.slogbaa.reporting.domain.aggregate.ReportJob;

import java.util.Optional;
import java.util.UUID;

public interface ReportJobRepositoryPort {
    void save(ReportJob reportJob);
    Optional<ReportJob> findById(UUID jobId);
}
