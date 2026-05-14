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
      <td>${c.value}</td>
      <td>${c.percentage}%</td>
    </tr>
  `).join('');

  const districtRows = districtBreakdown.map(d => `
    <tr>
      <td>${d.name}</td>
      <td>${d.value}</td>
    </tr>
  `).join('');

  const topCourseRows = topCourses.map(c => `
    <tr>
      <td><strong>${c.title}</strong></td>
      <td>${c.moduleCount}</td>
    </tr>
  `).join('');

  const activityRows = recentActivity.map(a => `
    <tr>
      <td>${a.name}</td>
      <td><span class="badge ${a.badgeClass || 'badge-blue'}">${a.type}</span></td>
      <td>${a.detail}</td>
      <td style="color: #64748b;">${a.date}</td>
    </tr>
  `).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>SLOGBAA Super Admin Report</title>
    <style>
        :root { --primary: #F58220; --secondary: #00A651; --text: #1e293b; --text-muted: #64748b; --border: #e2e8f0; --bg: #f8fafc; }
        body { font-family: sans-serif; color: var(--text); background: var(--bg); padding: 40px; }
        .report-container { max-width: 1000px; margin: 0 auto; background: #fff; padding: 40px; border-radius: 20px; }
        .header { display: flex; justify-content: space-between; border-bottom: 2px solid rgba(245, 130, 32, 0.1); padding-bottom: 20px; margin-bottom: 40px; }
        .logo-text { font-size: 24px; font-weight: 800; color: var(--primary); }
        .kpi-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 40px; }
        .kpi-card { padding: 20px; background: var(--bg); border-radius: 16px; border: 1px solid var(--border); text-align: center; }
        .kpi-card .value { display: block; font-size: 24px; font-weight: 800; color: var(--primary); }
        .kpi-card .label { font-size: 12px; font-weight: 600; text-transform: uppercase; color: var(--text-muted); }
        .section-title { font-size: 18px; font-weight: 700; margin: 30px 0 20px; padding-left: 12px; border-left: 4px solid var(--primary); }
        .data-row { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; }
        .data-table { width: 100%; border-collapse: collapse; font-size: 14px; }
        .data-table th { text-align: left; padding: 12px; background: var(--bg); border-bottom: 2px solid var(--border); color: var(--text-muted); font-size: 11px; }
        .data-table td { padding: 12px; border-bottom: 1px solid var(--border); }
        .badge { padding: 4px 8px; border-radius: 6px; font-size: 11px; font-weight: 700; }
        .badge-success { background: #dcfce7; color: #166534; }
        .badge-blue { background: #dbeafe; color: #1e40af; }
        .footer { margin-top: 60px; padding-top: 20px; border-top: 1px solid var(--border); text-align: center; font-size: 12px; color: var(--text-muted); }
    </style>
</head>
<body>
    <div class="report-container">
        <div class="header">
            <div class="logo-text">SLOGBAA</div>
            <div style="text-align: right">
                <h1 style="margin:0; font-size: 20px;">Platform Performance Report</h1>
                <p style="margin:4px 0 0; font-size: 14px; color: var(--text-muted);">Generated on ${generationDate}</p>
            </div>
        </div>

        <div class="kpi-grid">
            <div class="kpi-card"><span class="value">${traineeCount}</span><span class="label">Total Trainees</span></div>
            <div class="kpi-card"><span class="value">${publishedCourseCount}</span><span class="label">Active Courses</span></div>
            <div class="kpi-card"><span class="value">${certificateCount}</span><span class="label">Certs Issued</span></div>
            <div class="kpi-card"><span class="value">${globalPassRate}%</span><span class="label">Pass Rate</span></div>
        </div>

        <div class="data-row">
            <div>
                <h2 class="section-title">Trainee Demographics</h2>
                <table class="data-table">
                    <thead><tr><th>Category</th><th>Count</th><th>Distribution</th></tr></thead>
                    <tbody>${categoryRows}</tbody>
                </table>
            </div>
            <div>
                <h2 class="section-title">Regional Reach</h2>
                <table class="data-table">
                    <thead><tr><th>District</th><th>Trainees</th></tr></thead>
                    <tbody>${districtRows}</tbody>
                </table>
            </div>
        </div>

        <div class="data-row">
            <div>
                <h2 class="section-title">Engagement Metrics</h2>
                <div class="kpi-grid" style="grid-template-columns: 1fr 1fr; margin-bottom: 20px;">
                    <div class="kpi-card">
                        <span class="value" style="font-size: 20px;">${totalReviews}</span>
                        <span class="label">Course Reviews ${avgRating}★</span>
                    </div>
                    <div class="kpi-card">
                        <span class="value" style="font-size: 20px;">${totalQuestions}</span>
                        <span class="label">Trainee Qs</span>
                    </div>
                </div>
            </div>
            <div>
                <h2 class="section-title">Top Performing Courses</h2>
                <table class="data-table">
                    <thead><tr><th>Course Title</th><th>Modules</th></tr></thead>
                    <tbody>${topCourseRows}</tbody>
                </table>
            </div>
        </div>

        <h2 class="section-title">Recent Platform Activity</h2>
        <table class="data-table">
            <thead><tr><th>User</th><th>Action</th><th>Detail</th><th>Date</th></tr></thead>
            <tbody>${activityRows}</tbody>
        </table>

        <div class="footer">
            <p>&copy; ${currentYear} SLOGBAA System Report - Confidential</p>
        </div>
    </div>
</body>
</html>`;
}
