package com.nac.slogbaa.reporting.infrastructure.adapter.out.pdf;

import com.lowagie.text.Chunk;
import com.lowagie.text.Document;
import com.lowagie.text.DocumentException;
import com.lowagie.text.Element;
import com.lowagie.text.Font;
import com.lowagie.text.FontFactory;
import com.lowagie.text.Image;
import com.lowagie.text.PageSize;
import com.lowagie.text.Paragraph;
import com.lowagie.text.Phrase;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import com.lowagie.text.pdf.draw.LineSeparator;
import com.nac.slogbaa.reporting.application.dto.CourseAnalyticsReportData;
import com.nac.slogbaa.reporting.application.dto.CoursePerformanceTableRow;
import com.nac.slogbaa.reporting.application.dto.ExecutiveOverviewReportData;
import com.nac.slogbaa.reporting.application.dto.ReportHeader;
import com.nac.slogbaa.reporting.application.dto.TraineeProgressReportData;
import com.nac.slogbaa.reporting.application.dto.WithdrawalLogTableRow;
import com.nac.slogbaa.reporting.application.port.out.PdfGeneratorPort;
import org.knowm.xchart.BitmapEncoder;
import org.knowm.xchart.CategoryChart;
import org.knowm.xchart.CategoryChartBuilder;
import org.knowm.xchart.PieChart;
import org.knowm.xchart.PieChartBuilder;
import org.knowm.xchart.style.AxesChartStyler;
import org.knowm.xchart.style.Styler;
import org.springframework.stereotype.Component;

import java.awt.Color;
import java.io.ByteArrayOutputStream;

@Component
public class OpenPdfGeneratorAdapter implements PdfGeneratorPort {

