import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Brain,
  TrendingUp,
  Upload,
  Eye,
  BarChart3,
  Bell,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  ArrowRight,
  ChevronRight,
  GraduationCap,
  Sparkles,
  Flame,
  FileText,
  Target,
  Award,
  PartyPopper,
} from 'lucide-react';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

import { Card, Badge } from '../../components/common';
import { StatCard } from '../../components/cards';
import { useAuth } from '../../hooks/useAuth';
import { getAllEvaluations } from '../../data/evaluationStore';

// ─── Base Configuration ─────────────────────────────────────────
const studentInfo = {
  quote: 'Every notebook you complete is a step closer to mastery. Keep going!',
};

const quickActions = [
  {
    label: 'Upload Notebook',
    icon: Upload,
    to: '/student/upload',
    variant: 'primary',
    caption: 'Scan & submit for AI evaluation',
  },
  {
    label: 'View Results',
    icon: Eye,
    to: '/student/results',
    variant: 'outline',
    caption: 'Check marks & detailed reports',
  },
  {
    label: 'Performance History',
    icon: BarChart3,
    to: '/student/performance',
    variant: 'outline',
    caption: 'Track your academic growth',
  },
];

const subjectMeta = {
  Mathematics: { gradient: 'from-blue-500 to-blue-600', short: 'MA' },
  English: { gradient: 'from-violet-500 to-purple-600', short: 'EN' },
  Science: { gradient: 'from-cyan-500 to-sky-600', short: 'SC' },
  History: { gradient: 'from-orange-500 to-amber-500', short: 'HI' },
  'Computer Science': { gradient: 'from-emerald-500 to-teal-600', short: 'CS' },
  Hindi: { gradient: 'from-rose-500 to-pink-600', short: 'HI' },
  EVS: { gradient: 'from-[#10B981] to-emerald-600', short: 'EV' },
};

const statusConfig = {
  evaluated: { icon: CheckCircle, label: 'Evaluated', variant: 'success' },
  processing: { icon: Clock, label: 'Processing', variant: 'warning' },
  failed: { icon: XCircle, label: 'Failed', variant: 'danger' },
};

const initialNotifications = [
  {
    icon: CheckCircle,
    iconBg: 'bg-green-50 text-green-600',
    message: 'Your notebook submission has been evaluated.',
    time: 'Just now',
    read: false,
  },
  {
    icon: Brain,
    iconBg: 'bg-blue-50 text-blue-600',
    message: 'New AI feedback available for your submission.',
    time: '2 hours ago',
    read: false,
  },
];

// ─── Helper: Greeting based on time of day ─────────────────────
function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

// ─── Custom Tooltip for the Line Chart ─────────────────────────
function ChartTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 shadow-xl shadow-gray-900/10 px-4 py-3 min-w-[140px]">
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
  return null;
}

