import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
  Loader2,
  Sparkles,
  BookOpen,
  X,
  ArrowRight,
  Eye,
  Zap,
} from 'lucide-react';

import { Card, Badge, Button, PageHeader } from '../../components/common';
import { addEvaluationRecord } from '../../data/evaluationStore';

const sampleQuestionsMap = {
  'Chapter 1 — Ice-cream Man': [
    { id: 'q1', question: 'In which season is ice-cream popular?', answer: 'Ice-cream is popular in the hot summer season.', marks: 5 },
    { id: 'q2', question: 'Who feels joyful on seeing the Ice-cream Man?', answer: 'Children feel joyful on seeing the Ice-cream Man.', marks: 5 },
  ],
  'Chapter 2 — Wonderful Waste': [
    { id: 'q1', question: 'What did the cook prepare from the vegetable scraps?', answer: 'The cook washed the vegetable scraps and boiled them to prepare a new dish called Avial.', marks: 5 },
    { id: 'q2', question: 'Why did the Maharaja enter the kitchen?', answer: 'The Maharaja entered the kitchen to inspect the dishes prepared for the grand dinner.', marks: 5 },
  ],
};

function BulkUpload() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [subject, setSubject] = useState('English (Marigold)');
  const [chapter, setChapter] = useState('Chapter 1 — Ice-cream Man');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processLogs, setProcessLogs] = useState([]);
  const [completedRecords, setCompletedRecords] = useState([]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files).map((file, idx) => ({
        id: `file-${Date.now()}-${idx}`,
        file,
        name: file.name,
        size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
        studentName: file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
        status: 'ready', // ready, processing, completed, error
        progress: 0,
      }));
      setSelectedFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const removeFile = (id) => {
    setSelectedFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const updateStudentName = (id, newName) => {
    setSelectedFiles((prev) =>
      prev.map((f) => (f.id === id ? { ...f, studentName: newName } : f))
    );
  };

  const handleStartBulkEvaluation = async () => {
    if (selectedFiles.length === 0) return;

    setIsProcessing(true);
    setProcessLogs([]);
    setCompletedRecords([]);

    const targetQuestions = sampleQuestionsMap[chapter] || sampleQuestionsMap['Chapter 1 — Ice-cream Man'];

    for (let i = 0; i < selectedFiles.length; i++) {
      const item = selectedFiles[i];

      // Update file status to processing
      setSelectedFiles((prev) =>
        prev.map((f) => (f.id === item.id ? { ...f, status: 'processing', progress: 30 } : f))
      );

      // Simulate step 1: OCR Extraction
      setProcessLogs((prev) => [...prev, `[${item.name}] Extracting handwritten text via Tesseract OCR...`]);
      await new Promise((r) => setTimeout(r, 600));

      // Simulate step 2: Answer Comparison
      setSelectedFiles((prev) =>
        prev.map((f) => (f.id === item.id ? { ...f, progress: 70 } : f))
      );
      setProcessLogs((prev) => [...prev, `[${item.name}] Evaluating student answers against ${chapter} key...`]);
      await new Promise((r) => setTimeout(r, 600));

      // Create evaluation record in store
      const newSubId = addEvaluationRecord({
        studentName: item.studentName || 'Student',
        subject,
        chapter,
        notebookName: item.name,
        questionsList: targetQuestions,
        studentAnswer: targetQuestions[0]?.answer || 'Ice-cream is popular in summer.',
      });

      setSelectedFiles((prev) =>
        prev.map((f) => (f.id === item.id ? { ...f, status: 'completed', progress: 100 } : f))
      );

      setProcessLogs((prev) => [...prev, `[SUCCESS] ${item.name} evaluated successfully! ID: ${newSubId}`]);
      setCompletedRecords((prev) => [...prev, { id: newSubId, studentName: item.studentName, fileName: item.name }]);
    }

    setIsProcessing(false);
  };

  return (
    <div className="space-y-6 sm:space-y-8 pb-8">
      {/* ── HEADER ── */}
      <PageHeader
        title="Teacher Bulk Notebook Upload"
        description="Upload and evaluate multiple student handwritten notebooks simultaneously with AI OCR."
        breadcrumbs={[
          { label: 'Teacher Dashboard', path: '/teacher' },
          { label: 'Bulk Upload' },
        ]}
      />

      {/* ── BATCH CONFIGURATION ── */}
      <Card>
        <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-4">
          <BookOpen className="h-4 w-4 text-[#4F46E5]" />
          1. Select Subject & Chapter for Batch
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Subject</label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-900 focus:outline-none focus:border-[#4F46E5]"
            >
              <option value="English (Marigold)">English (Marigold)</option>
              <option value="Mathematics (NCERT)">Mathematics (NCERT)</option>
              <option value="EVS (Looking Around)">EVS (Looking Around)</option>
              <option value="Hindi (Rimjhim)">Hindi (Rimjhim)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Chapter Target</label>
            <select
              value={chapter}
              onChange={(e) => setChapter(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-900 focus:outline-none focus:border-[#4F46E5]"
            >
              <option value="Chapter 1 — Ice-cream Man">Chapter 1 — Ice-cream Man</option>
              <option value="Chapter 2 — Wonderful Waste">Chapter 2 — Wonderful Waste</option>
            </select>
          </div>
        </div>
      </Card>

      {/* ── DROPZONE & FILE LIST ── */}
      <Card>
        <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-4">
          <Upload className="h-4 w-4 text-[#4F46E5]" />
          2. Upload Student Notebook PDFs / Images
        </h3>

        {/* Dropzone */}
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-gray-300 hover:border-[#4F46E5] bg-gray-50/50 hover:bg-[#4F46E5]/5 transition-all rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer text-center group"
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            multiple
            accept="application/pdf,image/*"
            className="hidden"
          />
          <div className="h-14 w-14 rounded-2xl bg-[#4F46E5]/10 group-hover:scale-110 transition-transform flex items-center justify-center text-[#4F46E5] mb-3">
            <Upload className="h-7 w-7" />
          </div>
          <p className="text-sm font-bold text-gray-900">Click or drag PDF / Image notebooks here</p>
          <p className="text-xs text-gray-400 mt-1">Select single or multiple student notebooks (PDF, PNG, JPG)</p>
        </div>

        {/* Selected Files List */}
        {selectedFiles.length > 0 && (
          <div className="mt-6 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Selected Files ({selectedFiles.length})
              </span>
              <button
                onClick={() => setSelectedFiles([])}
                className="text-xs font-semibold text-red-600 hover:underline"
                disabled={isProcessing}
              >
                Clear All
              </button>
            </div>

            <div className="divide-y divide-gray-100 rounded-xl border border-gray-200 overflow-hidden">
              {selectedFiles.map((item) => (
                <div key={item.id} className="p-3.5 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <FileText className="h-5 w-5 text-[#4F46E5] flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                      <p className="text-[11px] text-gray-400">{item.size}</p>
                    </div>
                  </div>

                  {/* Student Name Input */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <input
                      type="text"
                      placeholder="Student Name"
                      value={item.studentName}
                      onChange={(e) => updateStudentName(item.id, e.target.value)}
                      disabled={isProcessing}
                      className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs text-gray-800 font-semibold focus:outline-none focus:border-[#4F46E5]"
                    />

                    {/* Status indicator */}
                    {item.status === 'completed' && <CheckCircle className="h-5 w-5 text-[#10B981]" />}
                    {item.status === 'processing' && <Loader2 className="h-5 w-5 text-[#4F46E5] animate-spin" />}
                    {item.status === 'ready' && (
                      <button
                        onClick={() => removeFile(item.id)}
                        disabled={isProcessing}
                        className="p-1 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-red-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Action button */}
            <div className="pt-3 flex justify-end">
              <Button
                variant="primary"
                size="md"
                icon={isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />}
                onClick={handleStartBulkEvaluation}
                disabled={isProcessing}
              >
                {isProcessing ? 'Evaluating Batch...' : `Evaluate ${selectedFiles.length} Notebook(s)`}
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* ── LIVE PROCESSING LOGS ── */}
      {processLogs.length > 0 && (
        <Card>
          <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-3">
            <Sparkles className="h-4 w-4 text-[#4F46E5]" />
            Batch Evaluation Logs
          </h3>
          <div className="bg-gray-900 rounded-xl p-4 font-mono text-xs text-green-400 space-y-1 max-h-48 overflow-y-auto">
            {processLogs.map((log, idx) => (
              <p key={idx}>{log}</p>
            ))}
          </div>
        </Card>
      )}

      {/* ── BATCH COMPLETE SUMMARY ── */}
      {completedRecords.length > 0 && (
        <Card className="bg-green-50/60 border-green-100">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-green-500 text-white flex items-center justify-center flex-shrink-0">
                <CheckCircle className="h-6 w-6" />
              </div>
              <div>
                <h4 className="text-base font-bold text-gray-900">Bulk Evaluation Finished!</h4>
                <p className="text-xs text-gray-600">Successfully evaluated {completedRecords.length} notebook(s).</p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="primary"
                size="sm"
                icon={<Eye className="h-4 w-4" />}
                onClick={() => navigate('/teacher/student-results')}
              >
                View Results Dashboard
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}

export default BulkUpload;