    // Styling Constants
    private static final Font TITLE_FONT = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 22, new Color(33, 37, 41));
    private static final Font HEADER_FONT = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 16, new Color(52, 58, 64));
    private static final Font SUBTEXT_FONT = FontFactory.getFont(FontFactory.HELVETICA, 10, new Color(108, 117, 125));
    private static final Font NORMAL_FONT = FontFactory.getFont(FontFactory.HELVETICA, 11, new Color(33, 37, 41));
    private static final Font TABLE_HEADER_FONT = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 11, Color.WHITE);
    
    private static final Color PRIMARY_COLOR = new Color(13, 110, 253); // Bootstrap Primary Blue
    private static final Color TABLE_HEADER_BG = PRIMARY_COLOR;
    private static final Color TABLE_ROW_ALT_BG = new Color(248, 249, 250);

    @Override
    public byte[] generatePdf(Object reportDataDto) {
        try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            Document document = new Document(PageSize.A4, 40, 40, 50, 50);
            PdfWriter.getInstance(document, baos);
            document.open();

            if (reportDataDto instanceof ExecutiveOverviewReportData data) {
                renderExecutiveOverview(document, data);
            } else if (reportDataDto instanceof CourseAnalyticsReportData data) {
                renderCourseAnalytics(document, data);
            } else if (reportDataDto instanceof TraineeProgressReportData data) {
                renderTraineeProgress(document, data);
            } else {
                throw new IllegalArgumentException("Unsupported report data type: " + reportDataDto.getClass());
            }

            document.close();
            return baos.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate PDF document", e);
        }
    }

    // --- Specific Report Renderers ---

    private void renderExecutiveOverview(Document doc, ExecutiveOverviewReportData data) throws Exception {
        addHeader(doc, data.header());
        
        doc.add(new Paragraph("Platform Overview Summary", HEADER_FONT));
        doc.add(Chunk.NEWLINE);
        
        PdfPTable statsTable = new PdfPTable(4);
        statsTable.setWidthPercentage(100);
        addTableHeader(statsTable, "Total Trainees", "Active Courses", "Completion Rate", "Total Withdrawals");
        addTableCell(statsTable, data.summaryStats().totalTrainees(), 0);
        addTableCell(statsTable, data.summaryStats().activeCourses(), 0);
        addTableCell(statsTable, data.summaryStats().overallCompletionRate(), 0);
        addTableCell(statsTable, data.summaryStats().totalWithdrawals(), 0);
        doc.add(statsTable);
        doc.add(Chunk.NEWLINE);

        // Chart 1: Trainee Status Pie Chart
        PieChart pieChart = new PieChartBuilder().width(600).height(350).title(data.traineeStatusPieChart().seriesName()).build();
        styleChart(pieChart.getStyler());
        for (int i = 0; i < data.traineeStatusPieChart().labels().size(); i++) {
            pieChart.addSeries(data.traineeStatusPieChart().labels().get(i), data.traineeStatusPieChart().values().get(i));
        }
        addImage(doc, BitmapEncoder.getBitmapBytes(pieChart, BitmapEncoder.BitmapFormat.PNG));

        doc.add(Chunk.NEWLINE);

        CategoryChart barChart = new CategoryChartBuilder().width(600).height(350).title(data.topDistrictsBarChart().seriesName()).build();
        styleChart(barChart.getStyler());
        barChart.addSeries("Count", data.topDistrictsBarChart().labels(), data.topDistrictsBarChart().values());
        addImage(doc, BitmapEncoder.getBitmapBytes(barChart, BitmapEncoder.BitmapFormat.PNG));
    }

    private void renderCourseAnalytics(Document doc, CourseAnalyticsReportData data) throws Exception {
        addHeader(doc, data.header());
        
        doc.add(new Paragraph("Course Summary Analytics", HEADER_FONT));
        doc.add(Chunk.NEWLINE);

        PdfPTable statsTable = new PdfPTable(3);
        statsTable.setWidthPercentage(100);
        addTableHeader(statsTable, "Total Courses", "Total Modules", "Platform Avg Rating");
        addTableCell(statsTable, String.valueOf(data.summaryStats().totalCourses()), 0);
        addTableCell(statsTable, String.valueOf(data.summaryStats().totalModules()), 0);
        addTableCell(statsTable, data.summaryStats().platformAverageRating(), 0);
        doc.add(statsTable);
        doc.add(Chunk.NEWLINE);

        // Chart: Enrollment Trend
        CategoryChart lineChart = new CategoryChartBuilder().width(600).height(350).title("Enrollment vs Completion").build();
        styleChart(lineChart.getStyler());
        lineChart.getStyler().setLegendPosition(Styler.LegendPosition.OutsideE);
        for (var entry : data.enrollmentVsCompletionTrendChart().seriesData().entrySet()) {
            lineChart.addSeries(entry.getKey(), data.enrollmentVsCompletionTrendChart().xAxisLabels(), entry.getValue());
        }
        addImage(doc, BitmapEncoder.getBitmapBytes(lineChart, BitmapEncoder.BitmapFormat.PNG));
        doc.add(Chunk.NEWLINE);

        // Table: Course Performance
        doc.add(new Paragraph("Detailed Course Performance", HEADER_FONT));
        doc.add(Chunk.NEWLINE);
        PdfPTable table = new PdfPTable(4);
        table.setWidthPercentage(100);
        table.setWidths(new float[]{4f, 2f, 2f, 2f});
        addTableHeader(table, "Course Name", "Enrolled", "Completion", "Avg Rating");
        
        int rowIdx = 0;
        for (CoursePerformanceTableRow row : data.performanceTable()) {
            addTableCell(table, row.courseName(), rowIdx);
            addTableCell(table, String.valueOf(row.enrolledCount()), rowIdx);
            addTableCell(table, row.completionPercentage(), rowIdx);
            addTableCell(table, row.averageRating(), rowIdx);
            rowIdx++;
        }
        doc.add(table);

        // Table: Assessments
        doc.add(Chunk.NEWLINE);
        doc.add(new Paragraph("Assessments & Certificates", HEADER_FONT));
        doc.add(Chunk.NEWLINE);
        PdfPTable asmTable = new PdfPTable(7);
        asmTable.setWidthPercentage(100);
        asmTable.setWidths(new float[]{3f, 3f, 3f, 2f, 2f, 2f, 2f});
        addTableHeader(asmTable, "Course", "Quiz", "Trainee", "Status", "Attempt Date", "Cert?", "Cert Date");
        
        rowIdx = 0;
        for (var row : data.assessmentTable()) {
            addTableCell(asmTable, row.courseName(), rowIdx);
            addTableCell(asmTable, row.quizTitle(), rowIdx);
            addTableCell(asmTable, row.traineeName(), rowIdx);
            addTableCell(asmTable, row.attemptStatus(), rowIdx);
            addTableCell(asmTable, row.dateAttempted(), rowIdx);
            addTableCell(asmTable, row.certificateIssued() ? "Yes" : "No", rowIdx);
            addTableCell(asmTable, row.certificateDate(), rowIdx);
            rowIdx++;
        }
        doc.add(asmTable);

        // Table: Library Resources
        doc.add(Chunk.NEWLINE);
        doc.add(new Paragraph("Library Resources Shared", HEADER_FONT));
        doc.add(Chunk.NEWLINE);
        PdfPTable libTable = new PdfPTable(4);
        libTable.setWidthPercentage(100);
        libTable.setWidths(new float[]{3f, 4f, 2f, 2f});
        addTableHeader(libTable, "Course Name", "Resource Title", "Type", "Uploaded Date");
        
        rowIdx = 0;
        for (var row : data.libraryTable()) {
            addTableCell(libTable, row.courseName(), rowIdx);
            addTableCell(libTable, row.resourceTitle(), rowIdx);
            addTableCell(libTable, row.resourceType(), rowIdx);
            addTableCell(libTable, row.uploadedDate(), rowIdx);
            rowIdx++;
        }
        doc.add(libTable);

        // Table: Interactions
        doc.add(Chunk.NEWLINE);
        doc.add(new Paragraph("Course Interactions", HEADER_FONT));
        doc.add(Chunk.NEWLINE);
        PdfPTable intTable = new PdfPTable(6);
        intTable.setWidthPercentage(100);
        intTable.setWidths(new float[]{3f, 4f, 3f, 2f, 1f, 2f});
        addTableHeader(intTable, "Course", "Thread", "Author", "Role", "Replies", "Date");
        
        rowIdx = 0;
        for (var row : data.interactionTable()) {
            addTableCell(intTable, row.courseName(), rowIdx);
            addTableCell(intTable, row.threadTitle(), rowIdx);
            addTableCell(intTable, row.authorName(), rowIdx);
            addTableCell(intTable, row.authorType(), rowIdx);
            addTableCell(intTable, String.valueOf(row.replyCount()), rowIdx);
            addTableCell(intTable, row.createdDate(), rowIdx);
            rowIdx++;
        }
        doc.add(intTable);
    }

    private void renderTraineeProgress(Document doc, TraineeProgressReportData data) throws Exception {
        addHeader(doc, data.header());
        
        doc.add(new Paragraph("Progress Summary", HEADER_FONT));
        doc.add(Chunk.NEWLINE);

        PdfPTable statsTable = new PdfPTable(2);
        statsTable.setWidthPercentage(100);
        addTableHeader(statsTable, "Avg Days to Completion", "Global Dropout Rate");
        addTableCell(statsTable, data.summaryStats().averageDaysToCompletion(), 0);
        addTableCell(statsTable, data.summaryStats().globalDropoutRate(), 0);
        doc.add(statsTable);
        doc.add(Chunk.NEWLINE);

        // Table: Withdrawal Logs
        doc.add(new Paragraph("Recent Withdrawals Log", HEADER_FONT));
        doc.add(Chunk.NEWLINE);
        PdfPTable table = new PdfPTable(4);
        table.setWidthPercentage(100);
        table.setWidths(new float[]{2f, 3f, 3f, 4f});
        addTableHeader(table, "Date", "Trainee Name", "Course", "Reason");
        
        int rowIdx = 0;
        for (WithdrawalLogTableRow row : data.withdrawalLogs()) {
            addTableCell(table, row.dateOfWithdrawal(), rowIdx);
            addTableCell(table, row.traineeName(), rowIdx);
            addTableCell(table, row.courseName(), rowIdx);
            addTableCell(table, row.withdrawalReason(), rowIdx);
            rowIdx++;
        }
        doc.add(table);
    }

    // --- Helper Methods ---

    private void addHeader(Document doc, ReportHeader header) throws DocumentException {
        Paragraph title = new Paragraph(header.reportTitle(), TITLE_FONT);
        title.setAlignment(Element.ALIGN_CENTER);
        doc.add(title);
        
        Paragraph generatedInfo = new Paragraph("Generated by: " + header.generatedBy() + " | Date: " + header.generatedAtFormatted(), SUBTEXT_FONT);
        generatedInfo.setAlignment(Element.ALIGN_CENTER);
        doc.add(generatedInfo);
        
        Paragraph filters = new Paragraph("Filters: " + header.filterCriteriaDescription(), SUBTEXT_FONT);
        filters.setAlignment(Element.ALIGN_CENTER);
        doc.add(filters);
        
        doc.add(Chunk.NEWLINE);
        LineSeparator ls = new LineSeparator();
        ls.setLineColor(new Color(200, 200, 200));
        doc.add(new Chunk(ls));
        doc.add(Chunk.NEWLINE);
    }

    private void addImage(Document doc, byte[] imageBytes) throws Exception {
        Image img = Image.getInstance(imageBytes);
        img.setAlignment(Element.ALIGN_CENTER);
        // Scale to fit nicely on A4
        img.scaleToFit(500, 300);
        doc.add(img);
    }

    private void styleChart(Styler styler) {
        styler.setChartBackgroundColor(Color.WHITE);
        styler.setPlotBackgroundColor(Color.WHITE);
        styler.setChartTitleBoxBackgroundColor(Color.WHITE);
        styler.setChartTitleBoxBorderColor(Color.WHITE);
        styler.setPlotBorderColor(Color.WHITE);
        styler.setLegendBackgroundColor(Color.WHITE);
        styler.setLegendBorderColor(Color.WHITE);
        styler.setChartFontColor(new Color(33, 37, 41));
        if (styler instanceof AxesChartStyler axesStyler) {
            axesStyler.setAxisTickLabelsColor(new Color(108, 117, 125));
        }
    }

    private void addTableHeader(PdfPTable table, String... headers) {
        for (String header : headers) {
            PdfPCell cell = new PdfPCell(new Phrase(header, TABLE_HEADER_FONT));
            cell.setBackgroundColor(TABLE_HEADER_BG);
            cell.setPaddingTop(8f);
            cell.setPaddingBottom(8f);
            cell.setPaddingLeft(5f);
            cell.setPaddingRight(5f);
            cell.setHorizontalAlignment(Element.ALIGN_CENTER);
            cell.setVerticalAlignment(Element.ALIGN_MIDDLE);
            cell.setBorderColor(new Color(200, 200, 200));
            table.addCell(cell);
        }
    }

    private void addTableCell(PdfPTable table, String text, int rowIndex) {
        PdfPCell cell = new PdfPCell(new Phrase(text, NORMAL_FONT));
        cell.setPaddingTop(6f);
        cell.setPaddingBottom(6f);
        cell.setPaddingLeft(5f);
        cell.setPaddingRight(5f);
        cell.setVerticalAlignment(Element.ALIGN_MIDDLE);
        cell.setBorderColor(new Color(220, 220, 220));
        if (rowIndex % 2 != 0) {
            cell.setBackgroundColor(TABLE_ROW_ALT_BG);
        }
        table.addCell(cell);
    }
}
