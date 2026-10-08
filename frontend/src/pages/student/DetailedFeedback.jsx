import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Sparkles,
  BookOpen,
  Calendar,
  Clock,
  FileText,
  ThumbsUp,
  Target,
  Lightbulb,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  ChevronDown,
  ChevronUp,
  Star,
  MessageSquareText,
  AlertCircle,
  SearchX,
  BookMarked,
  PenLine,
  Wand2,
} from 'lucide-react';

import { Card, Badge, Button, PageHeader } from '../../components/common';
import { getEvaluationById } from '../../data/evaluationStore';
import { useAuth } from '../../hooks/useAuth';

// ─── Helpers ────────────────────────────────────────────────────
function getPercentageColor(pct) {
  if (pct >= 80) return { text: 'text-[#10B981]', bg: 'from-[#10B981] to-emerald-400', light: 'bg-green-50 border-green-100' };
  if (pct >= 60) return { text: 'text-amber-600', bg: 'from-amber-500 to-yellow-400', light: 'bg-amber-50 border-amber-100' };
  return { text: 'text-red-600', bg: 'from-red-500 to-rose-400', light: 'bg-red-50 border-red-100' };
}

const statusConfig = {
  correct:   { label: 'Correct',   variant: 'success', icon: CheckCircle2, color: 'text-[#10B981]' },
  partial:   { label: 'Partial',   variant: 'warning', icon: AlertCircle,  color: 'text-amber-600' },
  incorrect: { label: 'Incorrect', variant: 'danger',  icon: AlertCircle,  color: 'text-red-600'   },
};

