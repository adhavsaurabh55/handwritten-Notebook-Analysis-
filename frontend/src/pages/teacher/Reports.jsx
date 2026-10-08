import { useState, useEffect } from 'react';
import {
  FileText,
  Download,
  Printer,
  Copy,
  Check,
  Filter,
  BookOpen,
  GraduationCap,
  Sparkles,
} from 'lucide-react';

import { Card, Badge, Button, PageHeader } from '../../components/common';
import { getAllEvaluations } from '../../data/evaluationStore';

function Reports() {
  const [evaluations, setEvaluations] = useState([]);
  const [reportType, setReportType] = useState('class_summary');
  const [subjectFilter, setSubjectFilter] = useState('All');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setEvaluations(getAllEvaluations());
  }, []);

  const filtered = evaluations.filter((e) => subjectFilter === 'All' || (e.subject || '').includes(subjectFilter));

  const totalCount = filtered.length;
  const avgScore = totalCount > 0
    ? Math.round(filtered.reduce((acc, e) => acc + (e.percentage || 0), 0) / totalCount)
    : 0;

  const passedCount = filtered.filter((e) => e.percentage >= 50).length;
  const passRate = totalCount > 0 ? Math.round((passedCount / totalCount) * 100) : 0;

  // Print handle
  const handlePrint = () => {
    window.print();
  };

  // CSV Export handle
  const handleExportCSV = () => {
    if (filtered.length === 0) return;

    const headers = ['Submission ID', 'Student Name', 'Subject', 'Chapter', 'Obtained Marks', 'Total Marks', 'Percentage', 'Grade', 'Evaluation Date'];
    const rows = filtered.map((e) => [
      e.submissionId,
      `"${e.studentName || 'Saurabh Adhav'}"`,
      `"${e.subject}"`,
      `"${e.chapter}"`,
      e.obtainedMarks,
      e.totalMarks,
      `${e.percentage}%`,
      e.grade,
      `"${e.evaluationDate}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Teacher_Academic_Report_${reportType}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Copy Summary handle
  const handleCopySummary = () => {
    const text = `ACADEMIC EVALUATION REPORT SUMMARY\nTotal Submissions: ${totalCount}\nClass Average Score: ${avgScore}%\nPass Rate: ${passRate}%\nGenerated on: ${new Date().toLocaleDateString()}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 sm:space-y-8 pb-8 print:p-0">
      {/* ── HEADER ── */}
      <div className="print:hidden">
        <PageHeader
          title="Teacher Reports & Export Center"
          description="Generate academic performance summaries, printable report cards, and export evaluation datasets."
          breadcrumbs={[
            { label: 'Teacher Dashboard', path: '/teacher' },
            { label: 'Reports' },
          ]}
          actions={
            <div className="flex gap-2">
              <Button variant="outline" size="sm" icon={copied ? <Check className="h-4 w-4 text-[#10B981]" /> : <Copy className="h-4 w-4" />} onClick={handleCopySummary}>
                {copied ? 'Copied!' : 'Copy Summary'}
              </Button>
              <Button variant="outline" size="sm" icon={<Printer className="h-4 w-4" />} onClick={handlePrint}>
                Print PDF Report
              </Button>
              <Button variant="primary" size="sm" icon={<Download className="h-4 w-4" />} onClick={handleExportCSV}>
                Export CSV
              </Button>
            </div>
          }
        />
      </div>

      {/* ── REPORT CONFIGURATION BAR ── */}
      <Card className="print:hidden">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-4">
          <Filter className="h-4 w-4 text-[#4F46E5]" />
          Report Configuration & Filters
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Report Type</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-900 focus:outline-none focus:border-[#4F46E5]"
            >
              <option value="class_summary">Class Performance Summary Report</option>
              <option value="student_card">Student Individual Progress Report</option>
              <option value="subject_analysis">Subject-wise Evaluation Report</option>
              <option value="detailed_log">Full OCR & Evaluation Audit Log</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Subject Filter</label>
            <select
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-900 focus:outline-none focus:border-[#4F46E5]"
            >
              <option value="All">All Subjects</option>
              <option value="English">English</option>
              <option value="Math">Mathematics</option>
              <option value="EVS">EVS</option>
              <option value="Hindi">Hindi</option>
              <option value="Science">Science</option>
            </select>
          </div>
        </div>
      </Card>

      {/* ── PRINTABLE REPORT DOCUMENT PREVIEW ── */}
      <Card className="bg-white border-2 border-gray-200 p-8 shadow-lg print:shadow-none print:border-none">
        {/* Document Header */}
        <div className="border-b-2 border-gray-900 pb-6 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <GraduationCap className="h-7 w-7 text-[#4F46E5]" />
              <h1 className="text-2xl font-black text-gray-900 tracking-tight">AI Handwritten Notebook Evaluation Report</h1>
            </div>
            <p className="text-xs text-gray-500 mt-1">Class V Academic Performance & Verification Log</p>
          </div>

          <div className="text-left sm:text-right">
            <Badge variant="primary" size="md">Official Academic Report</Badge>
            <p className="text-xs text-gray-400 mt-1">Generated: {new Date().toLocaleDateString('en-US', { dateStyle: 'medium' })}</p>
          </div>
        </div>

        {/* Report Key Metrics */}
        <div className="grid grid-cols-3 gap-4 mb-6 p-4 rounded-xl bg-gray-50 border border-gray-100">
          <div>
            <span className="text-xs text-gray-400 font-medium">Total Evaluated</span>
            <p className="text-xl font-bold text-gray-900">{totalCount} Notebooks</p>
          </div>
          <div>
            <span className="text-xs text-gray-400 font-medium">Class Average Score</span>
            <p className="text-xl font-bold text-[#4F46E5]">{avgScore}%</p>
          </div>
          <div>
            <span className="text-xs text-gray-400 font-medium">Class Pass Rate</span>
            <p className="text-xl font-bold text-[#10B981]">{passRate}%</p>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto mb-6">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-200 bg-gray-50">
                <th className="py-2.5 px-3 text-xs font-bold text-gray-700 uppercase">Student Name</th>
                <th className="py-2.5 px-3 text-xs font-bold text-gray-700 uppercase">Subject</th>
                <th className="py-2.5 px-3 text-xs font-bold text-gray-700 uppercase">Chapter</th>
                <th className="py-2.5 px-3 text-xs font-bold text-gray-700 uppercase text-center">Marks</th>
                <th className="py-2.5 px-3 text-xs font-bold text-gray-700 uppercase text-center">Grade</th>
                <th className="py-2.5 px-3 text-xs font-bold text-gray-700 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((item) => (
                <tr key={item.submissionId} className="text-xs text-gray-800">
                  <td className="py-3 px-3 font-semibold">{item.studentName || 'Saurabh Adhav'}</td>
                  <td className="py-3 px-3">{item.subject}</td>
                  <td className="py-3 px-3 max-w-xs truncate">{item.chapter}</td>
                  <td className="py-3 px-3 text-center font-bold">{item.obtainedMarks} / {item.totalMarks} ({item.percentage}%)</td>
                  <td className="py-3 px-3 text-center font-bold">{item.grade}</td>
                  <td className="py-3 px-3 uppercase text-[10px] font-bold text-[#10B981]">{item.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Document Footer Signature */}
        <div className="pt-8 border-t border-gray-200 flex justify-between items-end text-xs text-gray-400">
          <div>
            <p className="font-semibold text-gray-700">Handwritten Notebook Evaluation System</p>
            <p>Powered by Tesseract OCR & Flan-T5 Evaluation Model</p>
          </div>
          <div className="text-right border-t border-gray-300 pt-2 w-48">
            <p className="font-semibold text-gray-700">Teacher Signature</p>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default Reports;
