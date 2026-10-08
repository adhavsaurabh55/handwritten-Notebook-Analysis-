import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import {
  Users,
  BookOpen,
  Clock,
  TrendingUp,
  Eye,
  Upload,
  BarChart3,
  ShieldAlert,
  FileText,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  GraduationCap,
  Sparkles,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

import { Card, Badge, Button, PageHeader } from '../../components/common';
import { StatCard } from '../../components/cards';
import { getAllEvaluations } from '../../data/evaluationStore';

const quickActions = [
  { label: 'Bulk Upload', icon: Upload, path: '/teacher/bulk-upload', variant: 'primary', caption: 'Upload multiple notebooks' },
  { label: 'Student Results', icon: Eye, path: '/teacher/student-results', variant: 'outline', caption: 'View all evaluations' },
  { label: 'Analytics', icon: BarChart3, path: '/teacher/analytics', variant: 'outline', caption: 'Class performance insights' },
  { label: 'Plagiarism', icon: ShieldAlert, path: '/teacher/plagiarism', variant: 'outline', caption: 'Check for plagiarism' },
  { label: 'Reports', icon: FileText, path: '/teacher/reports', variant: 'outline', caption: 'Generate & export reports' },
];

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

const statusConfig = {
  evaluated: { label: 'Evaluated', variant: 'success', icon: CheckCircle },
  processing: { label: 'Processing', variant: 'warning', icon: Clock },
  pending:    { label: 'Pending', variant: 'warning', icon: AlertCircle },
};

const gradeVariant = { 'A+': 'success', A: 'success', B: 'primary', C: 'warning', F: 'danger' };

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-xl px-4 py-3 min-w-[140px]">
      <p className="text-xs font-semibold text-gray-400 mb-2">{label}</p>
      {payload.map((entry) => (
        <div key={entry.dataKey} className="flex items-center justify-between gap-4 text-sm mb-1 last:mb-0">
          <span className="flex items-center gap-1.5 text-gray-500">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
            {entry.name}
          </span>
          <span className="font-bold text-gray-900">{entry.value}%</span>
        </div>
      ))}
    </div>
  );
}

