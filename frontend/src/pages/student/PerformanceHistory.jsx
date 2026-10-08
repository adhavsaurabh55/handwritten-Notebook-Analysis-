import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TrendingUp,
  TrendingDown,
  BookOpen,
  Award,
  BarChart3,
  CheckCircle,
  Clock,
  XCircle,
  Eye,
  Upload,
  ArrowRight,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
} from 'recharts';

import { Card, Badge, Button, PageHeader } from '../../components/common';
import { StatCard } from '../../components/cards';

// ─── Mock Data ──────────────────────────────────────────────────
// TODO: Replace with → GET /api/students/:id/performance
const performanceHistory = [
  {
    submissionId: 'sub-001',
    subject: 'English',
    notebookName: 'English Notebook — Chapter 2',
    chapter: 'Chapter 2 — The Tsunami',
    submissionDate: 'Apr 10, 2025',
    obtainedMarks: 42,
    totalMarks: 50,
    percentage: 84,
    grade: 'A',
    status: 'evaluated',
  },
  {
    submissionId: 'sub-002',
    subject: 'Mathematics',
    notebookName: 'Maths Notebook — Algebra',
    chapter: 'Chapter 3 — Linear Equations',
    submissionDate: 'Apr 5, 2025',
    obtainedMarks: 38,
    totalMarks: 50,
    percentage: 76,
    grade: 'B',
    status: 'evaluated',
  },
  {
    submissionId: 'sub-003',
    subject: 'EVS',
    notebookName: 'EVS Notebook — Chapter 1',
    chapter: 'Chapter 1 — Super Senses',
    submissionDate: 'Mar 28, 2025',
    obtainedMarks: 44,
    totalMarks: 50,
    percentage: 88,
    grade: 'A',
    status: 'evaluated',
  },
  {
    submissionId: 'sub-004',
    subject: 'Hindi',
    notebookName: 'Hindi Notebook — Paath 2',
    chapter: 'पाठ 2 — लखनवी अंदाज़',
    submissionDate: 'Mar 20, 2025',
    obtainedMarks: 31,
    totalMarks: 50,
    percentage: 62,
    grade: 'C',
    status: 'evaluated',
  },
  {
    submissionId: 'sub-005',
    subject: 'English',
    notebookName: 'English Notebook — Chapter 1',
    chapter: 'Chapter 1 — The Best Christmas Present',
    submissionDate: 'Mar 12, 2025',
    obtainedMarks: 36,
    totalMarks: 50,
    percentage: 72,
    grade: 'B',
    status: 'evaluated',
  },
  {
    submissionId: 'sub-006',
    subject: 'Mathematics',
    notebookName: 'Maths Notebook — Fractions',
    chapter: 'Chapter 1 — Rational Numbers',
    submissionDate: 'Mar 5, 2025',
    obtainedMarks: 33,
    totalMarks: 50,
    percentage: 66,
    grade: 'C',
    status: 'evaluated',
  },
  {
    submissionId: 'sub-007',
    subject: 'EVS',
    notebookName: 'EVS Notebook — Chapter 2',
    chapter: 'Chapter 2 — A Snake Charmer\'s Story',
    submissionDate: 'Feb 25, 2025',
    obtainedMarks: 40,
    totalMarks: 50,
    percentage: 80,
    grade: 'A',
    status: 'evaluated',
  },
  {
    submissionId: 'sub-008',
    subject: 'Hindi',
    notebookName: 'Hindi Notebook — Paath 1',
    chapter: 'पाठ 1 — ध्वनि',
    submissionDate: 'Feb 18, 2025',
    obtainedMarks: 28,
    totalMarks: 50,
    percentage: 56,
    grade: 'D',
    status: 'evaluated',
  },
];

// ─── Derived summary stats ──────────────────────────────────────
function computeStats(records) {
  if (!records.length) return { avg: 0, total: 0, best: 0, improvement: 0 };
  const evaluated = records.filter((r) => r.status === 'evaluated');
  const avg = Math.round(evaluated.reduce((a, r) => a + r.percentage, 0) / evaluated.length);
  const best = Math.max(...evaluated.map((r) => r.percentage));
  const sorted = [...evaluated].sort((a, b) => new Date(a.submissionDate) - new Date(b.submissionDate));
  const improvement =
    sorted.length >= 2 ? sorted[sorted.length - 1].percentage - sorted[0].percentage : 0;
  return { avg, total: evaluated.length, best, improvement };
}

