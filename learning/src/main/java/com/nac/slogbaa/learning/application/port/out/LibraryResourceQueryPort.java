package com.nac.slogbaa.learning.application.port.out;

import com.nac.slogbaa.learning.application.dto.result.LibraryResourceSummary;

import java.util.List;

/**
 * Port for querying published library resources.
 */
public interface LibraryResourceQueryPort {

    List<LibraryResourceSummary> findPublished();
}
