import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TrendingUp,
  BarChart3,
  PieChart as PieIcon,
  BookOpen,
  Award,
  AlertTriangle,
  CheckCircle,
  Lightbulb,
  ArrowRight,
  Filter,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
  PieChart,
  Pie,
} from 'recharts';

import { Card, Badge, Button, PageHeader } from '../../components/common';
import { getAllEvaluations } from '../../data/evaluationStore';

const COLORS = ['#10B981', '#4F46E5', '#3B82F6', '#F59E0B', '#EF4444'];

function Analytics() {
  const navigate = useNavigate();
  const [evaluations, setEvaluations] = useState([]);
  const [subjectFilter, setSubjectFilter] = useState('All');

  useEffect(() => {
    setEvaluations(getAllEvaluations());
  }, []);

  const filtered = evaluations.filter((e) => subjectFilter === 'All' || (e.subject || '').includes(subjectFilter));

  const totalEvaluations = filtered.length;
  const avgScore = totalEvaluations > 0
    ? Math.round(filtered.reduce((acc, e) => acc + (e.percentage || 0), 0) / totalEvaluations)
    : 0;

  const highestScore = totalEvaluations > 0 ? Math.max(...filtered.map((e) => e.percentage)) : 0;
  const lowestScore = totalEvaluations > 0 ? Math.min(...filtered.map((e) => e.percentage)) : 0;

  // Grade Distribution for charts
  const gradeCounts = { 'A+': 0, A: 0, B: 0, C: 0, F: 0 };
  filtered.forEach((e) => {
    if (gradeCounts[e.grade] !== undefined) gradeCounts[e.grade]++;
    else if (e.percentage >= 90) gradeCounts['A+']++;
    else if (e.percentage >= 80) gradeCounts['A']++;
    else if (e.percentage >= 70) gradeCounts['B']++;
    else if (e.percentage >= 50) gradeCounts['C']++;
    else gradeCounts['F']++;
  });

  const gradeChartData = [
    { name: 'Grade A+ (90-100%)', value: gradeCounts['A+'] },
    { name: 'Grade A (80-89%)', value: gradeCounts['A'] },
    { name: 'Grade B (70-79%)', value: gradeCounts['B'] },
    { name: 'Grade C (50-69%)', value: gradeCounts['C'] },
    { name: 'Grade F (<50%)', value: gradeCounts['F'] },
  ].filter((d) => d.value > 0);

  // Subject-wise Breakdown
  const subjectMap = {};
  evaluations.forEach((e) => {
    const s = e.subject || 'General';
    if (!subjectMap[s]) subjectMap[s] = { total: 0, count: 0, highest: 0 };
    subjectMap[s].total += e.percentage;
    subjectMap[s].count += 1;
    if (e.percentage > subjectMap[s].highest) subjectMap[s].highest = e.percentage;
  });

  const subjectChartData = Object.keys(subjectMap).map((s) => ({
    subject: s.length > 15 ? s.substring(0, 15) + '...' : s,
    avg: Math.round(subjectMap[s].total / subjectMap[s].count),
    top: subjectMap[s].highest,
  }));

  // Chapter Mastery
  const chapterMap = {};
  filtered.forEach((e) => {
    const ch = e.chapter || 'General Chapter';
    if (!chapterMap[ch]) chapterMap[ch] = { total: 0, count: 0, subject: e.subject };
    chapterMap[ch].total += e.percentage;
    chapterMap[ch].count += 1;
  });

  const chapterMasteryList = Object.keys(chapterMap).map((ch) => ({
    chapter: ch,
    subject: chapterMap[ch].subject,
    avgPercentage: Math.round(chapterMap[ch].total / chapterMap[ch].count),
    submissionCount: chapterMap[ch].count,
  }));

  // Collect Strengths & Areas to Improve
  const strengthsList = [];
  const improvementsList = [];
  filtered.forEach((e) => {
    if (e.overallFeedback?.strengths) strengthsList.push(...e.overallFeedback.strengths);
    if (e.overallFeedback?.improvements) improvementsList.push(...e.overallFeedback.improvements);
  });

  const uniqueStrengths = Array.from(new Set(strengthsList)).slice(0, 4);
  const uniqueImprovements = Array.from(new Set(improvementsList)).slice(0, 4);

  return (
    <div className="space-y-6 sm:space-y-8 pb-8">
      {/* ── HEADER ── */}
      <PageHeader
        title="Class Performance Analytics"
        description="Deep academic insights, chapter mastery tracking, and AI-powered weak spot detection."
        breadcrumbs={[
          { label: 'Teacher Dashboard', path: '/teacher' },
          { label: 'Analytics' },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-400" />
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
          </div>
        }
      />

      {/* ── METRIC CARDS ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-[#4F46E5]/10 flex items-center justify-center text-[#4F46E5]">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium">Class Average Score</p>
            <p className="text-2xl font-black text-gray-900 mt-0.5">{avgScore}%</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-green-500/10 flex items-center justify-center text-[#10B981]">
            <Award className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium">Highest Score</p>
            <p className="text-2xl font-black text-gray-900 mt-0.5">{highestScore}%</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-600">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium">Lowest Score</p>
            <p className="text-2xl font-black text-gray-900 mt-0.5">{lowestScore}%</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-600">
            <BookOpen className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium">Evaluations Analyzed</p>
            <p className="text-2xl font-black text-gray-900 mt-0.5">{totalEvaluations}</p>
          </div>
        </Card>
      </div>

      {/* ── CHARTS ROW ── */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Subject Performance Comparison */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-[#4F46E5]" />
                Subject Performance Averages
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">Average score vs Highest score per subject</p>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subjectChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis dataKey="subject" tick={{ fontSize: 11, fill: '#9CA3AF' }} tickLine={false} axisLine={false} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#9CA3AF' }} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} />
                <Tooltip formatter={(v) => [`${v}%`]} contentStyle={{ borderRadius: '12px', border: '1px solid #f0f0f0', fontSize: 12 }} />
                <Legend verticalAlign="top" align="right" wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="avg" name="Class Average" fill="#4F46E5" radius={[6, 6, 0, 0]} />
                <Bar dataKey="top" name="Highest Score" fill="#10B981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Score Distribution Breakdown */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <PieIcon className="h-4 w-4 text-[#4F46E5]" />
                Grade & Score Distribution
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">Proportion of student performance tiers</p>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={gradeChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {gradeChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => [`${v} submissions`, 'Count']} />
                <Legend verticalAlign="bottom" align="center" wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* ── CHAPTER MASTERY & WEAK SPOTS ── */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Chapter Mastery */}
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-[#4F46E5]" />
                Chapter Mastery Breakdown
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">Average score per NCERT chapter evaluated</p>
            </div>
          </div>

          <div className="space-y-4">
            {chapterMasteryList.map((ch) => {
              const statusVariant = ch.avgPercentage >= 80 ? 'success' : ch.avgPercentage >= 60 ? 'warning' : 'danger';
              return (
                <div key={ch.chapter} className="p-4 rounded-xl border border-gray-100 bg-gray-50/40 space-y-2">
                  <div className="flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{ch.chapter}</p>
                      <p className="text-xs text-gray-400">{ch.subject} · {ch.submissionCount} submission(s)</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-base font-black text-gray-900">{ch.avgPercentage}%</span>
                      <Badge variant={statusVariant} size="xs">
                        {ch.avgPercentage >= 80 ? 'Mastered' : ch.avgPercentage >= 60 ? 'Moderate' : 'Needs Work'}
                      </Badge>
                    </div>
                  </div>
                  <div className="h-2 w-full rounded-full bg-gray-200 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        ch.avgPercentage >= 80 ? 'bg-[#10B981]' : ch.avgPercentage >= 60 ? 'bg-amber-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${ch.avgPercentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Right Col: AI Insights (Strengths & Improvements) */}
        <div className="space-y-6">
          <Card>
            <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-3">
              <CheckCircle className="h-4 w-4 text-[#10B981]" />
              Class Strengths
            </h3>
            <ul className="space-y-2.5">
              {uniqueStrengths.length > 0 ? (
                uniqueStrengths.map((s, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-gray-700 bg-green-50/60 border border-green-100 p-3 rounded-xl">
                    <CheckCircle className="h-4 w-4 text-[#10B981] flex-shrink-0 mt-0.5" />
                    <span>{s}</span>
                  </li>
                ))
              ) : (
                <p className="text-xs text-gray-400">No strength metrics recorded yet.</p>
              )}
            </ul>
          </Card>

          <Card>
            <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-3">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              Focus Areas & Weak Spots
            </h3>
            <ul className="space-y-2.5">
              {uniqueImprovements.length > 0 ? (
                uniqueImprovements.map((imp, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-gray-700 bg-amber-50/60 border border-amber-100 p-3 rounded-xl">
                    <Lightbulb className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
                    <span>{imp}</span>
                  </li>
                ))
              ) : (
                <p className="text-xs text-gray-400">No improvement focus recorded yet.</p>
              )}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default Analytics;
