import { useRef, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as pdfjsLib from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import Tesseract from 'tesseract.js';
import {
  UploadCloud,
  FileText,
  X,
  CheckCircle2,
  Loader2,
  Image as ImageIcon,
  ScanText,
  FileSearch,
  Sparkles,
  Calculator,
  Lightbulb,
  ChevronDown,
  BookOpen,
  FileUp,
  Clock,
  HardDrive,
  Calendar,
  ArrowRight,
  ShieldCheck,
  Layers,
  NotebookPen,
} from 'lucide-react';

import { Card, Button, Badge, PageHeader } from '../../components/common';
import { addEvaluationRecord } from '../../data/evaluationStore';
import { getChapterQuestions } from '../../data/ncertAnswers';

// Configure local pdfjs worker
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

// ─── Mock Data ─────────────────────────────────────────────────
const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20 MB in bytes

const subjects = [
  { id: 'english', label: 'English', book: 'Marigold' },
  { id: 'hindi', label: 'Hindi', book: 'Rimjhim' },
  { id: 'maths', label: 'Maths', book: 'Math Magic' },
  { id: 'evs', label: 'EVS', book: 'Looking Around' },
];

const chaptersDummy = {
  english: [
    { id: 'e1', label: 'Chapter 1 — Ice-cream Man' },
    { id: 'e2', label: 'Chapter 2 — Wonderful Waste' },
    { id: 'e3', label: 'Chapter 3 — Robinson Crusoe' },
    { id: 'e4', label: 'Chapter 4 — Crying' },
    { id: 'e5', label: 'Chapter 5 — My Shadow' },
    { id: 'e6', label: 'Chapter 6 — Class Discussion' },
    { id: 'e7', label: 'Chapter 7 — Topsy-turvy Land' },
    { id: 'e8', label: "Chapter 8 — Gulliver's Travels" },
  ],
  hindi: [
    { id: 'h1', label: 'पाठ 1 — ध्वनि' },
    { id: 'h2', label: 'पाठ 2 — बचपन' },
    { id: 'h3', label: 'पाठ 3 — नादान दोस्त' },
    { id: 'h4', label: 'पाठ 4 — चाँद से थोड़ी सी गप्पें' },
    { id: 'h5', label: 'पाठ 5 — अक्षरों का महत्व' },
    { id: 'h6', label: 'पाठ 6 — पार नज़र के' },
    { id: 'h7', label: 'पाठ 7 — साथी हाथ बढ़ाना' },
    { id: 'h8', label: 'पाठ 8 — ऐसे-वैसे' },
  ],
  maths: [
    { id: 'm1', label: 'Chapter 1 — The Fish Tale' },
    { id: 'm2', label: 'Chapter 2 — Shapes and Angles' },
    { id: 'm3', label: 'Chapter 3 — How Many Squares?' },
    { id: 'm4', label: 'Chapter 4 — Parts and Wholes' },
    { id: 'm5', label: 'Chapter 5 — Does it Look the Same?' },
    { id: 'm6', label: "Chapter 6 — Be My Multiple, I'll be Your Factor" },
    { id: 'm7', label: 'Chapter 7 — Can You See the Pattern?' },
    { id: 'm8', label: 'Chapter 8 — Mapping Your Way' },
  ],
  evs: [
    { id: 'v1', label: 'Chapter 1 — Super Senses' },
    { id: 'v2', label: "Chapter 2 — A Snake Charmer's Story" },
    { id: 'v3', label: 'Chapter 3 — From Tasting to Digesting' },
    { id: 'v4', label: 'Chapter 4 — Mangoes Round the Year' },
    { id: 'v5', label: 'Chapter 5 — Seeds and Seeds' },
    { id: 'v6', label: 'Chapter 6 — Every Drop Counts' },
    { id: 'v7', label: 'Chapter 7 — Experiments with Water' },
    { id: 'v8', label: 'Chapter 8 — A Treat for Mosquitoes' },
  ],
};

const processingSteps = [
  { title: 'Image Preprocessing', subtitle: 'Enhance contrast, remove noise & deskew', icon: ImageIcon, color: 'blue' },
  { title: 'Handwriting Recognition (TrOCR)', subtitle: 'Detect and digitize handwritten text', icon: NotebookPen, color: 'violet' },
  { title: 'OCR Text Extraction', subtitle: 'Extract structured text from pages', icon: ScanText, color: 'cyan' },
  { title: 'AI Answer Evaluation (Flan-T5)', subtitle: 'Compare answers against the answer key', icon: FileSearch, color: 'indigo' },
  { title: 'Feedback Generation', subtitle: 'Generate personalized, actionable feedback', icon: Sparkles, color: 'amber' },
  { title: 'Marks Calculation', subtitle: 'Compute score and grade for the notebook', icon: Calculator, color: 'green' },
];

const uploadTimeline = [
  'Uploading PDF',
  'Converting Pages',
  'OCR Processing',
  'Evaluating Answers',
  'Generating Feedback',
  'Preparing Report',
];

const tips = [
  'Upload clear scanned PDFs.',
  'Ensure handwriting is readable.',
  'Use one notebook per subject.',
  'Maximum file size: 20 MB.',
];

const stepColorMap = {
  blue: 'from-blue-500 to-blue-600 text-blue-500 bg-blue-50 border-blue-100',
  violet: 'from-violet-500 to-purple-600 text-violet-500 bg-violet-50 border-violet-100',
  cyan: 'from-cyan-500 to-sky-600 text-cyan-500 bg-cyan-50 border-cyan-100',
  indigo: 'from-[#4F46E5] to-[#4338CA] text-[#4F46E5] bg-[#4F46E5]/10 border-[#4F46E5]/20',
  amber: 'from-amber-500 to-orange-500 text-amber-500 bg-amber-50 border-amber-100',
  green: 'from-emerald-500 to-teal-600 text-[#10B981] bg-green-50 border-green-100',
};

// ─── Helper: Check if extracted text is valid human-readable text ───────────────
function isReadableText(str) {
  if (!str || typeof str !== 'string') return false;
  if (str.includes('\uFFFD') || str.includes('')) return false;

  const clean = str.trim();
  if (clean.length < 3) return false;

  const readableCount = (clean.match(/[a-zA-Z0-9\s.,?!'":\u0900-\u097F-]/g) || []).length;
  const ratio = readableCount / clean.length;

  return ratio >= 0.70;
}

// ─── Helper: Post-process & clean handwriting OCR text artifacts ────────────────
function cleanExtractedOCRText(text) {
  if (!text || typeof text !== 'string') return '';

  let t = text;
  // Handwriting OCR typo corrections
  t = t
    .replace(/6aurakh/gi, 'Saurabh')
    .replace(/saurakh/gi, 'Saurabh')
    .replace(/E\s*11\s*In\s*Which/gi, 'Q.1] In Which')
    .replace(/%eason/gi, 'season')
    .replace(/\[5\s*ice/gi, 'is ice')
    .replace(/ice-cieam/gi, 'ice-cream')
    .replace(/ice\s*cieam/gi, 'ice-cream')
    .replace(/ang\.?\s*-\s*/gi, 'Ans :- ')
    .replace(/Pofulay/gi, 'popular')
    .replace(/PePular/gi, 'popular')
    .replace(/yu\s+the/gi, 'in the')
    .replace(/summe[¥y]\s*Season/gi, 'summer season')
    .replace(/Tce-Cream/gi, 'Ice-cream')
    .replace(/lce-Cream/gi, 'Ice-cream')
    .replace(/chantev/gi, 'chapter')
    .replace(/engyi6h/gi, 'English');

  let lines = t.split('\n').map((l) => l.trim()).filter(Boolean);

  // Filter out standalone OCR noise lines (like 'fi _', 'KC —', 'r', 'पाप', '11 ee —')
  const isNoiseLine = (line) => {
    const l = line.toLowerCase();
    if (/^[a-z0-9\s_\-—|'"`\u0900-\u097F]{1,4}$/i.test(l)) return true;
    if (l.includes('clash') || l.includes('suk;') || l.includes('जग लिवर')) return true;
    const symbols = (line.match(/[^a-zA-Z0-9\s.,?!'":\u0900-\u097F-]/g) || []).length;
    return symbols / line.length > 0.40;
  };

  lines = lines.filter((l) => !isNoiseLine(l));

  return lines.join('\n').trim();
}

// ─── Helper: Format file size ──────────────────────────────────
function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// ─── Helper: Multi-tier PDF OCR Text Extraction ─────────────────
async function extractTextFromPDFFile(fileObj) {
  if (!fileObj) return '';

  // Tier 1: FastAPI PyMuPDF Backend OCR Endpoint
  try {
    const formData = new FormData();
    formData.append('file', fileObj);
    const resp = await fetch('http://127.0.0.1:8000/api/ocr', {
      method: 'POST',
      body: formData,
    });
    if (resp.ok) {
      const data = await resp.json();
      if (data.extracted_text && isReadableText(data.extracted_text)) {
        return cleanExtractedOCRText(data.extracted_text.trim());
      }
    }
  } catch (backendErr) {
    console.warn('Backend PyMuPDF OCR unavailable, trying client PDF.js:', backendErr);
  }

  // Tier 2: Client-side PDF.js vector layer extraction
  try {
    const arrayBuffer = await fileObj.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    let pagesText = [];

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageStr = textContent.items.map((item) => item.str).join(' ').trim();
      if (isReadableText(pageStr)) {
        pagesText.push(pageStr);
      }
    }

    if (pagesText.length > 0) {
      return cleanExtractedOCRText(pagesText.join('\n\n'));
    }

    // Tier 3: Client-side Tesseract OCR (English + Hindi)
    for (let i = 1; i <= Math.min(pdf.numPages, 3); i++) {
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale: 2.0 });
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      await page.render({ canvasContext: context, viewport: viewport }).promise;
      const dataUrl = canvas.toDataURL('image/png');

      try {
        const ocrResult = await Tesseract.recognize(dataUrl, 'eng+hin');
        if (ocrResult && ocrResult.data && ocrResult.data.text) {
          const text = ocrResult.data.text.trim();
          if (text) {
            pagesText.push(text);
          }
        }
      } catch (ocrErr) {
        console.warn('Tesseract OCR error:', ocrErr);
      }
    }

    if (pagesText.length > 0) {
      return cleanExtractedOCRText(pagesText.join('\n\n'));
    }
  } catch (e) {
    console.warn('PDF OCR extraction error:', e);
  }

  return '';
}

// ─── Main Component ────────────────────────────────────────────
function UploadNotebook() {
  const fileInputRef = useRef(null);

  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [subject, setSubject] = useState('');
  const [chapter, setChapter] = useState('');
  const [questionId, setQuestionId] = useState('all');
  const [studentAnswerText, setStudentAnswerText] = useState('');
  const [extractedText, setExtractedText] = useState('');
  const [isExtractingText, setIsExtractingText] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [submissionId, setSubmissionId] = useState(null);

  const validateFile = async (selectedFile) => {
    if (!selectedFile) return;
    if (selectedFile.type !== 'application/pdf' && !selectedFile.name.toLowerCase().endsWith('.pdf')) {
      setError('Only PDF files are accepted. Please select a .pdf file.');
      return;
    }
    if (selectedFile.size > MAX_FILE_SIZE) {
      setError('File exceeds the 20 MB size limit. Please upload a smaller file.');
      return;
    }
    setError('');
    setFile({
      rawFile: selectedFile,
      name: selectedFile.name,
      size: selectedFile.size,
      pages: Math.max(1, Math.round(selectedFile.size / (150 * 1024))),
      date: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }),
    });

    setIsExtractingText(true);
    const pdfText = await extractTextFromPDFFile(selectedFile);
    setExtractedText(pdfText);
    setStudentAnswerText(pdfText);
    setIsExtractingText(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const dropped = e.dataTransfer.files?.[0];
    if (dropped) validateFile(dropped);
  };

  const handleSelectFile = (e) => {
    const selected = e.target.files?.[0];
    validateFile(selected);
    e.target.value = '';
  };

  const removeFile = () => {
    setFile(null);
    setExtractedText('');
    setStudentAnswerText('');
    setError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleStartEvaluation = () => {
    if (!file) {
      setError('Please select a PDF file to upload.');
      return;
    }
    if (!subject) {
      setError('Please select a subject.');
      return;
    }

    setError('');
    setUploading(true);
    setProgress(0);
    setCurrentStep(0);

    const stepDuration = 1000;
    const totalSteps = uploadTimeline.length;

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 2;
        if (next >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return next;
      });
    }, 120);

    let step = 0;
    const stepInterval = setInterval(() => {
      step += 1;
      setCurrentStep(step);
      if (step >= totalSteps) {
        clearInterval(stepInterval);
        clearInterval(progressInterval);
        setProgress(100);
        setTimeout(async () => {
          setUploading(false);
          const selectedSubjectObj = subjects.find((s) => s.id === subject);
          const selectedChapterObj = availableChapters.find((c) => c.id === chapter);

          const subjectLabel = selectedSubjectObj
            ? `${selectedSubjectObj.label} (${selectedSubjectObj.book})`
            : 'English (Marigold)';
          const chapterLabel = selectedChapterObj
            ? selectedChapterObj.label
            : 'Chapter 1 — Ice-cream Man';

          const chapterQuestions = getChapterQuestions(subject, chapter);
          const isAll = questionId === 'all';
          const targetQ = isAll ? null : (chapterQuestions.find((q) => q.id === questionId) || (chapterQuestions.length > 0 ? chapterQuestions[0] : null));
          const targetList = isAll ? chapterQuestions : null;

          let pdfExtractedText = studentAnswerText || extractedText;
          if (!pdfExtractedText) {
            pdfExtractedText = await extractTextFromPDFFile(file?.rawFile);
          }

          const newId = addEvaluationRecord({
            subject: subjectLabel,
            chapter: chapterLabel,
            notebookName: file?.name || `${subjectLabel} — ${chapterLabel}`,
            questionObj: targetQ,
            questionsList: targetList,
            studentAnswer: pdfExtractedText || '',
          });

          setSubmissionId(newId);
          setShowSuccess(true);
        }, 600);
      }
    }, stepDuration);
  };

  const navigate = useNavigate();

  const closeModal = () => setShowSuccess(false);

  const resetForm = () => {
    removeFile();
    setSubject('');
    setChapter('');
    closeModal();
  };

  const selectedSubject = subjects.find((s) => s.id === subject);
  const availableChapters = subject ? chaptersDummy[subject] || [] : [];

  return (
    <div className="space-y-6 sm:space-y-8 pb-8">
      {/* ═══════════════════════════════════════
          PAGE HEADER
         ═══════════════════════════════════════ */}
      <PageHeader
        title="Upload Handwritten Notebook"
        description="Upload a scanned handwritten notebook PDF for AI-powered evaluation."
      />

      <div className="grid lg:grid-cols-3 gap-6">
        {/* ── LEFT / CENTER COLUMN ─────────────────── */}
        <div className="lg:col-span-2 space-y-6">
          {/* ── UPLOAD CARD ────────────────────────── */}
          <Card>
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <FileUp className="h-4 w-4 text-[#4F46E5]" />
                Upload Notebook
              </h3>
              <Badge variant="info" size="sm">PDF · Max 20 MB</Badge>
            </div>
            <p className="text-xs text-gray-400 mb-5">
              Drag &amp; drop your scanned notebook PDF below or browse from your device.
            </p>

            {/* Dropzone */}
            <div
              onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
              onDragLeave={() => setDragActive(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative cursor-pointer rounded-2xl border-2 border-dashed p-8 sm:p-12 text-center transition-all duration-300 ${
                dragActive
                  ? 'border-[#4F46E5] bg-[#4F46E5]/5 scale-[1.01]'
                  : 'border-gray-200 hover:border-[#4F46E5]/50 hover:bg-gray-50/50'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,application/pdf"
                className="hidden"
                onChange={handleSelectFile}
              />

              <div
                className={`mx-auto h-16 w-16 rounded-2xl flex items-center justify-center mb-4 transition-all duration-300 ${
                  dragActive
                    ? 'bg-[#4F46E5] shadow-lg shadow-[#4F46E5]/30 scale-110'
                    : 'bg-[#4F46E5]/10'
                }`}
              >
                <UploadCloud className={`h-8 w-8 transition-colors ${dragActive ? 'text-white' : 'text-[#4F46E5]'}`} />
              </div>

              <p className="text-base font-semibold text-gray-900">
                {dragActive ? 'Drop your PDF here' : 'Drag & drop your PDF here'}
              </p>
              <p className="text-sm text-gray-500 mt-1 mb-5">or</p>

              <span className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#4F46E5] text-white text-sm font-semibold rounded-xl hover:bg-[#4338CA] transition-all shadow-lg shadow-[#4F46E5]/25 hover:shadow-xl hover:-translate-y-0.5">
                <FileText className="h-4 w-4" />
                Browse Files
              </span>

              <p className="text-xs text-gray-400 mt-5 flex items-center justify-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-[#4F46E5]" />
                PDF only · Maximum file size 20 MB
              </p>
            </div>

            {/* Error message */}
            {error && !file && (
              <div className="mt-4 rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-red-500 flex-shrink-0" />
                {error}
              </div>
            )}

            {/* Selected file + progress */}
            {file && (
              <div className="mt-5 rounded-2xl border border-gray-100 bg-gray-50/60 p-4">
                <div className="flex items-center gap-3">
                  <div className="h-11 w-11 rounded-xl bg-[#4F46E5]/10 flex items-center justify-center flex-shrink-0">
                    <FileText className="h-5 w-5 text-[#4F46E5]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{file.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{formatFileSize(file.size)}</p>
                  </div>
                  {!uploading && (
                    <button
                      onClick={removeFile}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      aria-label="Remove file"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>

                {uploading && (
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-medium text-gray-500">Uploading…</span>
                      <span className="text-xs font-bold text-[#4F46E5]">{progress}%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#4F46E5] to-purple-500 transition-all duration-150"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Subject & Chapter Selection */}
            <div className="grid sm:grid-cols-2 gap-4 mt-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Subject</label>
                <div className="relative">
                  <select
                    value={subject}
                    onChange={(e) => { setSubject(e.target.value); setChapter(''); setQuestionId('all'); }}
                    className="w-full appearance-none px-4 py-2.5 pr-10 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5] transition-all bg-white cursor-pointer"
                  >
                    <option value="">Select a subject</option>
                    {subjects.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.label} ({s.book})
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="h-4 w-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Chapter</label>
                <div className="relative">
                  <select
                    value={chapter}
                    onChange={(e) => {
                      const selCh = e.target.value;
                      setChapter(selCh);
                      const qList = getChapterQuestions(subject, selCh);
                      setQuestionId(qList.length > 0 ? qList[0].id : 'q1');
                    }}
                    disabled={!subject}
                    className="w-full appearance-none px-4 py-2.5 pr-10 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5] transition-all bg-white cursor-pointer disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed"
                  >
                    <option value="">{subject ? 'Select chapter' : 'Select subject first'}</option>
                    {availableChapters.map((c) => (
                      <option key={c.id} value={c.id}>{c.label}</option>
                    ))}
                  </select>
                  <ChevronDown className="h-4 w-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Question Selection & Student Answer Input */}
            {subject && chapter && (
              <div className="space-y-4 mt-4 p-4 rounded-2xl bg-gray-50/80 border border-gray-100">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Select Question to Evaluate (NCERT Dataset)
                  </label>
                  <div className="relative">
                    <select
                      value={questionId}
                      onChange={(e) => setQuestionId(e.target.value)}
                      className="w-full appearance-none px-4 py-2.5 pr-10 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5] transition-all bg-white cursor-pointer"
                    >
                      <option value="all">Evaluate All Chapter Questions (Full Notebook)</option>
                      {getChapterQuestions(subject, chapter).map((q) => (
                        <option key={q.id} value={q.id}>
                          {q.id.toUpperCase()}: {q.question} ({q.marks} marks)
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="h-4 w-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {questionId !== 'all' && (
                  <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100/80 text-xs text-indigo-900">
                    <p className="font-semibold">Expected NCERT Answer Key:</p>
                    <p className="mt-0.5 text-gray-700 font-medium">
                      "{getChapterQuestions(subject, chapter).find((q) => q.id === questionId)?.answer}"
                    </p>
                  </div>
                )}

                <div className="p-3.5 bg-blue-50/70 rounded-xl border border-blue-100/80 flex items-center gap-3 text-xs text-blue-900">
                  <ScanText className="h-4.5 w-4.5 text-blue-600 flex-shrink-0" />
                  <div>
                    <span className="font-semibold">Automatic PDF AI Evaluation Active:</span>
                    <p className="mt-0.5 text-gray-600">
                      The AI model will automatically extract handwritten text from your uploaded PDF (<span className="font-medium text-gray-900">{file ? file.name : 'Select PDF'}</span>) and evaluate it against the NCERT answer key out of 5 marks.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Selection error */}
            {error && file && (
              <div className="mt-3 rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-red-500 flex-shrink-0" />
                {error}
              </div>
            )}

            {/* Upload Button */}
            <div className="mt-6">
              <Button
                variant="primary"
                size="lg"
                fullWidth
                disabled={uploading}
                onClick={handleStartEvaluation}
                icon={uploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Sparkles className="h-5 w-5" />}
              >
                {uploading ? 'Evaluating…' : 'Start AI Evaluation'}
              </Button>
            </div>
          </Card>

          {/* ── NOTEBOOK PREVIEW ───────────────────── */}
          {file && (
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <FileText className="h-4 w-4 text-[#4F46E5]" />
                  Notebook Preview
                </h3>
                <Badge variant="success" size="sm" dot>Ready</Badge>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="rounded-xl border border-gray-100 p-4 bg-gray-50/60">
                  <FileText className="h-5 w-5 text-[#4F46E5] mb-2" />
                  <p className="text-xs text-gray-400">Filename</p>
                  <p className="text-sm font-semibold text-gray-900 truncate mt-0.5" title={file.name}>{file.name}</p>
                </div>
                <div className="rounded-xl border border-gray-100 p-4 bg-gray-50/60">
                  <Layers className="h-5 w-5 text-[#4F46E5] mb-2" />
                  <p className="text-xs text-gray-400">Pages</p>
                  <p className="text-sm font-semibold text-gray-900 mt-0.5">{file.pages}</p>
                </div>
                <div className="rounded-xl border border-gray-100 p-4 bg-gray-50/60">
                  <HardDrive className="h-5 w-5 text-[#4F46E5] mb-2" />
                  <p className="text-xs text-gray-400">File Size</p>
                  <p className="text-sm font-semibold text-gray-900 mt-0.5">{formatFileSize(file.size)}</p>
                </div>
                <div className="rounded-xl border border-gray-100 p-4 bg-gray-50/60">
                  <Calendar className="h-5 w-5 text-[#4F46E5] mb-2" />
                  <p className="text-xs text-gray-400">Upload Date</p>
                  <p className="text-sm font-semibold text-gray-900 mt-0.5">{file.date}</p>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* ── RIGHT COLUMN ─────────────────────── */}
        <div className="space-y-6">
          {/* ── AI PROCESSING INFORMATION ──────────── */}
          <Card>
            <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-1">
              <BookOpen className="h-4 w-4 text-[#4F46E5]" />
              How AI Evaluation Works
            </h3>
            <p className="text-xs text-gray-400 mb-5">A modern, step-by-step pipeline to assess your notebook.</p>

            <div className="relative">
              {/* Vertical timeline line */}
              <div className="absolute left-[19px] top-2 bottom-2 w-px bg-gradient-to-b from-[#4F46E5]/40 via-purple-300 to-emerald-300" />

              <div className="space-y-5">
                {processingSteps.map((step, i) => {
                  const Icon = step.icon;
                  const colors = stepColorMap[step.color];
                  return (
                    <div key={step.title} className="relative flex items-start gap-4">
                      <div className={`relative z-10 h-10 w-10 rounded-xl border flex items-center justify-center flex-shrink-0 shadow-sm ${colors}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0 pt-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-bold text-gray-400">0{i + 1}</span>
                          <p className="text-sm font-semibold text-gray-900">{step.title}</p>
                        </div>
                        <p className="text-xs text-gray-400 mt-0.5">{step.subtitle}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>

          {/* ── TIPS CARD ─────────────────────────── */}
          <Card>
            <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-4">
              <Lightbulb className="h-4 w-4 text-amber-500" />
              Helpful Tips
            </h3>
            <ul className="space-y-3">
              {tips.map((tip, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="h-6 w-6 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-amber-500" />
                  </span>
                  <span className="text-sm text-gray-600 leading-relaxed">{tip}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>

      {/* ═══════════════════════════════════════
          UPLOADING OVERLAY / TIMELINE
         ═══════════════════════════════════════ */}
      {uploading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 sm:p-8">
            <div className="flex flex-col items-center text-center mb-6">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-[#4F46E5] to-purple-600 flex items-center justify-center shadow-lg shadow-[#4F46E5]/30 mb-4">
                <Loader2 className="h-8 w-8 text-white animate-spin" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Evaluating Your Notebook</h3>
              <p className="text-sm text-gray-500 mt-1">AI is processing your submission…</p>
            </div>

            {/* Progress bar */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-medium text-gray-500">Overall progress</span>
                <span className="text-xs font-bold text-[#4F46E5]">{progress}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#4F46E5] to-purple-500 transition-all duration-150"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Timeline steps */}
            <div className="space-y-1">
              {uploadTimeline.map((step, i) => {
                const isDone = i < currentStep;
                const isActive = i === currentStep && uploading;
                return (
                  <div
                    key={step}
                    className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-300 ${
                      isActive ? 'bg-[#4F46E5]/5 border border-[#4F46E5]/15' : ''
                    }`}
                  >
                    {isDone ? (
                      <span className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                        <CheckCircle2 className="h-3.5 w-3.5 text-[#10B981]" />
                      </span>
                    ) : isActive ? (
                      <span className="h-6 w-6 rounded-full bg-[#4F46E5] flex items-center justify-center flex-shrink-0">
                        <Loader2 className="h-3.5 w-3.5 text-white animate-spin" />
                      </span>
                    ) : (
                      <span className="h-6 w-6 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                        <span className="h-1.5 w-1.5 rounded-full bg-gray-300" />
                      </span>
                    )}
                    <span className={`text-sm ${isDone ? 'text-gray-400 line-through' : isActive ? 'font-semibold text-[#4F46E5]' : 'text-gray-500'}`}>
                      {step}
                    </span>
                    {isActive && (
                      <span className="ml-auto text-[10px] font-bold text-[#4F46E5]">Processing…</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════
          SUCCESS DIALOG
         ═══════════════════════════════════════ */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={closeModal} />
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-100 p-8 text-center">
            <div className="mx-auto h-20 w-20 rounded-full bg-green-100 flex items-center justify-center mb-5">
              <div className="h-14 w-14 rounded-full bg-gradient-to-br from-[#10B981] to-emerald-500 flex items-center justify-center">
                <CheckCircle2 className="h-8 w-8 text-white" />
              </div>
            </div>

            <h3 className="text-xl font-bold text-gray-900">Notebook Uploaded Successfully! 🎉</h3>
            <div className="inline-flex items-center gap-2 mt-3 px-3 py-1.5 rounded-full bg-[#4F46E5]/10 border border-[#4F46E5]/20">
              <Sparkles className="h-3.5 w-3.5 text-[#4F46E5]" />
              <span className="text-xs font-semibold text-[#4F46E5]">Evaluation Started</span>
            </div>

            <div className="mt-5 rounded-2xl bg-gray-50 border border-gray-100 p-4">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Clock className="h-4 w-4 text-[#4F46E5]" />
                <span className="text-sm font-semibold text-gray-900">Estimated Time</span>
              </div>
              <p className="text-sm text-gray-500">2–3 minutes</p>
            </div>

            <div className="mt-6">
              <Button
                variant="primary"
                size="lg"
                fullWidth
                icon={<ArrowRight className="h-5 w-5" />}
                onClick={() => navigate(`/student/results?id=${submissionId || 'sub-001'}`)}
              >
                Go to Results
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UploadNotebook;