function TeacherDashboard() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [evaluations, setEvaluations] = useState([]);

  const teacherName = user?.name || 'Teacher';
  const teacherEmail = user?.email || '';

  useEffect(() => {
    setEvaluations(getAllEvaluations());
  }, []);

  // Compute live summary stats
  const totalSubmissions = evaluations.length;
  const studentSet = new Set(evaluations.map((e) => e.studentName || 'Saurabh Adhav'));
  const totalStudents = Math.max(studentSet.size, 1);
  const pendingCount = evaluations.filter((e) => e.status === 'pending').length;
  const avgClassScore = totalSubmissions > 0
    ? Math.round(evaluations.reduce((acc, e) => acc + (e.percentage || 0), 0) / totalSubmissions)
    : 0;

  const summaryStats = [
    { title: 'Total Students', value: totalStudents, icon: <Users className="h-5 w-5" />, bgGradient: 'blue', trend: 10, trendLabel: 'active class' },
    { title: 'Total Submissions', value: totalSubmissions, icon: <BookOpen className="h-5 w-5" />, bgGradient: 'purple', trend: 15, trendLabel: 'evaluated live' },
    { title: 'Pending Reviews', value: pendingCount, icon: <Clock className="h-5 w-5" />, bgGradient: 'orange' },
    { title: 'Avg Class Score', value: `${avgClassScore}%`, icon: <TrendingUp className="h-5 w-5" />, bgGradient: 'green', trend: 5, trendLabel: 'live average' },
  ];

  // Subject-wise performance calculations
  const subjectGroupMap = {};
  evaluations.forEach((e) => {
    const subjName = (e.subject || 'General').split(' ')[0]; // English, Maths, EVS...
    if (!subjectGroupMap[subjName]) {
      subjectGroupMap[subjName] = { total: 0, count: 0 };
    }
    subjectGroupMap[subjName].total += e.percentage;
    subjectGroupMap[subjName].count += 1;
  });

  const subjectChartData = Object.keys(subjectGroupMap).length > 0
    ? Object.keys(subjectGroupMap).map((subj) => ({
        subject: subj,
        avg: Math.round(subjectGroupMap[subj].total / subjectGroupMap[subj].count),
      }))
    : [
        { subject: 'English', avg: 85 },
        { subject: 'Maths', avg: 90 },
        { subject: 'EVS', avg: 80 },
        { subject: 'Hindi', avg: 75 },
      ];

  // Performance over time (aggregated or template fallback)
  const performanceChartData = [
    { month: 'Week 1', avg: Math.max(avgClassScore - 15, 60), top: 95 },
    { month: 'Week 2', avg: Math.max(avgClassScore - 8, 65), top: 98 },
    { month: 'Week 3', avg: Math.max(avgClassScore - 3, 70), top: 100 },
    { month: 'Current', avg: avgClassScore, top: 100 },
  ];

  // Grade counts calculation
  const gradeCounts = { 'A+': 0, A: 0, B: 0, C: 0, F: 0 };
  evaluations.forEach((e) => {
    if (e.grade && gradeCounts[e.grade] !== undefined) {
      gradeCounts[e.grade] += 1;
    } else if (e.percentage >= 90) gradeCounts['A+'] += 1;
    else if (e.percentage >= 80) gradeCounts['A'] += 1;
    else if (e.percentage >= 70) gradeCounts['B'] += 1;
    else if (e.percentage >= 50) gradeCounts['C'] += 1;
    else gradeCounts['F'] += 1;
  });

  const recentEvaluations = evaluations.slice(0, 6);
  const pendingSubmissions = evaluations.filter((e) => e.status === 'pending');

  return (
    <div className="space-y-6 sm:space-y-8 pb-8">
      {/* ── WELCOME BANNER ── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#4F46E5] via-[#4338CA] to-[#3730A3] rounded-3xl p-6 sm:p-8 shadow-xl shadow-[#4F46E5]/20">
        <div className="absolute -top-24 -right-24 h-72 w-72 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-16 h-64 w-64 bg-white/5 rounded-full blur-3xl" />
        <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center flex-shrink-0">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
                Welcome back, {teacherName}! 👋
              </h1>
              <p className="text-indigo-200 text-sm mt-0.5">
                {teacherEmail ? `${teacherEmail} · ` : ''}Monitor live student evaluations, accurate OCR results, and academic performance.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 flex-shrink-0">
            <button
              onClick={() => navigate('/teacher/bulk-upload')}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-[#4F46E5] font-semibold text-sm rounded-xl hover:bg-indigo-50 transition-all shadow-lg hover:-translate-y-0.5 active:scale-[0.97]"
            >
              <Upload className="h-4 w-4" />
              Bulk Upload
            </button>
            <button
              onClick={() => navigate('/teacher/student-results')}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 border border-white/20 text-white font-semibold text-sm rounded-xl hover:bg-white/20 transition-all"
            >
              <Eye className="h-4 w-4" />
              View All Results
            </button>
          </div>
        </div>
      </div>

      {/* ── SUMMARY STATS ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
        {summaryStats.map((s) => (
          <StatCard key={s.title} {...s} />
        ))}
      </div>

      {/* ── QUICK ACTIONS ── */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-4">Teacher Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {quickActions.map(({ label, icon: Icon, path, variant, caption }) => (
            <button
              key={label}
              onClick={() => navigate(path)}
              className={`group relative overflow-hidden rounded-2xl border p-4 transition-all duration-300 text-left
                ${
                  variant === 'primary'
                    ? 'bg-gradient-to-br from-[#4F46E5] to-[#4338CA] border-transparent text-white shadow-lg shadow-[#4F46E5]/25 hover:shadow-xl hover:-translate-y-0.5'
                    : 'bg-white border-gray-100 text-gray-700 shadow-sm hover:shadow-lg hover:-translate-y-0.5 hover:border-gray-200'
                }`}
            >
              <div
                className={`h-10 w-10 rounded-xl flex items-center justify-center mb-3 ${
                  variant === 'primary' ? 'bg-white/15' : 'bg-[#4F46E5]/10'
                }`}
              >
                <Icon className={`h-5 w-5 ${variant === 'primary' ? 'text-white' : 'text-[#4F46E5]'}`} />
              </div>
              <p className={`text-sm font-semibold ${variant === 'primary' ? 'text-white' : 'text-gray-900'}`}>{label}</p>
              <p className={`text-xs mt-0.5 ${variant === 'primary' ? 'text-indigo-200' : 'text-gray-400'}`}>{caption}</p>
            </button>
          ))}
        </div>
      </div>

      {/* ── MAIN GRID ── */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* LEFT: Pending Reviews + Live Evaluated Submissions */}
        <div className="lg:col-span-2 space-y-6">
          {/* Pending Reviews */}
          {pendingSubmissions.length > 0 && (
            <Card padding="none" className="overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-amber-500" />
                  Pending Reviews
                  <Badge variant="warning" size="sm">{pendingSubmissions.length}</Badge>
                </h3>
                <button
                  onClick={() => navigate('/teacher/student-results')}
                  className="text-sm font-medium text-[#4F46E5] hover:text-[#4338CA] transition-colors inline-flex items-center gap-1"
                >
                  View all <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="divide-y divide-gray-50">
                {pendingSubmissions.map((item) => {
                  const meta = subjectMeta[item.subject] || { gradient: 'from-gray-400 to-gray-500', short: '??' };
                  return (
                    <div key={item.submissionId} className="flex items-center gap-4 px-6 py-3.5 hover:bg-gray-50/60 transition-colors">
                      <span className={`h-9 w-9 rounded-xl bg-gradient-to-br ${meta.gradient} flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0 shadow-sm`}>
                        {meta.short}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">{item.studentName || 'Student'}</p>
                        <p className="text-xs text-gray-400 truncate">{item.subject} · {item.chapter}</p>
                      </div>
                      <span className="text-xs text-gray-400 flex-shrink-0 hidden sm:block">{item.submissionDate}</span>
                      <Button
                        variant="ghost"
                        size="xs"
                        icon={<Eye className="h-3.5 w-3.5" />}
                        onClick={() => navigate(`/teacher/feedback/${item.submissionId}`)}
                      >
                        Review
                      </Button>
                    </div>
                  );
                })}
              </div>
            </Card>
          )}

          {/* Live Student Evaluated Submissions */}
          <Card padding="none" className="overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-[#4F46E5]" />
                Live Evaluated Submissions
              </h3>
              <button
                onClick={() => navigate('/teacher/student-results')}
                className="text-sm font-medium text-[#4F46E5] hover:text-[#4338CA] transition-colors inline-flex items-center gap-1"
              >
                View all <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-50 bg-gray-50/60">
                    {['Student', 'Subject & Chapter', 'Date', 'Score', 'Grade', 'Status', 'Action'].map((h) => (
                      <th
                        key={h}
                        className={`px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider ${
                          h === 'Action' ? 'text-right' : 'text-left'
                        }`}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {recentEvaluations.map((row) => {
                    const meta = subjectMeta[row.subject] || { gradient: 'from-[#4F46E5] to-indigo-600', short: 'EN' };
                    const sc = statusConfig[row.status] || statusConfig.evaluated;
                    const StatusIcon = sc.icon;
                    return (
                      <tr key={row.submissionId} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-3.5">
                          <p className="text-sm font-semibold text-gray-900">{row.studentName || 'Saurabh Adhav'}</p>
                        </td>
                        <td className="px-6 py-3.5">
                          <div className="flex items-center gap-2">
                            <span
                              className={`h-7 w-7 rounded-lg bg-gradient-to-br ${meta.gradient} flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0`}
                            >
                              {meta.short}
                            </span>
                            <div className="min-w-0">
                              <p className="text-sm text-gray-900 font-medium truncate">{row.subject}</p>
                              <p className="text-xs text-gray-400 truncate">{row.chapter}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-3.5 text-sm text-gray-500">{row.submissionDate}</td>
                        <td className="px-6 py-3.5">
                          <span
                            className={`text-sm font-bold ${
                              row.percentage >= 80 ? 'text-[#10B981]' : row.percentage >= 60 ? 'text-amber-600' : 'text-red-600'
                            }`}
                          >
                            {row.obtainedMarks}/{row.totalMarks} ({row.percentage}%)
                          </span>
                        </td>
                        <td className="px-6 py-3.5">
                          <Badge variant={gradeVariant[row.grade] || 'primary'} size="sm">
                            {row.grade}
                          </Badge>
                        </td>
                        <td className="px-6 py-3.5">
                          <Badge variant={sc.variant} size="sm">
                            <StatusIcon className="h-3 w-3" />
                            {sc.label}
                          </Badge>
                        </td>
                        <td className="px-6 py-3.5 text-right">
                          <Button
                            variant="ghost"
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

            {/* Mobile cards */}
            <div className="md:hidden divide-y divide-gray-50">
              {recentEvaluations.map((row) => {
                const meta = subjectMeta[row.subject] || { gradient: 'from-[#4F46E5] to-indigo-600', short: 'EN' };
                const sc = statusConfig[row.status] || statusConfig.evaluated;
                const StatusIcon = sc.icon;
                return (
                  <div key={row.submissionId} className="px-5 py-4 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className={`h-8 w-8 rounded-lg bg-gradient-to-br ${meta.gradient} flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0`}>
                          {meta.short}
                        </span>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate">{row.studentName || 'Saurabh Adhav'}</p>
                          <p className="text-xs text-gray-400 truncate">{row.subject} · {row.submissionDate}</p>
                        </div>
                      </div>
                      <span className={`text-base font-black flex-shrink-0 ${row.percentage >= 80 ? 'text-[#10B981]' : row.percentage >= 60 ? 'text-amber-600' : 'text-red-600'}`}>
                        {row.percentage}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <Badge variant={sc.variant} size="xs">
                        <StatusIcon className="h-3 w-3" />
                        {sc.label}
                      </Badge>
                      <Button variant="ghost" size="xs" icon={<Eye className="h-3.5 w-3.5" />} onClick={() => navigate(`/teacher/feedback/${row.submissionId}`)}>
                        View
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* RIGHT: Live Analytics Charts */}
        <div className="space-y-6">
          {/* Class Performance Over Time */}
          <Card>
            <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-1">
              <TrendingUp className="h-4 w-4 text-[#4F46E5]" />
              Class Score Trend
            </h3>
            <p className="text-xs text-gray-400 mb-4">Evaluated average vs top score</p>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceChartData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9CA3AF' }} tickLine={false} axisLine={false} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#9CA3AF' }} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} />
                  <Tooltip content={<ChartTooltip />} cursor={{ stroke: '#E5E7EB', strokeDasharray: '4 4' }} />
                  <Legend verticalAlign="top" align="right" height={28} iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, color: '#6B7280' }} />
                  <Line type="monotone" dataKey="avg" name="Class Avg" stroke="#4F46E5" strokeWidth={2.5} dot={{ r: 3, fill: '#4F46E5', stroke: '#fff', strokeWidth: 2 }} activeDot={{ r: 5 }} />
                  <Line type="monotone" dataKey="top" name="Top Score" stroke="#10B981" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Subject-wise Average */}
          <Card>
            <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-1">
              <BarChart3 className="h-4 w-4 text-[#4F46E5]" />
              Subject Averages
            </h3>
            <p className="text-xs text-gray-400 mb-4">Average score per subject</p>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={subjectChartData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                  <XAxis dataKey="subject" tick={{ fontSize: 10, fill: '#9CA3AF' }} tickLine={false} axisLine={false} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#9CA3AF' }} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} />
                  <Tooltip formatter={(v) => [`${v}%`, 'Avg']} contentStyle={{ borderRadius: '12px', border: '1px solid #f0f0f0', fontSize: 12 }} />
                  <Bar dataKey="avg" name="Avg Score" fill="#4F46E5" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Dynamic Grade Distribution */}
          <Card>
            <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-4">
              <BarChart3 className="h-4 w-4 text-[#4F46E5]" />
              Grade Distribution
            </h3>
            <div className="grid grid-cols-4 gap-2">
              {[
                { grade: 'A+', count: gradeCounts['A+'], variant: 'success' },
                { grade: 'A', count: gradeCounts['A'], variant: 'success' },
                { grade: 'B', count: gradeCounts['B'], variant: 'primary' },
                { grade: 'C', count: gradeCounts['C'], variant: 'warning' },
              ].map(({ grade, count, variant }) => (
                <div key={grade} className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-gray-50/60 border border-gray-100">
                  <Badge variant={variant} size="md">{grade}</Badge>
                  <span className="text-xl font-black text-gray-900">{count}</span>
                  <span className="text-[10px] text-gray-400">submissions</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Quick links card */}
          <Card>
            <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-3">
              <Sparkles className="h-4 w-4 text-[#4F46E5]" />
              Teacher Tools
            </h3>
            <div className="space-y-2">
              {[
                { label: 'Student Results & Evaluations', path: '/teacher/student-results' },
                { label: 'Analytics & Weak Spot Analysis', path: '/teacher/analytics' },
                { label: 'Bulk Notebook Upload', path: '/teacher/bulk-upload' },
                { label: 'Plagiarism Audit', path: '/teacher/plagiarism' },
                { label: 'Export Performance Reports', path: '/teacher/reports' },
              ].map(({ label, path }) => (
                <button
                  key={label}
                  onClick={() => navigate(path)}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border border-gray-100 hover:bg-gray-50 hover:border-gray-200 transition-all group text-left"
                >
                  <span className="text-xs font-medium text-[#4F46E5]">{label}</span>
                  <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-[#4F46E5] group-hover:translate-x-0.5 transition-all" />
                </button>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default TeacherDashboard;