// ─── Chart data: performance over time ─────────────────────────
function buildChartData(records) {
  return [...records]
    .filter((r) => r.status === 'evaluated')
    .sort((a, b) => new Date(a.submissionDate) - new Date(b.submissionDate))
    .map((r) => ({
      date: r.submissionDate,
      percentage: r.percentage,
      subject: r.subject,
    }));
}

// ─── Subject-wise averages ──────────────────────────────────────
function buildSubjectData(records) {
  const map = {};
  records.forEach((r) => {
    if (r.status !== 'evaluated') return;
    if (!map[r.subject]) map[r.subject] = { total: 0, count: 0 };
    map[r.subject].total += r.percentage;
    map[r.subject].count += 1;
  });
  return Object.entries(map).map(([subject, { total, count }]) => ({
    subject,
    avg: Math.round(total / count),
  }));
}

// ─── Helpers ───────────────────────────────────────────────────
function getPercentageColor(pct) {
  if (pct >= 80) return { text: 'text-[#10B981]', bg: 'bg-[#10B981]', light: 'bg-green-50 border-green-100' };
  if (pct >= 60) return { text: 'text-amber-600', bg: 'bg-amber-500', light: 'bg-amber-50 border-amber-100' };
  return { text: 'text-red-600', bg: 'bg-red-500', light: 'bg-red-50 border-red-100' };
}

const gradeVariant = { A: 'success', B: 'primary', C: 'warning', D: 'danger' };

const statusConfig = {
  evaluated: { icon: CheckCircle, label: 'Evaluated', variant: 'success' },
  processing: { icon: Clock, label: 'Processing', variant: 'warning' },
  failed: { icon: XCircle, label: 'Failed', variant: 'danger' },
};

const subjectColors = {
  English: '#4F46E5',
  Mathematics: '#10B981',
  EVS: '#F59E0B',
  Hindi: '#EF4444',
  Science: '#06B6D4',
};

// ─── Custom chart tooltip ───────────────────────────────────────
function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-xl px-4 py-3 min-w-[160px]">
      <p className="text-xs font-semibold text-gray-400 mb-2">{label}</p>
      {payload.map((entry) => (
        <div key={entry.dataKey} className="flex items-center justify-between gap-4 text-sm">
          <span className="flex items-center gap-1.5 text-gray-500">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
            Score
          </span>
          <span className="font-bold text-gray-900">{entry.value}%</span>
        </div>
      ))}
    </div>
  );
}