// ─── Sub-component: Overall Progress Card ──────────────────────
function ProgressStatCard({ progress }) {
  const capped = Math.min(progress.value, 100);
  const isPositive = progress.trend >= 0;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-lg transition-all duration-300">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-500">Overall Progress</p>
          <p className="mt-1.5 text-2xl sm:text-3xl font-bold text-gray-900">{progress.value}%</p>
        </div>
        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center shadow-lg shadow-black/10 flex-shrink-0 ml-4">
          <Target className="h-5 w-5 text-white" />
        </div>
      </div>

      <div className="mt-4">
        <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-rose-500 to-pink-500 transition-all duration-700"
            style={{ width: `${capped}%` }}
          />
        </div>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-xs text-gray-400">{progress.caption}</span>
          <span className={`inline-flex items-center gap-0.5 text-xs font-semibold ${isPositive ? 'text-[#10B981]' : 'text-red-500'}`}>
            {isPositive ? <ArrowRight className="h-3 w-3 rotate-[-45deg]" /> : <ArrowRight className="h-3 w-3 rotate-45" />}
            {Math.abs(progress.trend)}%
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Sub-component: Welcome Banner ─────────────────────────────
function WelcomeBanner({ student }) {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-[#4F46E5] via-[#4338CA] to-[#3730A3] rounded-3xl p-6 sm:p-8 lg:p-10 shadow-xl shadow-[#4F46E5]/20">
      <div className="absolute -top-24 -right-24 h-72 w-72 bg-white/5 rounded-full blur-3xl" />
      <div className="absolute -bottom-24 -left-16 h-64 w-64 bg-white/5 rounded-full blur-3xl" />
      <div className="absolute top-1/3 right-1/3 h-24 w-24 bg-yellow-300/10 rounded-full blur-2xl" />
      <div className="absolute -bottom-10 right-1/4 hidden sm:block opacity-20 rotate-6">
        <GraduationCap className="h-40 w-40 text-white" />
      </div>

      <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                <GraduationCap className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white leading-tight">
                  {getGreeting()}, {student.firstName} 👋
                </h1>
                <p className="text-sm text-indigo-200/80 mt-0.5">{student.date}</p>
              </div>
            </div>
          </div>

          <p className="text-indigo-200 text-sm sm:text-base max-w-xl flex items-start gap-2 leading-relaxed">
            <Sparkles className="h-4 w-4 flex-shrink-0 mt-0.5 text-yellow-300" />
            <span className="italic">&ldquo;{student.quote}&rdquo;</span>
          </p>
        </div>

        <div className="flex flex-col sm:flex-row lg:flex-col gap-3 flex-shrink-0">
          <Link
            to="/student/upload"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white text-[#4F46E5] font-semibold text-sm rounded-xl hover:bg-indigo-50 transition-all shadow-lg shadow-black/10 hover:shadow-xl hover:-translate-y-0.5 active:scale-[0.97]"
          >
            <Upload className="h-4 w-4" />
            Upload Notebook
          </Link>
          <div className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white/10 backdrop-blur-sm border border-white/15 text-white text-xs font-semibold rounded-xl">
            <Flame className="h-4 w-4 text-orange-400" />
            <span>
              <span className="font-bold">Active</span> student workspace
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────
function StudentDashboard() {
  const { user } = useAuth();
  const [selectedFeedback, setSelectedFeedback] = useState(0);
  const [notifications] = useState(initialNotifications);

  const nameParts = (user?.name || 'Student').trim().split(' ');
  const firstName = nameParts[0] || 'Student';
  const lastName = nameParts.slice(1).join(' ') || '';

  const currentStudentInfo = {
    firstName,
    lastName,
    date: new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
    quote: studentInfo.quote,
  };

  // ── Retrieve all actual evaluations (predefined + uploaded PDFs) ──
  const allEvals = getAllEvaluations();

  const totalUploaded = allEvals.length;
  const evaluatedEvals = allEvals.filter((e) => e.status === 'evaluated');
  const avgMarksValue = evaluatedEvals.length > 0
    ? Math.round(evaluatedEvals.reduce((acc, e) => acc + e.percentage, 0) / evaluatedEvals.length)
    : 0;

  const dynamicStats = [
    {
      title: 'Total Notebooks Uploaded',
      value: totalUploaded,
      icon: <BookOpen className="h-5 w-5" />,
      trend: totalUploaded > 0 ? 100 : 0,
      trendLabel: 'total submissions',
      bgGradient: 'blue',
      caption: `${totalUploaded} notebooks recorded`,
    },
    {
      title: 'Average Marks',
      value: `${avgMarksValue}%`,
      icon: <TrendingUp className="h-5 w-5" />,
      trend: avgMarksValue >= 75 ? 10 : 5,
      trendLabel: 'overall performance',
      bgGradient: 'green',
      caption: evaluatedEvals.length > 0 ? `Based on ${evaluatedEvals.length} evaluated notebooks` : 'No evaluations yet',
    },
    {
      title: 'AI Feedback Generated',
      value: evaluatedEvals.length,
      icon: <Brain className="h-5 w-5" />,
      trend: evaluatedEvals.length > 0 ? 100 : 0,
      trendLabel: 'feedback ready',
      bgGradient: 'purple',
      caption: 'Detailed AI feedback ready',
    },
  ];

  const dynamicOverallProgress = {
    value: avgMarksValue,
    trend: 5,
    caption: 'Overall score percentage across all submitted notebooks',
  };

  const dynamicSubmissions = allEvals.map((e) => {
    const rawSub = e.subject || 'English';
    const subName = rawSub.split('(')[0].trim();
    return {
      id: e.submissionId,
      subject: subName,
      fullSubject: e.subject,
      title: e.notebookName || e.chapter,
      date: e.submissionDate,
      status: e.status || 'evaluated',
      marks: e.percentage,
    };
  });

  const dynamicFeedbackList = allEvals.map((e) => {
    const rawSub = e.subject || 'English';
    const subName = rawSub.split('(')[0].trim();
    return {
      submissionId: e.submissionId,
      subject: subName,
      fullSubject: e.subject,
      title: e.chapter || e.notebookName,
      marks: e.percentage,
      summary: e.overallFeedback?.summary || 'AI evaluation complete.',
      strengths: e.overallFeedback?.strengths || ['Good overall answer structure'],
      improvements: e.overallFeedback?.improvements || ['Review chapter details'],
      date: e.evaluationDate,
    };
  });

  const dynamicChartData = allEvals.map((e) => ({
    name: e.chapter ? (e.chapter.split('—')[0] || e.chapter).trim() : e.submissionDate.slice(0, 6),
    marks: e.percentage,
    average: 65,
  }));

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="space-y-6 sm:space-y-8 pb-8">
      {/* ── WELCOME BANNER ── */}
      <WelcomeBanner student={currentStudentInfo} />

      {/* ── STATISTICS CARDS ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
        {dynamicStats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
        <ProgressStatCard progress={dynamicOverallProgress} />
      </div>

      {/* ── QUICK ACTION BUTTONS ── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Quick Actions</h2>
            <p className="text-sm text-gray-500">Navigate to your most-used features</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.label}
                to={action.to}
                className={`group relative overflow-hidden rounded-2xl border p-5 sm:p-6 transition-all duration-300 ${
                  action.variant === 'primary'
                    ? 'bg-gradient-to-br from-[#4F46E5] to-[#4338CA] border-transparent text-white shadow-lg shadow-[#4F46E5]/25 hover:shadow-xl hover:shadow-[#4F46E5]/40 hover:-translate-y-0.5'
                    : 'bg-white border-gray-100 text-gray-700 shadow-sm hover:shadow-lg hover:-translate-y-0.5 hover:border-gray-200'
                }`}
              >
                <div
                  className={`absolute -top-6 -right-6 h-16 w-16 rounded-full ${
                    action.variant === 'primary' ? 'bg-white/10' : 'bg-[#4F46E5]/5'
                  }`}
                />

                <div className="relative flex items-center gap-4">
                  <div
                    className={`h-12 w-12 rounded-xl flex items-center justify-center ${
                      action.variant === 'primary' ? 'bg-white/15' : 'bg-[#4F46E5]/10'
                    }`}
                  >
                    <Icon
                      className={`h-6 w-6 ${
                        action.variant === 'primary' ? 'text-white' : 'text-[#4F46E5]'
                      }`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`font-semibold text-sm ${action.variant === 'primary' ? 'text-white' : 'text-gray-900'}`}>
                      {action.label}
                    </p>
                    <p className={`text-xs mt-0.5 ${action.variant === 'primary' ? 'text-indigo-200' : 'text-gray-400'}`}>
                      {action.caption}
                    </p>
                  </div>
                  <ChevronRight
                    className={`h-5 w-5 flex-shrink-0 ${
                      action.variant === 'primary'
                        ? 'text-white/60 group-hover:translate-x-0.5 transition-transform'
                        : 'text-gray-300 group-hover:text-[#4F46E5] group-hover:translate-x-0.5 transition-all'
                    }`}
                  />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* ── MAIN CONTENT GRID ── */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* ── LEFT + CENTER COLUMNS (Table + Chart) ── */}
        <div className="lg:col-span-2 space-y-6">
          {/* ── RECENT SUBMISSIONS TABLE ──────────── */}
          <Card padding="none" className="overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between gap-4">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <FileText className="h-4 w-4 text-[#4F46E5]" />
                Recent Notebook Submissions
              </h3>
              <Link
                to="/student/results"
                className="text-sm font-medium text-[#4F46E5] hover:text-[#4338CA] transition-colors inline-flex items-center gap-1 flex-shrink-0"
              >
                View All
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {/* Table (desktop) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-50">
                    <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Subject</th>
                    <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Upload Date</th>
                    <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="text-center px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Marks</th>
                    <th className="text-right px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {dynamicSubmissions.map((row) => {
                    const status = statusConfig[row.status] || statusConfig.evaluated;
                    const StatusIcon = status.icon;
                    const meta = subjectMeta[row.subject] || {
                      gradient: 'from-[#4F46E5] to-[#4338CA]',
                      short: row.subject.slice(0, 2).toUpperCase(),
                    };
                    return (
                      <tr key={row.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3 min-w-0">
                            <span
                              className={`h-9 w-9 rounded-xl bg-gradient-to-br ${meta.gradient} flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0 shadow-sm`}
                            >
                              {meta.short}
                            </span>
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">{row.fullSubject || row.subject}</p>
                              <p className="text-xs text-gray-400 truncate">{row.title}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-500">{row.date}</span>
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant={status.variant} size="sm">
                            <StatusIcon className="h-3 w-3" />
                            <span>{status.label}</span>
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-center">
                          {row.marks !== null ? (
                            <span
                              className={`inline-flex items-center justify-center text-sm font-bold ${
                                row.marks >= 80
                                  ? 'text-[#10B981]'
                                  : row.marks >= 60
                                    ? 'text-yellow-600'
                                    : 'text-red-600'
                              }`}
                            >
                              {row.marks}%
                            </span>
                          ) : (
                            <span className="text-sm text-gray-300">—</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Link
                            to={`/student/results?id=${row.id}`}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#4F46E5] bg-[#4F46E5]/5 rounded-lg hover:bg-[#4F46E5]/10 transition-colors"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            View Results
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Card view (mobile) */}
            <div className="md:hidden divide-y divide-gray-50">
              {dynamicSubmissions.map((row) => {
                const status = statusConfig[row.status] || statusConfig.evaluated;
                const StatusIcon = status.icon;
                const meta = subjectMeta[row.subject] || {
                  gradient: 'from-[#4F46E5] to-[#4338CA]',
                  short: row.subject.slice(0, 2).toUpperCase(),
                };
                return (
                  <div key={row.id} className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <span
                        className={`h-10 w-10 rounded-xl bg-gradient-to-br ${meta.gradient} flex items-center justify-center text-xs font-bold text-white flex-shrink-0 shadow-sm`}
                      >
                        {meta.short}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{row.title}</p>
                        <p className="text-xs text-gray-400">{row.date}</p>
                      </div>
                      {row.marks !== null && (
                        <span className="text-base font-bold text-[#4F46E5]">{row.marks}%</span>
                      )}
                      <Link
                        to={`/student/results?id=${row.id}`}
                        className="p-2 text-gray-300 hover:text-[#4F46E5] transition-colors"
                        aria-label="View result"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                    </div>
                    <div className="mt-2.5 flex items-center">
                      <Badge variant={status.variant} size="xs">
                        <StatusIcon className="h-3 w-3" />
                        <span>{status.label}</span>
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* ── PERFORMANCE LINE CHART ────────────── */}
          <Card>
            <div className="flex flex-wrap items-start justify-between gap-3 mb-1">
              <div>
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-[#4F46E5]" />
                  Performance Trend
                </h3>
                <p className="text-xs text-gray-400 mt-1">Your notebook scores vs class average benchmark</p>
              </div>
              <Badge variant="success" size="sm" dot>
                Live Scores
              </Badge>
            </div>

            <div className="h-72 sm:h-80 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dynamicChartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 11, fill: '#9CA3AF' }}
                    tickLine={false}
                    axisLine={false}
                    dy={6}
                  />
                  <YAxis
                    domain={[0, 100]}
                    tick={{ fontSize: 11, fill: '#9CA3AF' }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(val) => `${val}%`}
                  />
                  <Tooltip content={<ChartTooltip />} cursor={{ stroke: '#E5E7EB', strokeDasharray: '4 4' }} />
                  <Legend
                    verticalAlign="top"
                    align="right"
                    height={32}
                    iconType="circle"
                    iconSize={8}
                    wrapperStyle={{ fontSize: 12, color: '#6B7280' }}
                  />

                  <Line
                    type="monotone"
                    dataKey="average"
                    name="Class Avg"
                    stroke="#A5B4FC"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={false}
                    activeDot={false}
                  />

                  <Line
                    type="monotone"
                    dataKey="marks"
                    name="Your Marks"
                    stroke="#4F46E5"
                    strokeWidth={2.5}
                    dot={{ r: 4, fill: '#4F46E5', stroke: '#fff', strokeWidth: 2 }}
                    activeDot={{ r: 6, fill: '#4F46E5', stroke: '#fff', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* ── RIGHT COLUMN ─────────────────────── */}
        <div className="space-y-6">
          {/* ── LATEST AI FEEDBACK ─────────────────── */}
          <Card padding="none" className="overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-[#4F46E5]/5 to-transparent">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Brain className="h-4 w-4 text-[#4F46E5]" />
                  Latest AI Feedback
                </h3>
                <Link to="/student/results" className="text-xs font-medium text-[#4F46E5] hover:text-[#4338CA] transition-colors">
                  View all
                </Link>
              </div>
            </div>

            {/* Feedback Tabs */}
            <div className="px-5 pt-4 pb-2 flex gap-1.5 overflow-x-auto">
              {dynamicFeedbackList.map((fb, i) => (
                <button
                  key={fb.submissionId || i}
                  onClick={() => setSelectedFeedback(i)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-all ${
                    selectedFeedback === i
                      ? 'bg-[#4F46E5] text-white shadow-sm shadow-[#4F46E5]/30'
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {fb.title || fb.subject}
                </button>
              ))}
            </div>

            {/* Selected Feedback Content */}
            {dynamicFeedbackList.map((fb, i) => {
              if (i !== selectedFeedback) return null;
              return (
                <div key={fb.submissionId || i} className="px-5 py-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-gray-900 truncate">{fb.title}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{fb.fullSubject || fb.subject} · {fb.date}</p>
                    </div>
                    <div
                      className={`h-12 w-12 rounded-xl flex items-center justify-center flex-shrink-0 ml-3 border ${
                        fb.marks >= 80
                          ? 'bg-green-50 border-green-100'
                          : fb.marks >= 60
                            ? 'bg-yellow-50 border-yellow-100'
                            : 'bg-red-50 border-red-100'
                      }`}
                    >
                      <span
                        className={`text-lg font-bold ${
                          fb.marks >= 80
                            ? 'text-[#10B981]'
                            : fb.marks >= 60
                              ? 'text-yellow-600'
                              : 'text-red-600'
                        }`}
                      >
                        {fb.marks}%
                      </span>
                    </div>
                  </div>

                  {/* AI Summary */}
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <div className="flex items-center gap-1.5 mb-2">
                      <Brain className="h-3.5 w-3.5 text-[#4F46E5]" />
                      <span className="text-xs font-semibold text-[#4F46E5]">AI Summary</span>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">{fb.summary}</p>
                  </div>

                  {/* Strengths / Improvements */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-emerald-50/60 border border-emerald-100 rounded-xl p-3">
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <PartyPopper className="h-3.5 w-3.5 text-[#10B981]" />
                        <span className="text-[11px] font-semibold text-[#059669]">Strengths</span>
                      </div>
                      <ul className="space-y-1">
                        {fb.strengths.map((s, idx) => (
                          <li key={idx} className="text-xs text-gray-600 flex items-start gap-1.5">
                            <CheckCircle className="h-3 w-3 text-[#10B981] flex-shrink-0 mt-0.5" />
                            {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-amber-50/60 border border-amber-100 rounded-xl p-3">
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <Target className="h-3.5 w-3.5 text-amber-600" />
                        <span className="text-[11px] font-semibold text-amber-700">Improve</span>
                      </div>
                      <ul className="space-y-1">
                        {fb.improvements.map((s, idx) => (
                          <li key={idx} className="text-xs text-gray-600 flex items-start gap-1.5">
                            <ArrowRight className="h-3 w-3 text-amber-500 flex-shrink-0 mt-0.5" />
                            {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <Link
                    to={`/student/feedback/${fb.submissionId}`}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-[#4F46E5] hover:text-[#4338CA] transition-colors"
                  >
                    View detailed feedback
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              );
            })}
          </Card>

          {/* ── NOTIFICATIONS PANEL ────────────────── */}
          <Card padding="none" className="overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <Bell className="h-4 w-4 text-[#4F46E5]" />
                Notifications
              </h3>
              {unreadCount > 0 && (
                <span className="h-5 min-w-[20px] px-1.5 rounded-full bg-[#4F46E5] text-[10px] font-bold text-white flex items-center justify-center shadow-sm shadow-[#4F46E5]/30">
                  {unreadCount}
                </span>
              )}
            </div>

            <div className="divide-y divide-gray-50 max-h-96 overflow-y-auto">
              {notifications.map((note, i) => {
                const Icon = note.icon;
                const isRead = note.read;
                return (
                  <div
                    key={i}
                    className={`px-5 py-3.5 flex items-start gap-3 transition-colors hover:bg-gray-50/70 ${
                      !isRead ? 'bg-[#4F46E5]/[0.02]' : ''
                    }`}
                  >
                    <div className={`h-8 w-8 rounded-xl flex items-center justify-center flex-shrink-0 ${note.iconBg}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className={`text-sm leading-snug ${!isRead ? 'font-semibold text-gray-900' : 'text-gray-600'}`}>
                          {note.message}
                        </p>
                        {!isRead && (
                          <span className="h-2 w-2 rounded-full bg-[#4F46E5] flex-shrink-0 mt-1.5" />
                        )}
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5">{note.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;