// ─── Not Found State ─────────────────────────────────────────────
function EvaluationNotFound({ id, isTeacher, backPath, dashboardPath }) {
  return (
    <div className="space-y-6 pb-8">
      <PageHeader
        title="Detailed Feedback"
        description="Question-wise AI evaluation and personalised feedback for your notebook."
        breadcrumbs={[
          { label: isTeacher ? 'Teacher Dashboard' : 'Dashboard', path: dashboardPath },
          { label: 'Student Results', path: backPath },
          { label: 'Detailed Feedback' },
        ]}
      />
      <Card>
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="h-16 w-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
            <SearchX className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">Evaluation Not Found</h3>
          <p className="text-sm text-gray-500 mt-2 max-w-sm">
            {id
              ? `No evaluation found for submission ID "${id}".`
              : 'No submission ID was provided.'}
            {' '}The evaluation may still be processing or the link may be invalid.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <Link to={backPath}>
              <Button variant="primary" size="md" icon={<ArrowLeft className="h-4 w-4" />}>
                Back to Results
              </Button>
            </Link>
            <Link to={dashboardPath}>
              <Button variant="outline" size="md">Back to Dashboard</Button>
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
}

// ─── Sub-component: Score Banner ─────────────────────────────────
function ScoreBanner({ data }) {
  const capped = Math.min(data.percentage, 100);
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-[#4F46E5] via-[#4338CA] to-[#3730A3] rounded-3xl p-6 sm:p-8 shadow-xl shadow-[#4F46E5]/20">
      <div className="absolute -top-20 -right-20 h-64 w-64 bg-white/5 rounded-full blur-3xl" />
      <div className="absolute -bottom-16 -left-12 h-56 w-56 bg-white/5 rounded-full blur-3xl" />
      <div className="relative flex flex-col sm:flex-row sm:items-center gap-6">
        <div className="flex-shrink-0 flex flex-col items-center justify-center h-28 w-28 rounded-full bg-white/10 border-4 border-white/20 backdrop-blur-sm mx-auto sm:mx-0">
          <span className="text-3xl font-black text-white leading-none">{data.percentage}%</span>
          <span className="text-xs font-semibold text-indigo-200 mt-1">Overall</span>
        </div>
        <div className="flex-1 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-2">
            <Badge variant="success" size="md">
              <CheckCircle2 className="h-3.5 w-3.5" />Evaluated
            </Badge>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 border border-white/20 text-xs font-bold text-white">
              <Star className="h-3.5 w-3.5 text-yellow-300" />Grade {data.grade}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">{data.notebookName}</h2>
          <p className="text-indigo-200 text-sm mt-0.5">{data.studentName ? `Student: ${data.studentName} · ` : ''}{data.subject} · {data.chapter}</p>
          <div className="mt-3 max-w-sm mx-auto sm:mx-0">
            <div className="flex justify-between mb-1">
              <span className="text-xs text-indigo-300">{data.obtainedMarks} / {data.totalMarks} marks</span>
              <span className="text-xs font-bold text-white">{data.percentage}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-white/20 overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-white/80 to-white transition-all duration-700" style={{ width: `${capped}%` }} />
            </div>
          </div>
        </div>
        <div className="flex-shrink-0 flex flex-col items-center justify-center h-20 w-20 rounded-2xl bg-white/10 border border-white/20 mx-auto sm:mx-0">
          <span className="text-2xl font-black text-white">{data.obtainedMarks}</span>
          <span className="text-[10px] text-indigo-300 mt-0.5">of {data.totalMarks}</span>
        </div>
      </div>
    </div>
  );
}

// ─── Sub-component: Meta Row ──────────────────────────────────────
function MetaRow({ data }) {
  const items = [
    { icon: BookOpen, label: 'Subject',   value: data.subject },
    { icon: FileText, label: 'Chapter',   value: data.chapter },
    { icon: Calendar, label: 'Submitted', value: data.submissionDate },
    { icon: Clock,    label: 'Evaluated', value: data.evaluationDate },
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

// ─── Sub-component: Overall AI Feedback ──────────────────────────
function OverallFeedback({ feedback }) {
  return (
    <Card>
      <div className="flex items-center gap-2 mb-1">
        <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-[#4F46E5] to-purple-600 flex items-center justify-center flex-shrink-0">
          <Sparkles className="h-4 w-4 text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">Overall AI Feedback</h3>
          <p className="text-xs text-gray-400">Generated by Flan-T5 evaluation model</p>
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
            <span className="text-sm font-semibold text-amber-700">Areas to Improve</span>
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

// ─── Sub-component: Question Detail Panel ────────────────────────
function QuestionPanel({ question, index }) {
  const [open, setOpen] = useState(false);
  const sc = statusConfig[question.evaluationStatus] || statusConfig.partial;
  const StatusIcon = sc.icon;
  const colors = getPercentageColor(question.percentage);

  return (
    <div className="rounded-xl border border-gray-100 bg-white overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-start gap-3 p-4 hover:bg-gray-50/60 transition-colors text-left"
      >
        <div className="h-7 w-7 rounded-lg bg-[#4F46E5]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
          <span className="text-[11px] font-bold text-[#4F46E5]">Q{index + 1}</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900">{question.questionText}</p>
          <div className="mt-2 flex items-center gap-2">
            <div className="flex-1 h-1.5 rounded-full bg-gray-100 overflow-hidden">
              <div
                className={`h-full rounded-full bg-gradient-to-r ${colors.bg} transition-all duration-500`}
                style={{ width: `${question.percentage}%` }}
              />
            </div>
            <span className={`text-[10px] font-bold ${colors.text}`}>{question.percentage}%</span>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0 ml-2">
          <span className={`text-sm font-bold ${colors.text}`}>
            {question.obtainedMarks}/{question.maximumMarks}
          </span>
          <Badge variant={sc.variant} size="xs">
            <StatusIcon className="h-3 w-3" />
            {sc.label}
          </Badge>
          {open
            ? <ChevronUp className="h-4 w-4 text-gray-400" />
            : <ChevronDown className="h-4 w-4 text-gray-400" />}
        </div>
      </button>

      {open && (
        <div className="border-t border-gray-100 p-4 space-y-4 bg-gray-50/40">
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <div className="flex items-center gap-2 mb-2">
              <PenLine className="h-4 w-4 text-[#4F46E5]" />
              <span className="text-xs font-semibold text-[#4F46E5] uppercase tracking-wide">Student's Answer</span>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{question.studentAnswer}</p>
          </div>

          <div className="rounded-xl border border-green-100 bg-green-50/60 p-4">
            <div className="flex items-center gap-2 mb-2">
              <BookMarked className="h-4 w-4 text-[#10B981]" />
              <span className="text-xs font-semibold text-[#059669] uppercase tracking-wide">Expected Answer</span>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{question.expectedAnswer}</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <div className="rounded-xl border border-[#4F46E5]/15 bg-[#4F46E5]/5 p-4">
              <div className="flex items-center gap-2 mb-2">
                <MessageSquareText className="h-4 w-4 text-[#4F46E5]" />
                <span className="text-xs font-semibold text-[#4F46E5] uppercase tracking-wide">AI Feedback</span>
              </div>
              <p className="text-xs text-gray-700 leading-relaxed">{question.questionFeedback}</p>
            </div>
            <div className="rounded-xl border border-amber-100 bg-amber-50/60 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Wand2 className="h-4 w-4 text-amber-600" />
                <span className="text-xs font-semibold text-amber-700 uppercase tracking-wide">Improvement Suggestion</span>
              </div>
              <p className="text-xs text-gray-700 leading-relaxed">{question.improvementSuggestion}</p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-xs text-gray-400">
              Marks: <span className={`font-bold ${colors.text}`}>{question.obtainedMarks}</span> / {question.maximumMarks}
            </span>
            <Badge variant={sc.variant} size="sm">
              <StatusIcon className="h-3 w-3" />
              {sc.label} · {question.percentage}%
            </Badge>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Sub-component: Section Card ─────────────────────────────────
function SectionCard({ section }) {
  const [open, setOpen] = useState(true);
  const colors = getPercentageColor(section.percentage);
  const badgeVariant = section.percentage >= 80 ? 'success' : section.percentage >= 60 ? 'warning' : 'danger';

  return (
    <Card padding="none" className="overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-start sm:items-center justify-between px-6 py-4 border-b border-gray-100 hover:bg-gray-50/50 transition-colors gap-4"
      >
        <div className="flex items-start sm:items-center gap-3 flex-1 min-w-0 text-left">
          <div className={`h-10 w-10 rounded-xl border flex flex-col items-center justify-center flex-shrink-0 ${colors.light}`}>
            <span className={`text-sm font-black leading-none ${colors.text}`}>{section.percentage}%</span>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900">{section.sectionName}</p>
            <p className="text-xs text-gray-400 mt-0.5">
              {section.obtainedMarks} / {section.maximumMarks} marks · {section.totalQuestions} questions
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <Badge variant={badgeVariant} size="sm">{section.status}</Badge>
          {open ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
        </div>
      </button>

      {open && (
        <div className="p-6 space-y-5">
          <div className="rounded-xl bg-[#4F46E5]/5 border border-[#4F46E5]/15 px-4 py-3 flex items-start gap-2">
            <MessageSquareText className="h-4 w-4 text-[#4F46E5] flex-shrink-0 mt-0.5" />
            <p className="text-sm text-gray-700 leading-relaxed">{section.sectionFeedback}</p>
          </div>

          <div className="space-y-3">
            {section.questions.map((q, i) => (
              <QuestionPanel key={q.questionId} question={q} index={i} />
            ))}
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <span className="text-xs font-semibold text-gray-500">Section Total</span>
            <div className="flex items-center gap-2">
              <span className={`text-sm font-black ${colors.text}`}>{section.obtainedMarks}</span>
              <span className="text-xs text-gray-400">/ {section.maximumMarks} marks</span>
              <Badge variant={badgeVariant} size="sm">{section.percentage}%</Badge>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}

// ─── Main Component ───────────────────────────────────────────────
function DetailedFeedback() {
  const { id } = useParams();
  const { userRole } = useAuth();
  const isTeacher = userRole === 'teacher';

  const backPath = isTeacher ? '/teacher/student-results' : `/student/results?id=${id}`;
  const dashboardPath = isTeacher ? '/teacher' : '/student';

  const data = getEvaluationById(id);

  if (!data) {
    return (
      <EvaluationNotFound
        id={id}
        isTeacher={isTeacher}
        backPath={backPath}
        dashboardPath={dashboardPath}
      />
    );
  }

  const overallColors = getPercentageColor(data.percentage);
  const totalQuestions = data.sections.reduce((a, s) => a + s.totalQuestions, 0);

  return (
    <div className="space-y-6 sm:space-y-8 pb-8">
      {/* ── PAGE HEADER ── */}
      <PageHeader
        title="Detailed Feedback"
        description="Question-wise AI evaluation and personalised feedback for your notebook."
        breadcrumbs={[
          { label: isTeacher ? 'Teacher Dashboard' : 'Dashboard', path: dashboardPath },
          { label: 'Student Results', path: backPath },
          { label: 'Detailed Feedback' },
        ]}
        actions={
          <Link to={backPath}>
            <Button variant="outline" size="sm" icon={<ArrowLeft className="h-4 w-4" />}>
              Back to Results
            </Button>
          </Link>
        }
      />

      {/* ── SCORE BANNER ── */}
      <ScoreBanner data={data} />

      {/* ── META ROW ── */}
      <MetaRow data={data} />

      {/* ── OVERALL AI FEEDBACK ── */}
      <OverallFeedback feedback={data.overallFeedback} />

      {/* ── SECTION-WISE FEEDBACK ── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Section-wise Detailed Feedback</h2>
            <p className="text-sm text-gray-500 mt-0.5">
              {data.sections.length} sections · {totalQuestions} questions evaluated
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-lg font-black ${overallColors.text}`}>
              {data.obtainedMarks}/{data.totalMarks}
            </span>
            <Badge
              variant={data.percentage >= 80 ? 'success' : data.percentage >= 60 ? 'warning' : 'danger'}
              size="md"
            >
              {data.percentage}%
            </Badge>
          </div>
        </div>

        <div className="space-y-4">
          {data.sections.map((section) => (
            <SectionCard key={section.sectionId} section={section} />
          ))}
        </div>
      </div>

      {/* ── FOOTER ── */}
      <Card>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`h-12 w-12 rounded-xl border flex items-center justify-center flex-shrink-0 ${overallColors.light}`}>
              {data.percentage >= 80
                ? <TrendingUp className={`h-5 w-5 ${overallColors.text}`} />
                : <TrendingDown className={`h-5 w-5 ${overallColors.text}`} />}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">
                {data.percentage >= 80 ? 'Excellent performance! Keep it up.'
                  : data.percentage >= 60 ? 'Good effort. Room for improvement.'
                  : 'Needs significant improvement.'}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                Final Score: {data.obtainedMarks} / {data.totalMarks} marks ({data.percentage}%) · Grade {data.grade}
              </p>
            </div>
          </div>
          <Link to={backPath}>
            <Button variant="outline" size="md" icon={<ArrowLeft className="h-4 w-4" />}>
              Back to Results
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}

export default DetailedFeedback;
