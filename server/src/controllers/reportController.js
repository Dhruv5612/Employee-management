import { ReportService } from '../services/reportService.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getReportSummary = asyncHandler(async (req, res) => {
  const summary = await ReportService.getSummaryReport(req.query);
  res.status(200).json({
    success: true,
    data: summary,
  });
});

export const exportEmployees = asyncHandler(async (req, res) => {
  const records = await ReportService.getExportData(req.query);

  if (req.query.format === 'csv') {
    // Generate CSV string
    const headers = [
      'Employee ID',
      'Full Name',
      'Email',
      'Phone',
      'Department',
      'Department Code',
      'Designation',
      'Joining Date',
      'Employment Status',
      'Created At',
    ];

    const rows = records.map((r) =>
      [
        r.employeeId,
        `"${r.fullName.replace(/"/g, '""')}"`,
        r.email,
        `"${r.phone}"`,
        `"${r.department}"`,
        r.departmentCode,
        `"${r.designation.replace(/"/g, '""')}"`,
        r.joiningDate,
        r.status,
        r.createdAt,
      ].join(',')
    );

    const csvContent = [headers.join(','), ...rows].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="employee_report_${Date.now()}.csv"`
    );
    return res.status(200).send(csvContent);
  }

  // Default JSON response
  res.status(200).json({
    success: true,
    data: records,
  });
});