// ─── Sub-component: Summary Stats ──────────────────────────────
function SummaryStats({ stats }) {
  const cards = [
    {
      title: 'Overall Average',
      value: `${stats.avg}%`,
      icon: <BarChart3 className="h-5 w-5" />,
      bgGradient: 'purple',
      trend: stats.improvement,
      trendLabel: 'since first submission',
    },
    {
      title: 'Total Evaluated',
      value: stats.total,
      icon: <BookOpen className="h-5 w-5" />,
      bgGradient: 'blue',
    },
    {
      title: 'Best Score',
      value: `${stats.best}%`,
      icon: <Award className="h-5 w-5" />,
      bgGradient: 'green',
    },
    {
      title: 'Improvement',
      value: `${stats.improvement >= 0 ? '+' : ''}${stats.improvement}%`,
      icon: stats.improvement >= 0
        ? <TrendingUp className="h-5 w-5" />
        : <TrendingDown className="h-5 w-5" />,
      bgGradient: stats.improvement >= 0 ? 'cyan' : 'orange',
      trendLabel: 'first → latest submission',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
      {cards.map((c) => (
        <StatCard key={c.title} {...c} />
      ))}
    </div>
  );
}

// ─── Sub-component: Performance Chart ──────────────────────────
function PerformanceChart({ data }) {
  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-3 mb-1">
        <div>
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-[#4F46E5]" />
            Performance Over Time
          </h3>
          <p className="text-xs text-gray-400 mt-1">Score percentage across all notebook submissions</p>
        </div>
        <Badge variant="primary" size="sm">{data.length} submissions</Badge>
      </div>
      <div className="h-72 sm:h-80 mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
            <XAxis
              dataKey="date"
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
              tickFormatter={(v) => `${v}%`}
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
              dataKey="percentage"
              name="Score %"
              stroke="#4F46E5"
              strokeWidth={2.5}
              dot={{ r: 4, fill: '#4F46E5', stroke: '#fff', strokeWidth: 2 }}
              activeDot={{ r: 6, fill: '#4F46E5', stroke: '#fff', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

// ─── Sub-component: Subject-wise Performance ───────────────────
function SubjectPerformance({ data }) {
  return (
    <Card>
      <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-1">
        <BookOpen className="h-4 w-4 text-[#4F46E5]" />
        Subject-wise Performance
      </h3>
      <p className="text-xs text-gray-400 mb-5">Average score per subject across all submissions</p>

      {/* Bar chart */}
      <div className="h-52 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 4, right: 10, left: -15, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
            <XAxis
              dataKey="subject"
              tick={{ fontSize: 11, fill: '#9CA3AF' }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fontSize: 11, fill: '#9CA3AF' }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `${v}%`}
            />
            <Tooltip
              formatter={(value) => [`${value}%`, 'Avg Score']}
              contentStyle={{ borderRadius: '12px', border: '1px solid #f0f0f0', fontSize: 12 }}
            />
            <Bar dataKey="avg" name="Avg Score" radius={[6, 6, 0, 0]} fill="#4F46E5" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Progress bars */}
      <div className="space-y-4">
        {data.map(({ subject, avg }) => {
          const colors = getPercentageColor(avg);
          const barColor = subjectColors[subject] || '#4F46E5';
          return (
            <div key={subject}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: barColor }}
                  />
                  <span className="text-sm font-medium text-gray-700">{subject}</span>
                </div>
                <span className={`text-sm font-bold ${colors.text}`}>{avg}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${avg}%`, backgroundColor: barColor }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

// ─── Sub-component: Evaluation History Table ───────────────────
function EvaluationHistoryTable({ records, onViewResults }) {
  if (!records.length) {
    return (
      <Card>
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="h-16 w-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
            <BookOpen className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">No evaluations yet</h3>
          <p className="text-sm text-gray-500 mt-2 max-w-sm">
            Upload your first notebook to start tracking your performance history.
          </p>
          <div className="mt-6">
            <Button
              variant="primary"
              size="md"
              icon={<Upload className="h-4 w-4" />}
              onClick={() => onViewResults('/student/upload')}
            >
              Upload Notebook
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card padding="none" className="overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between gap-4">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-[#4F46E5]" />
          Evaluation History
        </h3>
        <Badge variant="gray" size="sm">{records.length} records</Badge>
      </div>

      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-50 bg-gray-50/60">
              {['Subject / Chapter', 'Date', 'Score', 'Percentage', 'Grade', 'Status', ''].map((h) => (
                <th
                  key={h}
                  className={`px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider ${h === '' ? 'text-right' : 'text-left'}`}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {records.map((row) => {
              const sc = statusConfig[row.status] || statusConfig.evaluated;
              const StatusIcon = sc.icon;
              const colors = getPercentageColor(row.percentage);
              return (
                <tr key={row.submissionId} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="text-sm font-semibold text-gray-900">{row.subject}</p>
                    <p className="text-xs text-gray-400 mt-0.5 truncate max-w-[220px]">{row.chapter}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-500">{row.submissionDate}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-sm font-bold ${colors.text}`}>
                      {row.obtainedMarks}/{row.totalMarks}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${colors.bg} transition-all duration-500`}
                          style={{ width: `${row.percentage}%` }}
                        />
                      </div>
                      <span className={`text-xs font-bold ${colors.text}`}>{row.percentage}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={gradeVariant[row.grade] || 'gray'} size="sm">
                      {row.grade}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={sc.variant} size="sm">
                      <StatusIcon className="h-3 w-3" />
                      {sc.label}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button
                      variant="ghost"
                      size="xs"
                      icon={<Eye className="h-3.5 w-3.5" />}
                      onClick={() => onViewResults(`/student/results?id=${row.submissionId}`)}
                    >
                      View
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
        {records.map((row) => {
          const sc = statusConfig[row.status] || statusConfig.evaluated;
          const StatusIcon = sc.icon;
          const colors = getPercentageColor(row.percentage);
          return (
            <div key={row.submissionId} className="px-5 py-4 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-gray-900">{row.subject}</p>
                  <p className="text-xs text-gray-400 mt-0.5 truncate">{row.chapter}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{row.submissionDate}</p>
                </div>
                <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                  <span className={`text-base font-black ${colors.text}`}>{row.percentage}%</span>
                  <Badge variant={gradeVariant[row.grade] || 'gray'} size="xs">Grade {row.grade}</Badge>
                </div>
              </div>
              <div className="h-1.5 w-full rounded-full bg-gray-100 overflow-hidden">
                <div
                  className={`h-full rounded-full ${colors.bg}`}
                  style={{ width: `${row.percentage}%` }}
                />
              </div>
              <div className="flex items-center justify-between">
                <Badge variant={sc.variant} size="xs">
                  <StatusIcon className="h-3 w-3" />
                  {sc.label}
                </Badge>
                <Button
                  variant="ghost"
                  size="xs"
                  icon={<Eye className="h-3.5 w-3.5" />}
                  onClick={() => onViewResults(`/student/results?id=${row.submissionId}`)}
                >
                  View Results
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

// ─── Main Component ────────────────────────────────────────────
function PerformanceHistory() {
  const navigate = useNavigate();
  const [records] = useState(performanceHistory);

  // TODO: Replace with API call → GET /api/students/:id/performance
  const stats = computeStats(records);
  const chartData = buildChartData(records);
  const subjectData = buildSubjectData(records);

  return (
    <div className="space-y-6 sm:space-y-8 pb-8">
      {/* ── PAGE HEADER ── */}
      <PageHeader
        title="Performance History"
        description="Track your academic progress across all notebook evaluations."
        breadcrumbs={[
          { label: 'Dashboard', path: '/student' },
          { label: 'Performance History' },
        ]}
        actions={
          <Button
            variant="primary"
            size="sm"
            icon={<Upload className="h-4 w-4" />}
            onClick={() => navigate('/student/upload')}
          >
            Upload Notebook
          </Button>
        }
      />

      {/* ── SUMMARY STATS ── */}
      <SummaryStats stats={stats} />

      {/* ── PERFORMANCE CHART ── */}
      {chartData.length > 0 && <PerformanceChart data={chartData} />}

      {/* ── SUBJECT + HISTORY GRID ── */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Subject-wise — 1 col */}
        <div className="lg:col-span-1">
          <SubjectPerformance data={subjectData} />
        </div>

        {/* Quick stats sidebar */}
        <div className="lg:col-span-2 space-y-4">
          {/* Top 3 recent */}
          <Card>
            <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-4">
              <Award className="h-4 w-4 text-[#4F46E5]" />
              Recent Highlights
            </h3>
            <div className="space-y-3">
              {[...records]
                .sort((a, b) => new Date(b.submissionDate) - new Date(a.submissionDate))
                .slice(0, 3)
                .map((r) => {
                  const colors = getPercentageColor(r.percentage);
                  return (
                    <div
                      key={r.submissionId}
                      className="flex items-center gap-3 p-3 rounded-xl bg-gray-50/60 border border-gray-100"
                    >
                      <div className={`h-10 w-10 rounded-xl border flex flex-col items-center justify-center flex-shrink-0 ${colors.light}`}>
                        <span className={`text-sm font-black leading-none ${colors.text}`}>{r.percentage}%</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">{r.subject}</p>
                        <p className="text-xs text-gray-400 truncate">{r.chapter}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Badge variant={gradeVariant[r.grade] || 'gray'} size="xs">
                          {r.grade}
                        </Badge>
                        <button
                          onClick={() => navigate(`/student/results?id=${r.submissionId}`)}
                          className="p-1.5 text-gray-400 hover:text-[#4F46E5] hover:bg-[#4F46E5]/5 rounded-lg transition-colors"
                          aria-label="View results"
                        >
                          <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>
          </Card>

          {/* Grade distribution */}
          <Card>
            <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-4">
              <BarChart3 className="h-4 w-4 text-[#4F46E5]" />
              Grade Distribution
            </h3>
            <div className="grid grid-cols-4 gap-3">
              {['A', 'B', 'C', 'D'].map((grade) => {
                const count = records.filter((r) => r.grade === grade).length;
                const pct = records.length ? Math.round((count / records.length) * 100) : 0;
                const variant = gradeVariant[grade] || 'gray';
                return (
                  <div key={grade} className="flex flex-col items-center gap-2 p-3 rounded-xl bg-gray-50/60 border border-gray-100">
                    <Badge variant={variant} size="md">{grade}</Badge>
                    <span className="text-2xl font-black text-gray-900">{count}</span>
                    <span className="text-xs text-gray-400">{pct}%</span>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>

      {/* ── FULL HISTORY TABLE ── */}
      <EvaluationHistoryTable records={records} onViewResults={navigate} />
    </div>
  );
}

export default PerformanceHistory;
