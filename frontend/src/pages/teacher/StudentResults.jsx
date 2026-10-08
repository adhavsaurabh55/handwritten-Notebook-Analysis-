import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Filter,
  Eye,
  BookOpen,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Download,
  GraduationCap,
  Award,
  BarChart2,
  RefreshCw,
  FileSpreadsheet,
} from 'lucide-react';

import { Card, Badge, Button, PageHeader, EmptyState } from '../../components/common';
import { getAllEvaluations } from '../../data/evaluationStore';

const subjectMeta = {
  'English (Marigold)': { gradient: 'from-[#4F46E5] to-indigo-600', short: 'EN' },
  English:              { gradient: 'from-violet-500 to-purple-600', short: 'EN' },
  Mathematics:          { gradient: 'from-blue-500 to-blue-600', short: 'MA' },
  'Maths (NCERT)':      { gradient: 'from-blue-500 to-blue-600', short: 'MA' },
  EVS:                  { gradient: 'from-emerald-500 to-teal-600', short: 'EV' },
  'EVS (Looking Around)':{ gradient: 'from-emerald-500 to-teal-600', short: 'EV' },
  Hindi:                { gradient: 'from-orange-500 to-amber-500', short: 'HI' },
  'Hindi (Rimjhim)':     { gradient: 'from-orange-500 to-amber-500', short: 'HI' },
  Science:              { gradient: 'from-cyan-500 to-sky-600', short: 'SC' },
};

const gradeVariant = { 'A+': 'success', A: 'success', B: 'primary', C: 'warning', F: 'danger' };

