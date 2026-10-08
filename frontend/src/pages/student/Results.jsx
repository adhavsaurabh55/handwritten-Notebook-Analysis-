import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  BookOpen,
  Calendar,
  CheckCircle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  Download,
  MessageSquareText,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  ShieldCheck,
  ShieldAlert,
  Sparkles,
  Target,
  ThumbsUp,
  Lightbulb,
  BarChart3,
  FileText,
  Clock,
  Star,
  SearchX,
} from 'lucide-react';

import { Card, Badge, Button, PageHeader } from '../../components/common';
import { getEvaluationById } from '../../data/evaluationStore';

// ─── Helpers ───────────────────────────────────────────────────
function getPercentageColor(pct) {
  if (pct >= 80) return { text: 'text-[#10B981]', bg: 'from-[#10B981] to-emerald-400', light: 'bg-green-50 border-green-200' };
  if (pct >= 60) return { text: 'text-amber-600', bg: 'from-amber-500 to-yellow-400', light: 'bg-amber-50 border-amber-200' };
  return { text: 'text-red-600', bg: 'from-red-500 to-rose-400', light: 'bg-red-50 border-red-200' };
}

function getPlagiarismConfig(status) {
  if (status === 'Low') return { variant: 'success', icon: ShieldCheck, color: 'text-[#10B981]', bg: 'bg-green-50 border-green-200' };
  if (status === 'Moderate') return { variant: 'warning', icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200' };
  return { variant: 'danger', icon: ShieldAlert, color: 'text-red-600', bg: 'bg-red-50 border-red-200' };
}

// ─── Not Found State ───────────────────────────────────────────
function EvaluationNotFound({ submissionId }) {
  return (
    <div className="space-y-6 pb-8">
      <PageHeader
        title="Evaluation Results"
        description="Review your notebook evaluation and AI-generated feedback."
        breadcrumbs={[{ label: 'Dashboard', path: '/student' }, { label: 'Results' }]}
      />
      <Card>
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="h-16 w-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
            <SearchX className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">Evaluation Not Found</h3>
          <p className="text-sm text-gray-500 mt-2 max-w-sm">
            {submissionId
              ? `No evaluation found for submission ID "${submissionId}".`
              : 'No submission ID provided.'}
            {' '}The evaluation may still be processing or the link may be invalid.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <Link to="/student/upload">
              <Button variant="primary" size="md">Upload a Notebook</Button>
            </Link>
            <Link to="/student">
              <Button variant="outline" size="md" icon={<ArrowLeft className="h-4 w-4" />}>
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
}

// ─── Sub-component: Score Hero Card ────────────────────────────
function ScoreHeroCard({ data }) {
  const capped = Math.min(data.percentage, 100);
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-[#4F46E5] via-[#4338CA] to-[#3730A3] rounded-3xl p-6 sm:p-8 shadow-xl shadow-[#4F46E5]/20">
      <div className="absolute -top-20 -right-20 h-64 w-64 bg-white/5 rounded-full blur-3xl" />
      <div className="absolute -bottom-16 -left-12 h-56 w-56 bg-white/5 rounded-full blur-3xl" />
      <div className="relative flex flex-col sm:flex-row sm:items-center gap-6">
        <div className="flex-shrink-0 flex flex-col items-center justify-center h-32 w-32 rounded-full bg-white/10 border-4 border-white/20 backdrop-blur-sm mx-auto sm:mx-0">
          <span className="text-4xl font-black text-white leading-none">{data.percentage}%</span>
          <span className="text-xs font-semibold text-indigo-200 mt-1">Score</span>
        </div>
        <div className="flex-1 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-3">
            <Badge variant="success" size="md">
              <CheckCircle className="h-3.5 w-3.5" />
              Evaluated
            </Badge>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 border border-white/20 text-xs font-bold text-white">
              <Star className="h-3.5 w-3.5 text-yellow-300" />
              Grade {data.grade}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white leading-snug">{data.notebookName}</h2>
          <p className="text-indigo-200 text-sm mt-1">{data.subject}</p>
          <div className="mt-4 max-w-sm mx-auto sm:mx-0">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-indigo-300">{data.obtainedMarks} / {data.totalMarks} marks</span>
              <span className="text-xs font-bold text-white">{data.percentage}%</span>
            </div>
            <div className="h-2.5 w-full rounded-full bg-white/20 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-white/80 to-white transition-all duration-700"
                style={{ width: `${capped}%` }}
              />
            </div>
          </div>
        </div>
        <div className="flex-shrink-0 flex flex-col items-center justify-center h-24 w-24 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-sm mx-auto sm:mx-0">
          <span className="text-3xl font-black text-white">{data.obtainedMarks}</span>
          <span className="text-xs text-indigo-300 mt-0.5">out of {data.totalMarks}</span>
        </div>
      </div>
    </div>
  );
}

// ─── Sub-component: Summary Meta Row ───────────────────────────
function SummaryMeta({ data }) {
  const items = [
    { icon: BookOpen, label: 'Subject', value: data.subject },
    { icon: FileText, label: 'Chapter', value: data.chapter },
    { icon: Calendar, label: 'Submitted', value: data.submissionDate },
    { icon: Clock, label: 'Evaluated', value: data.evaluationDate },
  ];
  return (
    <Card>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex items-start gap-3">
            <div className="h-9 w-9 rounded-xl bg-[#4F46E5]/10 flex items-center justify-center flex-shrink-0">
              <Icon className="h-4 w-4 text-[#4F46E5]" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-gray-400 font-medium">{label}</p>
              <p className="text-sm font-semibold text-gray-900 truncate mt-0.5">{value}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ─── Sub-component: AI Feedback Card ───────────────────────────
function AIFeedbackCard({ feedback }) {
  return (
    <Card>
      <div className="flex items-center gap-2 mb-1">
        <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-[#4F46E5] to-purple-600 flex items-center justify-center flex-shrink-0">
          <Sparkles className="h-4 w-4 text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">AI-Generated Feedback</h3>
          <p className="text-xs text-gray-400">Powered by Flan-T5 evaluation model</p>
        </div>
      </div>
      <div className="mt-4 rounded-xl bg-[#4F46E5]/5 border border-[#4F46E5]/15 p-4">
        <p className="text-sm text-gray-700 leading-relaxed">{feedback.summary}</p>
      </div>
      <div className="mt-4 grid sm:grid-cols-3 gap-4">
        <div className="rounded-xl bg-green-50 border border-green-100 p-4">
          <div className="flex items-center gap-2 mb-3">
            <ThumbsUp className="h-4 w-4 text-[#10B981]" />
            <span className="text-sm font-semibold text-[#059669]">Strengths</span>
          </div>
          <ul className="space-y-2">
            {feedback.strengths.map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-gray-600">
                <CheckCircle2 className="h-3.5 w-3.5 text-[#10B981] flex-shrink-0 mt-0.5" />{s}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl bg-amber-50 border border-amber-100 p-4">
          <div className="flex items-center gap-2 mb-3">
            <Target className="h-4 w-4 text-amber-600" />
            <span className="text-sm font-semibold text-amber-700">Improve</span>
          </div>
          <ul className="space-y-2">
            {feedback.improvements.map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-gray-600">
                <TrendingUp className="h-3.5 w-3.5 text-amber-500 flex-shrink-0 mt-0.5" />{s}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl bg-blue-50 border border-blue-100 p-4">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-semibold text-blue-700">Suggestions</span>
          </div>
          <ul className="space-y-2">
            {feedback.suggestions.map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-gray-600">
                <Lightbulb className="h-3.5 w-3.5 text-blue-500 flex-shrink-0 mt-0.5" />{s}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Card>
  );
}

// ─── Sub-component: Evaluation Breakdown ───────────────────────
function BreakdownCard({ sections }) {
  const [expanded, setExpanded] = useState(true);
  const totalObtained = sections.reduce((a, s) => a + s.obtainedMarks, 0);
  const totalMax = sections.reduce((a, s) => a + s.maximumMarks, 0);

  return (
    <Card padding="none" className="overflow-hidden">
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center justify-between px-6 py-4 border-b border-gray-100 hover:bg-gray-50/50 transition-colors"
      >
        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-[#4F46E5]" />
          Section-wise Evaluation Breakdown
        </h3>
        {expanded ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
      </button>

      {expanded && (
        <>
          {/* Desktop table */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-50 bg-gray-50/60">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Section</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Questions</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Obtained</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Max</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Percentage</th>
                  <th className="text-center px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {sections.map((row) => {
                  const colors = getPercentageColor(row.percentage);
                  const badgeVariant = row.percentage >= 80 ? 'success' : row.percentage >= 60 ? 'warning' : 'danger';
                  return (
                    <tr key={row.sectionId} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-gray-900">{row.sectionName}</p>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span className="text-sm text-gray-500">{row.totalQuestions}</span>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span className={`text-sm font-bold ${colors.text}`}>{row.obtainedMarks}</span>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span className="text-sm text-gray-400">{row.maximumMarks}</span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2 justify-center">
                          <div className="w-20 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                            <div
                              className={`h-full rounded-full bg-gradient-to-r ${colors.bg} transition-all duration-500`}
                              style={{ width: `${row.percentage}%` }}
                            />
                          </div>
                          <span className={`text-xs font-bold ${colors.text}`}>{row.percentage}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <Badge variant={badgeVariant} size="sm">{row.status}</Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="sm:hidden divide-y divide-gray-50">
            {sections.map((row) => {
              const colors = getPercentageColor(row.percentage);
              const badgeVariant = row.percentage >= 80 ? 'success' : row.percentage >= 60 ? 'warning' : 'danger';
              return (
                <div key={row.sectionId} className="px-5 py-4 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium text-gray-900 flex-1">{row.sectionName}</p>
                    <Badge variant={badgeVariant} size="sm">{row.status}</Badge>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-lg font-black ${colors.text}`}>{row.obtainedMarks}</span>
                    <span className="text-sm text-gray-400">/ {row.maximumMarks} marks</span>
                    <span className={`ml-auto text-sm font-bold ${colors.text}`}>{row.percentage}%</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-gray-100 overflow-hidden">
                    <div className={`h-full rounded-full bg-gradient-to-r ${colors.bg}`} style={{ width: `${row.percentage}%` }} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Total row */}
          <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/60 flex flex-wrap items-center justify-between gap-3">
            <span className="text-sm font-semibold text-gray-700">Total Score</span>
            <div className="flex items-center gap-3">
              <span className="text-lg font-black text-[#4F46E5]">{totalObtained}</span>
              <span className="text-sm text-gray-400">/ {totalMax} marks</span>
              <Badge variant="primary" size="md">
                {Math.round((totalObtained / totalMax) * 100)}%
              </Badge>
            </div>
          </div>
        </>
      )}
    </Card>
  );
}

// ─── Sub-component: Plagiarism Card ────────────────────────────
function PlagiarismCard({ plagiarism }) {
  const config = getPlagiarismConfig(plagiarism.status);
  const Icon = config.icon;
  const capped = Math.min(plagiarism.percentage, 100);
  return (
    <Card>
      <div className="flex items-center gap-2 mb-4">
        <div className={`h-8 w-8 rounded-xl flex items-center justify-center flex-shrink-0 border ${config.bg}`}>
          <Icon className={`h-4 w-4 ${config.color}`} />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">Plagiarism Check</h3>
          <p className="text-xs text-gray-400">Detected by backend AI service</p>
        </div>
        <div className="ml-auto">
          <Badge variant={config.variant} size="md">{plagiarism.status} Risk</Badge>
        </div>
      </div>
      <div className="flex items-end gap-4">
        <div className={`flex-shrink-0 h-20 w-20 rounded-2xl border flex flex-col items-center justify-center ${config.bg}`}>
          <span className={`text-3xl font-black ${config.color}`}>{plagiarism.percentage}%</span>
          <span className="text-[10px] font-semibold text-gray-500 mt-0.5">Similarity</span>
        </div>
        <div className="flex-1 space-y-2">
          <div className="h-3 w-full rounded-full bg-gray-100 overflow-hidden">
            <div
              className={`h-full rounded-full bg-gradient-to-r ${
                plagiarism.status === 'Low' ? 'from-[#10B981] to-emerald-400'
                : plagiarism.status === 'Moderate' ? 'from-amber-500 to-yellow-400'
                : 'from-red-500 to-rose-400'
              } transition-all duration-700`}
              style={{ width: `${capped}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-gray-400 font-medium">
            <span>0% — Original</span>
            <span>50% — Moderate</span>
            <span>100% — High</span>
          </div>
        </div>
      </div>
      <div className="mt-4 rounded-xl bg-blue-50 border border-blue-100 px-4 py-3 flex items-start gap-2">
        <AlertTriangle className="h-4 w-4 text-blue-500 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-blue-700 leading-relaxed">
          <span className="font-semibold">Note:</span> {plagiarism.note}
        </p>
      </div>
    </Card>
  );
}

// ─── Sub-component: Action Buttons ─────────────────────────────
function ActionButtons({ submissionId }) {
  const navigate = useNavigate();
  return (
    <Card padding="sm">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-2">
        <Link to="/student" className="flex-1">
          <Button variant="outline" size="md" fullWidth icon={<ArrowLeft className="h-4 w-4" />}>
            Back to Dashboard
          </Button>
        </Link>
        {/* TODO: Wire to backend PDF report generation endpoint → GET /api/evaluations/:id/report */}
        <Button
          variant="ghost"
          size="md"
          className="flex-1"
          icon={<Download className="h-4 w-4" />}
          onClick={() => window.alert('Download Report — connect to backend PDF export API')}
        >
          Download Report
        </Button>
        <Button
          variant="primary"
          size="md"
          className="flex-1"
          icon={<MessageSquareText className="h-4 w-4" />}
          onClick={() => navigate(`/student/feedback/${submissionId}`)}
        >
          View Detailed Feedback
        </Button>
      </div>
    </Card>
  );
}

// ─── Main Component ────────────────────────────────────────────
function StudentResults() {
  const [searchParams] = useSearchParams();

  // Read submission ID from URL: /student/results?id=sub-001
  // TODO: When backend is ready, this ID will come from the upload API response
  // and be stored in context/localStorage before navigating here.
  const submissionId = searchParams.get('id') || 'sub-001';

  // TODO: Replace with async API call: const data = await getEvaluationById(submissionId);
  const data = getEvaluationById(submissionId);

  if (!data) {
    return <EvaluationNotFound submissionId={submissionId} />;
  }

  const colors = getPercentageColor(data.percentage);

  return (
    <div className="space-y-6 sm:space-y-8 pb-8">
      <PageHeader
        title="Evaluation Results"
        description="Review your notebook evaluation and AI-generated feedback."
        breadcrumbs={[
          { label: 'Dashboard', path: '/student' },
          { label: 'Results' },
        ]}
        actions={
          <Badge variant="success" size="lg" dot>
            Evaluation Complete
          </Badge>
        }
      />

      <ScoreHeroCard data={data} />
      <SummaryMeta data={data} />

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AIFeedbackCard feedback={data.overallFeedback} />
        </div>
        <div className="space-y-6">
          <Card>
            <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-4">
              <TrendingUp className="h-4 w-4 text-[#4F46E5]" />
              Score Summary
            </h3>
            <div className="space-y-3">
              {[
                { label: 'Total Score', value: `${data.obtainedMarks} / ${data.totalMarks}`, highlight: true },
                { label: 'Percentage', value: `${data.percentage}%`, highlight: true },
                { label: 'Grade', value: data.grade, highlight: false },
                { label: 'Status', value: 'Evaluated', highlight: false },
              ].map(({ label, value, highlight }) => (
                <div key={label} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <span className="text-sm text-gray-500">{label}</span>
                  <span className={`text-sm font-bold ${highlight ? 'text-[#4F46E5]' : 'text-gray-900'}`}>{value}</span>
                </div>
              ))}
            </div>
            <div className={`mt-4 rounded-xl border p-3 flex items-center gap-3 ${colors.light}`}>
              {data.percentage >= 80
                ? <TrendingUp className={`h-5 w-5 flex-shrink-0 ${colors.text}`} />
                : <TrendingDown className={`h-5 w-5 flex-shrink-0 ${colors.text}`} />}
              <p className={`text-xs font-semibold ${colors.text}`}>
                {data.percentage >= 80 ? 'Excellent performance! Keep it up.'
                  : data.percentage >= 60 ? 'Good effort. Room for improvement.'
                  : 'Needs significant improvement.'}
              </p>
            </div>
          </Card>
          <PlagiarismCard plagiarism={data.plagiarism} />
        </div>
      </div>

      <BreakdownCard sections={data.sections} />
      <ActionButtons submissionId={data.submissionId} />
    </div>
  );
}

export default StudentResults;
