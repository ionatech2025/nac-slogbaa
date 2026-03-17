package com.nac.slogbaa.learning.application.port.in;

import com.nac.slogbaa.learning.application.dto.result.AdminLibraryResourceSummary;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

/**
 * Use case: list all library resources for admin (published and draft). Staff only.
 */
public interface GetAdminLibraryResourcesUseCase {

    List<AdminLibraryResourceSummary> getAll();

    Page<AdminLibraryResourceSummary> getAll(Pageable pageable);
}
