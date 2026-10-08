import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldAlert,
  ShieldCheck,
  CheckCircle,
  AlertTriangle,
  Search,
  Eye,
  FileText,
  Sparkles,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';

import { Card, Badge, Button, PageHeader } from '../../components/common';
import { getAllEvaluations } from '../../data/evaluationStore';

function Plagiarism() {
  const navigate = useNavigate();
  const [evaluations, setEvaluations] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [riskFilter, setRiskFilter] = useState('All');

  // Instant Checker State
  const [textA, setTextA] = useState('');
  const [textB, setTextB] = useState('');
  const [similarityScore, setSimilarityScore] = useState(null);

  useEffect(() => {
    setEvaluations(getAllEvaluations());
  }, []);

  const filtered = evaluations.filter((e) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !searchQuery ||
      (e.studentName || '').toLowerCase().includes(q) ||
      (e.notebookName || '').toLowerCase().includes(q) ||
      (e.subject || '').toLowerCase().includes(q);

    const plagPct = e.plagiarism?.percentage || 0;
    const riskCategory = plagPct > 30 ? 'High' : plagPct > 10 ? 'Moderate' : 'Low';
    const matchesRisk = riskFilter === 'All' || riskFilter === riskCategory;

    return matchesSearch && matchesRisk;
  });

  const totalEvaluated = evaluations.length;
  const lowRiskCount = evaluations.filter((e) => (e.plagiarism?.percentage || 0) <= 10).length;
  const modRiskCount = evaluations.filter((e) => (e.plagiarism?.percentage || 0) > 10 && (e.plagiarism?.percentage || 0) <= 30).length;
  const highRiskCount = evaluations.filter((e) => (e.plagiarism?.percentage || 0) > 30).length;

  const handleRunInstantCheck = () => {
    if (!textA.trim() || !textB.trim()) return;

    const wordsA = new Set(textA.toLowerCase().split(/\s+/));
    const wordsB = textB.toLowerCase().split(/\s+/);
    let matches = 0;
    wordsB.forEach((w) => {
      if (wordsA.has(w)) matches++;
    });

    const ratio = Math.round((matches / Math.max(wordsB.length, 1)) * 100);
    setSimilarityScore(ratio);
  };

  return (
    <div className="space-y-6 sm:space-y-8 pb-8">
      {/* ── HEADER ── */}
      <PageHeader
        title="Plagiarism & Authenticity Audit"
        description="Verify original handwriting transcription, check text similarity, and detect potential submission plagiarism."
        breadcrumbs={[
          { label: 'Teacher Dashboard', path: '/teacher' },
          { label: 'Plagiarism' },
        ]}
      />

      {/* ── STATS ROW ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-[#4F46E5]/10 flex items-center justify-center text-[#4F46E5]">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium">Total Audited</p>
            <p className="text-2xl font-black text-gray-900 mt-0.5">{totalEvaluated}</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-green-500/10 flex items-center justify-center text-[#10B981]">
            <CheckCircle className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium">Low Risk (≤10%)</p>
            <p className="text-2xl font-black text-gray-900 mt-0.5">{lowRiskCount}</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-600">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium">Moderate Risk (11-30%)</p>
            <p className="text-2xl font-black text-gray-900 mt-0.5">{modRiskCount}</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-600">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium">High Risk (&gt;30%)</p>
            <p className="text-2xl font-black text-gray-900 mt-0.5">{highRiskCount}</p>
          </div>
        </Card>
      </div>

      {/* ── PLAGIARISM AUDIT TABLE ── */}
      <Card padding="none" className="overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
          <div>
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-[#4F46E5]" />
              Notebook Plagiarism Audit Logs
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">Automated transcription and originality verification</p>
          </div>

          <div className="flex flex-wrap gap-3 w-full md:w-auto">
            {/* Search */}
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
              <input
                type="text"
                placeholder="Search student or notebook..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#4F46E5]"
              />
            </div>

            {/* Risk filter */}
            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 bg-white"
            >
              <option value="All">All Risk Levels</option>
              <option value="Low">Low Risk</option>
              <option value="Moderate">Moderate Risk</option>
              <option value="High">High Risk</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/60">
                <th className="px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase">Student</th>
                <th className="px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase">Notebook / Subject</th>
                <th className="px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase">Plagiarism Score</th>
                <th className="px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase">Audit Note</th>
                <th className="px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((row) => {
                const plag = row.plagiarism || { percentage: 4, status: 'Low', note: 'Authentic transcription.' };
                const badgeVariant = plag.percentage > 30 ? 'danger' : plag.percentage > 10 ? 'warning' : 'success';
                return (
                  <tr key={row.submissionId} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-gray-900">{row.studentName || 'Saurabh Adhav'}</p>
                      <p className="text-[11px] text-gray-400">ID: {row.submissionId}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-900">{row.notebookName}</p>
                      <p className="text-xs text-gray-400">{row.subject}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Badge variant={badgeVariant} size="sm">
                          {plag.percentage}% Plagiarism
                        </Badge>
                        <span className="text-xs text-gray-400">({plag.status} Risk)</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-xs text-gray-600 max-w-xs">{plag.note}</p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button
                        variant="ghost"
                        size="xs"
                        icon={<Eye className="h-3.5 w-3.5" />}
                        onClick={() => navigate(`/teacher/feedback/${row.submissionId}`)}
                      >
                        View Details
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* ── INSTANT TEXT COMPARISON TOOL ── */}
      <Card>
        <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-2">
          <Sparkles className="h-4 w-4 text-[#4F46E5]" />
          Instant Cross-Check Similarity Tool
        </h3>
        <p className="text-xs text-gray-400 mb-4">Compare two student answers side by side for direct copy detection.</p>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Passage A (Student 1)</label>
            <textarea
              rows={4}
              placeholder="Paste student answer A text..."
              value={textA}
              onChange={(e) => setTextA(e.target.value)}
              className="w-full p-3 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#4F46E5]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Passage B (Student 2)</label>
            <textarea
              rows={4}
              placeholder="Paste student answer B text..."
              value={textB}
              onChange={(e) => setTextB(e.target.value)}
              className="w-full p-3 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#4F46E5]"
            />
          </div>
        </div>

        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Button variant="primary" size="sm" icon={<RefreshCw className="h-4 w-4" />} onClick={handleRunInstantCheck}>
            Calculate Text Similarity
          </Button>

          {similarityScore !== null && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#4F46E5]/10 border border-[#4F46E5]/20">
              <span className="text-xs font-medium text-gray-700">Matched Similarity:</span>
              <span className={`text-base font-black ${similarityScore > 40 ? 'text-red-600' : 'text-[#10B981]'}`}>
                {similarityScore}%
              </span>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

export default Plagiarism;
