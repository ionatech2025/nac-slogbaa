/**
 * Generates the full HTML for the Super Admin report by injecting data into the template.
 */
export function renderReportTemplate(data) {
  const {
    generationDate = new Date().toLocaleDateString(),
    traineeCount = 0,
    publishedCourseCount = 0,
    certificateCount = 0,
    globalPassRate = 0,
    categoryBreakdown = [],
    districtBreakdown = [],
    totalReviews = 0,
    avgRating = 0,
    totalQuestions = 0,
    totalVisitors = 0,
    topCourses = [],
    recentActivity = [],
    currentYear = new Date().getFullYear(),
  } = data;

  const categoryRows = categoryBreakdown.map(c => `
    <tr>
      <td>${c.name}</td>
      <td align="right">${c.value}</td>
      <td align="right">${c.percentage}%</td>
    </tr>
  `).join('');

  const districtRows = districtBreakdown.map(d => `
    <tr>
      <td>${d.name}</td>
      <td align="right">${d.value}</td>
    </tr>
  `).join('');

  const topCourseRows = topCourses.map(c => `
    <tr>
      <td><strong>${c.title}</strong></td>
      <td align="right">${c.moduleCount}</td>
    </tr>
  `).join('');

  const activityRows = recentActivity.map(a => `
    <tr>
      <td>${a.name}</td>
      <td><span class="badge ${a.badgeClass || 'badge-blue'}">${a.type}</span></td>
      <td>${a.detail}</td>
      <td style="color: #64748b; text-align: right;">${a.date}</td>
    </tr>
  `).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <title>SLOGBAA Super Admin Report</title>
    <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #1e293b; background: #f8fafc; padding: 20px; margin: 0; }
        .report-container { max-width: 1000px; margin: 0 auto; background: #fff; padding: 30px; border-radius: 8px; }
        .header-table { width: 100%; border-bottom: 2px solid #F58220; margin-bottom: 30px; padding-bottom: 10px; }
        .logo-text { font-size: 28px; font-weight: bold; color: #F58220; }
        .header-title { text-align: right; }
        .header-title h1 { margin: 0; font-size: 22px; color: #1e293b; }
        .header-title p { margin: 4px 0 0; font-size: 12px; color: #64748b; }
        
        .kpi-table { width: 100%; margin-bottom: 30px; }
        .kpi-table td { padding: 15px; background: #f8fafc; border: 1px solid #e2e8f0; text-align: center; width: 25%; }
        .kpi-value { display: block; font-size: 24px; font-weight: bold; color: #F58220; margin-bottom: 5px; }
        .kpi-label { font-size: 11px; font-weight: bold; text-transform: uppercase; color: #64748b; }

        .section-title { font-size: 16px; font-weight: bold; margin: 20px 0 15px; padding-left: 10px; border-left: 4px solid #F58220; color: #0f172a; }
        
        .layout-table { width: 100%; margin-bottom: 20px; }
        .layout-table td { vertical-align: top; width: 50%; }
        .layout-table td.left-col { padding-right: 15px; }
        .layout-table td.right-col { padding-left: 15px; }

        .data-table { width: 100%; border-collapse: collapse; font-size: 12px; margin-bottom: 15px; }
        .data-table th { text-align: left; padding: 10px; background: #f8fafc; border-bottom: 2px solid #e2e8f0; color: #64748b; font-size: 11px; text-transform: uppercase; }
        .data-table td { padding: 10px; border-bottom: 1px solid #e2e8f0; }
        .data-table th[align="right"], .data-table td[align="right"] { text-align: right; }
        
        .badge { padding: 3px 6px; border-radius: 4px; font-size: 10px; font-weight: bold; display: inline-block; }
        .badge-success { background: #dcfce7; color: #166534; border: 1px solid #bbf7d0; }
        .badge-blue { background: #dbeafe; color: #1e40af; border: 1px solid #bfdbfe; }
        
        .footer { margin-top: 40px; padding-top: 15px; border-top: 1px solid #e2e8f0; text-align: center; font-size: 11px; color: #64748b; }
    </style>
</head>
<body>
    <div class="report-container">
        <table class="header-table" cellpadding="0" cellspacing="0">
            <tr>
                <td class="logo-text">SLOGBAA</td>
                <td class="header-title">
                    <h1>Platform Performance Report</h1>
                    <p>Generated on ${generationDate}</p>
                </td>
            </tr>
        </table>

        <table class="kpi-table" cellpadding="0" cellspacing="10">
            <tr>
                <td>
                    <span class="kpi-value">${traineeCount}</span>
                    <span class="kpi-label">Total Trainees</span>
                </td>
                <td>
                    <span class="kpi-value">${publishedCourseCount}</span>
                    <span class="kpi-label">Active Courses</span>
                </td>
                <td>
                    <span class="kpi-value">${certificateCount}</span>
                    <span class="kpi-label">Certs Issued</span>
                </td>
                <td>
                    <span class="kpi-value">${globalPassRate}%</span>
                    <span class="kpi-label">Pass Rate</span>
                </td>
            </tr>
        </table>

        <table class="layout-table" cellpadding="0" cellspacing="0">
            <tr>
                <td class="left-col">
                    <div class="section-title">Trainee Demographics</div>
                    <table class="data-table">
                        <thead><tr><th>Category</th><th align="right">Count</th><th align="right">Distribution</th></tr></thead>
                        <tbody>${categoryRows}</tbody>
                    </table>
                </td>
                <td class="right-col">
                    <div class="section-title">Regional Reach</div>
                    <table class="data-table">
                        <thead><tr><th>District</th><th align="right">Trainees</th></tr></thead>
                        <tbody>${districtRows}</tbody>
                    </table>
                </td>
            </tr>
        </table>

        <table class="layout-table" cellpadding="0" cellspacing="0">
            <tr>
                <td class="left-col">
                    <div class="section-title">Engagement Metrics</div>
                    <table class="kpi-table" cellpadding="0" cellspacing="10" style="margin-bottom: 0;">
                        <tr>
                            <td style="width: 50%;">
                                <span class="kpi-value" style="font-size: 18px;">${totalReviews}</span>
                                <span class="kpi-label">Course Reviews (${avgRating}★)</span>
                            </td>
                            <td style="width: 50%;">
                                <span class="kpi-value" style="font-size: 18px;">${totalQuestions}</span>
                                <span class="kpi-label">Trainee Qs</span>
                            </td>
                        </tr>
                    </table>
                </td>
                <td class="right-col">
                    <div class="section-title">Top Performing Courses</div>
                    <table class="data-table">
                        <thead><tr><th>Course Title</th><th align="right">Modules</th></tr></thead>
                        <tbody>${topCourseRows}</tbody>
                    </table>
                </td>
            </tr>
        </table>

        <div class="section-title">Recent Platform Activity</div>
        <table class="data-table">
            <thead><tr><th>User</th><th>Action</th><th>Detail</th><th align="right">Date</th></tr></thead>
            <tbody>${activityRows}</tbody>
        </table>

        <div class="footer">
            <p>&copy; ${currentYear} SLOGBAA System Report - Confidential</p>
        </div>
    </div>
</body>
</html>`;
}
