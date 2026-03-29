package com.nac.slogbaa.progress.application.port.in;

import com.nac.slogbaa.progress.application.dto.EngagementAnalyticsResponse;

public interface GetEngagementAnalyticsUseCase {

    EngagementAnalyticsResponse get(boolean includeDiscussionMetrics);
}