function TeacherStudentResults() {
  const navigate = useNavigate();
  const [evaluations, setEvaluations] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('All');
  const [gradeFilter, setGradeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const reloadData = () => {
    setEvaluations(getAllEvaluations());
  };

  useEffect(() => {
    reloadData();
    window.addEventListener('focus', reloadData);
    window.addEventListener('storage', reloadData);
    return () => {
      window.removeEventListener('focus', reloadData);
      window.removeEventListener('storage', reloadData);
    };
  }, []);

  // Filter evaluations dynamically
  const filteredEvaluations = useMemo(() => {
    return evaluations.filter((e) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        (e.studentName || '').toLowerCase().includes(q) ||
        (e.notebookName || '').toLowerCase().includes(q) ||
        (e.subject || '').toLowerCase().includes(q) ||
        (e.chapter || '').toLowerCase().includes(q);

      const matchesSubject =
        subjectFilter === 'All' ||
        (e.subject || '').toLowerCase().includes(subjectFilter.toLowerCase());

      const matchesGrade = gradeFilter === 'All' || e.grade === gradeFilter;
      const matchesStatus = statusFilter === 'All' || e.status === statusFilter;

      return matchesSearch && matchesSubject && matchesGrade && matchesStatus;
    });
  }, [evaluations, searchQuery, subjectFilter, gradeFilter, statusFilter]);

  // Compute stats
  const totalCount = evaluations.length;
  const highPerformers = evaluations.filter((e) => e.percentage >= 80).length;
  const needsSupport = evaluations.filter((e) => e.percentage < 60).length;
  const passRate = totalCount > 0 ? Math.round((evaluations.filter((e) => e.percentage >= 50).length / totalCount) * 100) : 0;

  // Export CSV function
  const handleExportCSV = () => {
    if (filteredEvaluations.length === 0) return;

    const headers = ['Submission ID', 'Student Name', 'Subject', 'Chapter', 'Marks Obtained', 'Total Marks', 'Percentage', 'Grade', 'Status', 'Date'];
    const rows = filteredEvaluations.map((e) => [
      e.submissionId,
      `"${e.studentName || 'Saurabh Adhav'}"`,
      `"${e.subject}"`,
      `"${e.chapter}"`,
      e.obtainedMarks,
      e.totalMarks,
      `${e.percentage}%`,
      e.grade,
      e.status,
      `"${e.submissionDate}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Student_Results_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 sm:space-y-8 pb-8">
      {/* ── HEADER ── */}
      <PageHeader
        title="Student Evaluation Results"
        description="Comprehensive evaluation records, handwritten notebook scores, and detailed AI feedback."
        breadcrumbs={[
          { label: 'Teacher Dashboard', path: '/teacher' },
          { label: 'Student Results' },
        ]}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" icon={<RefreshCw className="h-4 w-4" />} onClick={reloadData}>
              Refresh Data
            </Button>
            <Button variant="primary" size="sm" icon={<FileSpreadsheet className="h-4 w-4" />} onClick={handleExportCSV}>
              Export CSV
            </Button>
          </div>
        }
      />

      {/* ── STATS ROW ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-[#4F46E5]/10 flex items-center justify-center text-[#4F46E5]">
            <BookOpen className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium">Total Evaluations</p>
            <p className="text-2xl font-black text-gray-900 mt-0.5">{totalCount}</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-green-500/10 flex items-center justify-center text-[#10B981]">
            <Award className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium">High Performers (≥80%)</p>
            <p className="text-2xl font-black text-gray-900 mt-0.5">{highPerformers}</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-600">
            <AlertCircle className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium">Needs Support (&lt;60%)</p>
            <p className="text-2xl font-black text-gray-900 mt-0.5">{needsSupport}</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-600">
            <GraduationCap className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium">Class Pass Rate</p>
            <p className="text-2xl font-black text-gray-900 mt-0.5">{passRate}%</p>
          </div>
        </Card>
      </div>

      {/* ── CONTROLS & SEARCH ── */}
      <Card>
        <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
          {/* Search */}
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by student, subject, chapter, or notebook..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/20 transition-all"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Filters:</span>
            </div>

            {/* Subject Dropdown */}
            <select
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 bg-white focus:outline-none focus:border-[#4F46E5]"
            >
              <option value="All">All Subjects</option>
              <option value="English">English</option>
              <option value="Math">Mathematics</option>
              <option value="EVS">EVS</option>
              <option value="Hindi">Hindi</option>
              <option value="Science">Science</option>
            </select>

            {/* Grade Dropdown */}
            <select
              value={gradeFilter}
              onChange={(e) => setGradeFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 bg-white focus:outline-none focus:border-[#4F46E5]"
            >
              <option value="All">All Grades</option>
              <option value="A+">Grade A+</option>
              <option value="A">Grade A</option>
              <option value="B">Grade B</option>
              <option value="C">Grade C</option>
              <option value="F">Grade F</option>
            </select>

            {/* Status Dropdown */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 bg-white focus:outline-none focus:border-[#4F46E5]"
            >
              <option value="All">All Statuses</option>
              <option value="evaluated">Evaluated</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
            </select>
          </div>
        </div>
      </Card>

      {/* ── RESULTS TABLE ── */}
      <Card padding="none" className="overflow-hidden">
        {filteredEvaluations.length === 0 ? (
          <div className="py-12">
            <EmptyState
              icon={BookOpen}
              title="No Evaluation Records Found"
              description="No student evaluations match your selected search or filter criteria."
              action={
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    setSearchQuery('');
                    setSubjectFilter('All');
                    setGradeFilter('All');
                    setStatusFilter('All');
                  }}
                >
                  Reset All Filters
                </Button>
              }
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/60 text-left">
                  <th className="px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Student</th>
                  <th className="px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Subject & Chapter</th>
                  <th className="px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Notebook</th>
                  <th className="px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Score</th>
                  <th className="px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Grade</th>
                  <th className="px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredEvaluations.map((row) => {
                  const meta = subjectMeta[row.subject] || { gradient: 'from-[#4F46E5] to-indigo-600', short: 'EN' };
                  const scoreColor = row.percentage >= 80 ? 'text-[#10B981]' : row.percentage >= 60 ? 'text-amber-600' : 'text-red-600';
                  return (
                    <tr key={row.submissionId} className="hover:bg-gray-50/60 transition-colors">
                      {/* Student Name */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-[#4F46E5] to-indigo-600 flex items-center justify-center font-bold text-white text-xs">
                            {(row.studentName || 'SA').slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900">{row.studentName || 'Saurabh Adhav'}</p>
                            <p className="text-[11px] text-gray-400">ID: {row.submissionId}</p>
                          </div>
                        </div>
                      </td>

                      {/* Subject & Chapter */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2.5">
                          <span className={`h-8 w-8 rounded-lg bg-gradient-to-br ${meta.gradient} flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0`}>
                            {meta.short}
                          </span>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{row.subject}</p>
                            <p className="text-xs text-gray-400 truncate">{row.chapter}</p>
                          </div>
                        </div>
                      </td>

                      {/* Notebook */}
                      <td className="px-6 py-4">
                        <p className="text-xs font-medium text-gray-700 max-w-xs truncate">{row.notebookName}</p>
                      </td>

                      {/* Score */}
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className={`text-sm font-bold ${scoreColor}`}>
                              {row.obtainedMarks}/{row.totalMarks}
                            </span>
                            <span className="text-xs text-gray-400">({row.percentage}%)</span>
                          </div>
                          <div className="h-1.5 w-24 rounded-full bg-gray-100 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${row.percentage >= 80 ? 'bg-[#10B981]' : row.percentage >= 60 ? 'bg-amber-500' : 'bg-red-500'}`}
                              style={{ width: `${row.percentage}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Grade */}
                      <td className="px-6 py-4">
                        <Badge variant={gradeVariant[row.grade] || 'primary'} size="sm">
                          Grade {row.grade}
                        </Badge>
                      </td>

                      {/* Date */}
                      <td className="px-6 py-4 text-xs text-gray-500">{row.submissionDate}</td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <Button
                          variant="primary"
                          size="xs"
                          icon={<Eye className="h-3.5 w-3.5" />}
                          onClick={() => navigate(`/teacher/feedback/${row.submissionId}`)}
                        >
                          View Feedback
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}

export default TeacherStudentResults;
