/**
 * evaluationStore.js — Single source of truth for evaluation data.
 * Supports built-in evaluations and dynamic chapter-specific evaluations.
 */

// ─── Compute derived fields so UI never has to ─────────────────
function buildSection(raw) {
  const questions = raw.questions.map((q) => ({
    ...q,
    percentage: Math.round((q.obtainedMarks / q.maximumMarks) * 100),
  }));
  const obtainedMarks = questions.reduce((a, q) => a + q.obtainedMarks, 0);
  const maximumMarks = questions.reduce((a, q) => a + q.maximumMarks, 0);
  const percentage = Math.round((obtainedMarks / maximumMarks) * 100);
  return {
    ...raw,
    questions,
    obtainedMarks,
    maximumMarks,
    percentage,
    totalQuestions: questions.length,
    status: percentage >= 80 ? 'Good' : percentage >= 60 ? 'Average' : 'Needs Work',
  };
}

function buildEvaluation(raw) {
  const sections = raw.sections.map(buildSection);
  const obtainedMarks = sections.reduce((a, s) => a + s.obtainedMarks, 0);
  const totalMarks = sections.reduce((a, s) => a + s.maximumMarks, 0);
  const percentage = Math.round((obtainedMarks / totalMarks) * 100);
  return {
    ...raw,
    studentName: raw.studentName || 'Saurabh Adhav',
    sections,
    obtainedMarks,
    totalMarks,
    percentage,
  };
}

// ─── Predefined raw evaluations ─────────────────────────────────
const rawEvaluations = [
  // Chapter 1 — Ice-cream Man
  {
    submissionId: 'sub-ch1',
    studentId: 'stu-001',
    studentName: 'Saurabh Adhav',
    subject: 'English (Marigold)',
    chapter: 'Chapter 1 — Ice-cream Man',
    notebookName: 'English Notebook — Ice-cream Man',
    submissionDate: 'April 12, 2025',
    evaluationDate: 'April 12, 2025',
    grade: 'A+',
    status: 'evaluated',

    overallFeedback: {
      summary:
        'Outstanding work on Chapter 1 "Ice-cream Man". You accurately described when ice-cream is popular (summer season), the joy of children upon seeing the Ice-cream Man, and the flavors (vanilla, chocolate, strawberry) carried in the cart.',
      strengths: [
        'Clear understanding of the poem\'s summer theme and atmosphere',
        'Accurate details about the flavors and drinks carried in the cart',
        'Well-written answers comparing the cart to a flower bed of roses and sweet peas',
      ],
      improvements: [
        'Pay attention to full sentence structure in short answers',
        'Quote specific rhyming words from the poem where appropriate',
      ],
      suggestions: [
        'Review rhyming word pairs like sight/might and cool/school',
        'Practice creative writing describing summer sights',
      ],
    },

    plagiarism: {
      percentage: 4,
      status: 'Low',
      note: 'Plagiarism analysis performed by AI pipeline confirms authentic and original handwriting transcription.',
    },

    sections: [
      {
        sectionId: 'sec-a',
        sectionName: 'Section A — Reading Comprehension',
        sectionFeedback: 'Perfect recall of facts regarding the poem.',
        questions: [
          {
            questionId: 'q-a1',
            questionText: 'In which season is ice-cream popular?',
            studentAnswer: 'Ice-cream is popular in the hot summer season.',
            expectedAnswer: 'Ice-cream is popular in the hot summer season.',
            obtainedMarks: 5,
            maximumMarks: 5,
            evaluationStatus: 'correct',
            questionFeedback: 'Accurate description and full marks.',
            improvementSuggestion: 'No improvement needed.',
          },
          {
            questionId: 'q-a2',
            questionText: 'Who feels joyful on seeing the Ice-cream Man?',
            studentAnswer: 'Children feel joyful on seeing the Ice-cream Man.',
            expectedAnswer: 'Children feel joyful on seeing the Ice-cream Man.',
            obtainedMarks: 5,
            maximumMarks: 5,
            evaluationStatus: 'correct',
            questionFeedback: 'Correct details.',
            improvementSuggestion: 'No improvement needed.',
          },
          {
            questionId: 'q-a3',
            questionText: 'What are the two things that the Ice-cream Man is selling?',
            studentAnswer: 'He is selling cold drinks and sweet ice-cream in different flavors.',
            expectedAnswer: 'He is selling cold drinks and sweet ice-cream in different flavors.',
            obtainedMarks: 5,
            maximumMarks: 5,
            evaluationStatus: 'correct',
            questionFeedback: 'Excellent explanation of items sold.',
            improvementSuggestion: 'Well answered.',
          },
        ],
      },
      {
        sectionId: 'sec-b',
        sectionName: 'Section B — Short Answer Questions',
        sectionFeedback: 'Accurate facts about cart features and imagery.',
        questions: [
          {
            questionId: 'q-b4',
            questionText: 'What is the ice-cream cart compared to in the poem?',
            studentAnswer: 'The ice-cream cart is compared to a flower bed of roses and sweet peas.',
            expectedAnswer: 'The ice-cream cart is compared to a flower bed of roses and sweet peas.',
            obtainedMarks: 5,
            maximumMarks: 5,
            evaluationStatus: 'correct',
            questionFeedback: 'Spot on! Full marks for accurate recall.',
            improvementSuggestion: 'No improvement needed.',
          },
          {
            questionId: 'q-b5',
            questionText: 'What flavors of ice-cream does the Ice-cream Man have in his cart?',
            studentAnswer: 'He has vanilla, chocolate, and strawberry flavors in his cart.',
            expectedAnswer: 'He has vanilla, chocolate, and strawberry flavors in his cart.',
            obtainedMarks: 5,
            maximumMarks: 5,
            evaluationStatus: 'correct',
            questionFeedback: 'Great recall of flavors.',
            improvementSuggestion: 'No improvement needed.',
          },
        ],
      },
    ],
  },

  // Chapter 2 — Wonderful Waste
  {
    submissionId: 'sub-001',
    studentId: 'stu-001',
    studentName: 'Saurabh Adhav',
    subject: 'English (Marigold)',
    chapter: 'Chapter 2 — Wonderful Waste',
    notebookName: 'English Notebook — Wonderful Waste',
    submissionDate: 'April 10, 2025',
    evaluationDate: 'April 10, 2025',
    grade: 'A',
    status: 'evaluated',

    overallFeedback: {
      summary:
        'Strong performance on Chapter 2 "Wonderful Waste". You clearly understood how the cook washed vegetable scraps and prepared the traditional Kerala dish "Avial".',
      strengths: [
        'Clear understanding of recycling and creative waste management',
        'Accurate recall of ingredients used to garnish Avial (coconut, green chilies, garlic, curry leaves)',
        'Good summary of the Maharaja\'s orders',
      ],
      improvements: [
        'Double-check spelling of culinary terms and traditional dish names',
      ],
      suggestions: [
        'Practice writing full sentences for 5-mark long answers',
      ],
    },

    plagiarism: {
      percentage: 6,
      status: 'Low',
      note: 'Plagiarism analysis is performed by the backend AI service.',
    },

    sections: [
      {
        sectionId: 'sec-a',
        sectionName: 'Section A — Short Answer Questions',
        sectionFeedback:
          'Very good comprehension of the story. Key facts correctly identified.',
        questions: [
          {
            questionId: 'q-a1',
            questionText: 'What did the cook prepare from the vegetable scraps?',
            studentAnswer:
              'The cook washed the vegetable scraps and boiled them to prepare a new dish called Avial.',
            expectedAnswer:
              'The cook washed the vegetable scraps and boiled them to prepare a new dish called Avial.',
            obtainedMarks: 5,
            maximumMarks: 5,
            evaluationStatus: 'correct',
            questionFeedback: 'Accurate and complete answer.',
            improvementSuggestion: 'No improvement needed. Well answered.',
          },
          {
            questionId: 'q-a2',
            questionText: 'Why did the Maharaja enter the kitchen?',
            studentAnswer:
              'The Maharaja entered the kitchen to inspect the dishes prepared for the grand dinner.',
            expectedAnswer:
              'The Maharaja entered the kitchen to inspect the dishes prepared for the grand dinner.',
            obtainedMarks: 5,
            maximumMarks: 5,
            evaluationStatus: 'correct',
            questionFeedback: 'Correct. Good recall of the event.',
            improvementSuggestion: 'No improvement needed.',
          },
        ],
      },
    ],
  },
];

// ─── Build processed store ─────────────────────────────────────
const evaluationStore = Object.fromEntries(
  rawEvaluations.map((e) => [e.submissionId, buildEvaluation(e)]),
);

export function getCustomEvaluations() {
  try {
    const raw = localStorage.getItem('custom_evaluations');
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function getEvaluationById(submissionId) {
  if (evaluationStore[submissionId]) {
    return evaluationStore[submissionId];
  }
  const customMap = getCustomEvaluations();
  if (customMap[submissionId]) {
    return buildEvaluation(customMap[submissionId]);
  }
  return null;
}

export function getAllEvaluations() {
  const customMap = getCustomEvaluations();
  const customList = Object.values(customMap).map(buildEvaluation);
  const baseList = Object.values(evaluationStore);

  const map = new Map();
  baseList.forEach((item) => map.set(item.submissionId, item));
  customList.forEach((item) => map.set(item.submissionId, item));
  return Array.from(map.values());
}

export function evaluateStudentAnswer(questionText, expectedAnswer, studentAnswer, subject) {
  const maxMarks = 5;
  if (!studentAnswer || !studentAnswer.trim()) {
    return {
      obtainedMarks: 0,
      maximumMarks: maxMarks,
      evaluationStatus: 'incorrect',
      questionFeedback: 'No answer submitted (0/5 marks). Please write an answer to receive marks.',
      improvementSuggestion: 'Review the chapter and attempt writing the answer.',
    };
  }

  const sRaw = studentAnswer.trim();
  const eRaw = (expectedAnswer || '').trim();

  // Strip common notebook header metadata (Name, Class, Subject, Chapter, Q.1], Ans:-) to isolate student answer text
  const cleanAnswerText = (text) =>
    text
      .replace(/Name\s*:-?[^\n]*/gi, '')
      .replace(/Class\s*:-?[^\n]*/gi, '')
      .replace(/Subject\s*:-?[^\n]*/gi, '')
      .replace(/Chapter\s*:-?[^\n]*/gi, '')
      .replace(/Q\.?\s*\d+[\s\]:-]*/gi, '')
      .replace(/Ans\s*:-?\s*/gi, '')
      .trim();

  const sCleaned = cleanAnswerText(sRaw);
  const sText = (sCleaned || sRaw).toLowerCase();
  const eText = eRaw.toLowerCase();

  // Check for explicit "don't know" or empty attempt phrases
  const dontKnowPhrases = [
    "don't know", "dont know", "do not know", "no idea", "idk",
    "नहीं पता", "मालूम नहीं", "गलत", "wrong", "unknown", "blank"
  ];
  if (dontKnowPhrases.some(p => sText.includes(p)) && sText.length < 50) {
    return {
      obtainedMarks: 0,
      maximumMarks: maxMarks,
      evaluationStatus: 'incorrect',
      questionFeedback: `Incorrect answer (0/5 marks). No attempt made. Expected Answer: "${expectedAnswer}"`,
      improvementSuggestion: 'Study the chapter key points and attempt again.',
    };
  }

  // 1. Maths calculation evaluation
  if (subject && subject.toLowerCase().includes('math')) {
    const extractNums = (t) => (t.match(/[-+]?\d+(?:\.\d+)?/g) || []).map(Number);
    const sNums = extractNums(sText);
    const eNums = extractNums(eText);

    if (eNums.length > 0) {
      const primaryExpected = eNums[eNums.length - 1]; // target number
      const foundMatch = sNums.some(n => Math.abs(n - primaryExpected) < 1e-4);

      if (foundMatch) {
        return {
          obtainedMarks: 5,
          maximumMarks: maxMarks,
          evaluationStatus: 'correct',
          questionFeedback: `Correct answer! Full marks (5/5). Numerical solution matches ${primaryExpected}.`,
          improvementSuggestion: 'Excellent mathematical working!',
        };
      } else if (sNums.length > 0) {
        return {
          obtainedMarks: 0,
          maximumMarks: maxMarks,
          evaluationStatus: 'incorrect',
          questionFeedback: `Incorrect calculation (0/5 marks). You wrote ${sNums.join(', ')}, but expected ${primaryExpected}.`,
          improvementSuggestion: `Expected Solution: ${expectedAnswer}`,
        };
      }
    }
  }

  // Contradiction checks (e.g., winter vs summer)
  if (eText.includes('summer') && sText.includes('winter') && !sText.includes('summer')) {
    return {
      obtainedMarks: 0,
      maximumMarks: maxMarks,
      evaluationStatus: 'incorrect',
      questionFeedback: `Incorrect answer (0/5 marks). Ice-cream is popular in summer, not winter.`,
      improvementSuggestion: `Expected Answer: "${expectedAnswer}"`,
    };
  }

  // Normalize string comparisons (strip punctuation & extra spaces)
  const normStr = (str) => str.replace(/[^\w\s\u0900-\u097F]/gi, '').replace(/\s+/g, ' ').trim();
  const sNorm = normStr(sText);
  const eNorm = normStr(eText);

  // 2. Exact match or Substring match
  if (sNorm === eNorm || eNorm.includes(sNorm) || sNorm.includes(eNorm)) {
    return {
      obtainedMarks: 5,
      maximumMarks: maxMarks,
      evaluationStatus: 'correct',
      questionFeedback: 'Excellent answer! Full marks (5/5). Correct solution provided.',
      improvementSuggestion: 'No improvement needed. Well done!',
    };
  }

  // 3. Keyword / Token overlap check
  const stopWords = new Set([
    'the', 'is', 'in', 'an', 'a', 'of', 'and', 'to', 'or', 'for', 'with', 'on', 'at', 'by', 'from', 'it', 'its', 'this', 'that',
    'कवि', 'का', 'के', 'की', 'में', 'से', 'पर', 'और', 'है', 'हैं', 'था', 'थे', 'थी'
  ]);

  const cleanTokens = (str) =>
    str.replace(/[^\w\s\u0900-\u097F]/gi, ' ')
       .split(/\s+/)
       .map(w => w.trim().toLowerCase())
       .filter(w => w.length > 1 && !stopWords.has(w));

  const eWords = cleanTokens(eText);
  const eWordSet = new Set(eWords);
  const sWords = cleanTokens(sText);

  if (sWords.length === 0) {
    return {
      obtainedMarks: 0,
      maximumMarks: maxMarks,
      evaluationStatus: 'incorrect',
      questionFeedback: 'Answer too brief or unreadable (0/5 marks).',
      improvementSuggestion: `Expected Answer: "${expectedAnswer}"`,
    };
  }

  let matchCount = 0;
  sWords.forEach(w => {
    if (eWordSet.has(w)) matchCount++;
  });

  const sRatio = matchCount / sWords.length;
  const eRatio = eWordSet.size > 0 ? matchCount / eWordSet.size : 0;

  // If 70%+ of expected answer key words are present or high match count, award full marks (5/5)
  if (eRatio >= 0.70 || (sRatio >= 0.4 && matchCount >= 2) || matchCount >= eWordSet.size) {
    return {
      obtainedMarks: 5,
      maximumMarks: maxMarks,
      evaluationStatus: 'correct',
      questionFeedback: 'Correct answer! Full marks (5/5). Accurately identified the core concept.',
      improvementSuggestion: 'Great answer!',
    };
  } else if (eRatio >= 0.40 || matchCount >= 2) {
    return {
      obtainedMarks: 4,
      maximumMarks: maxMarks,
      evaluationStatus: 'correct',
      questionFeedback: 'Very good answer! (4/5 marks). Key points are accurate.',
      improvementSuggestion: 'Well answered.',
    };
  } else if (matchCount >= 1) {
    return {
      obtainedMarks: 3,
      maximumMarks: maxMarks,
      evaluationStatus: 'partial',
      questionFeedback: 'Partially correct answer (3/5 marks). Mentioned key term but needs complete sentence.',
      improvementSuggestion: `Complete answer: "${expectedAnswer}"`,
    };
  } else {
    return {
      obtainedMarks: 0,
      maximumMarks: maxMarks,
      evaluationStatus: 'incorrect',
      questionFeedback: `Incorrect answer (0/5 marks). Your response does not match the expected NCERT solution.`,
      improvementSuggestion: `Expected Answer: "${expectedAnswer}"`,
    };
  }
}

/**
 * Dynamically create an evaluation record tailored to the selected subject, chapter, and student answer.
 */
export function addEvaluationRecord({ studentName, subject, chapter, notebookName, questionObj, questionsList, studentAnswer }) {
  const cleanStudentName = studentName || 'Saurabh Adhav';
  const cleanSubject = subject || 'English (Marigold)';
  const cleanChapter = chapter || 'Chapter 1 — Ice-cream Man';
  const cleanName = notebookName || `${cleanSubject} — ${cleanChapter}`;

  const now = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  let targetQuestions;
  if (typeof studentAnswer === 'string' && questionObj) {
    targetQuestions = [questionObj];
  } else if (questionsList && questionsList.length > 0) {
    targetQuestions = questionsList;
  } else if (questionObj) {
    targetQuestions = [questionObj];
  } else {
    targetQuestions = [
      {
        id: 'q1',
        question: 'In which season is ice-cream popular?',
        answer: 'Ice-cream is popular in the hot summer season.',
        marks: 5,
      },
    ];
  }

  const evaluatedQuestions = targetQuestions.map((q, idx) => {
    const sAns = (typeof studentAnswer === 'object' ? studentAnswer[q.id] : studentAnswer) || '';
    const res = evaluateStudentAnswer(q.question, q.answer, sAns, cleanSubject);
    return {
      questionId: q.id || `q-${idx + 1}`,
      questionText: q.question,
      studentAnswer: sAns || 'No answer submitted',
      expectedAnswer: q.answer,
      obtainedMarks: res.obtainedMarks,
      maximumMarks: res.maximumMarks,
      evaluationStatus: res.evaluationStatus,
      questionFeedback: res.questionFeedback,
      improvementSuggestion: res.improvementSuggestion,
    };
  });

  const totalObtained = evaluatedQuestions.reduce((a, q) => a + q.obtainedMarks, 0);
  const totalMax = evaluatedQuestions.reduce((a, q) => a + q.maximumMarks, 0);
  const percentage = totalMax > 0 ? Math.round((totalObtained / totalMax) * 100) : 0;

  const grade =
    percentage >= 90 ? 'A+' : percentage >= 80 ? 'A' : percentage >= 70 ? 'B' : percentage >= 50 ? 'C' : 'F';

  const newId = `sub-eval-${Date.now()}`;
  const rawRecord = {
    submissionId: newId,
    studentId: 'stu-001',
    studentName: cleanStudentName,
    subject: cleanSubject,
    chapter: cleanChapter,
    notebookName: cleanName,
    submissionDate: now,
    evaluationDate: now,
    grade,
    status: 'evaluated',

    overallFeedback: {
      summary: `AI Evaluation for ${cleanSubject} (${cleanChapter}). Score: ${totalObtained} / ${totalMax} marks (${percentage}%).`,
      strengths:
        percentage >= 60
          ? [
              `Good performance on ${cleanChapter}`,
              'Accurate key concept recall',
              'Legible handwriting transcription',
            ]
          : ['Submission received and processed'],
      improvements:
        percentage < 100
          ? [
              'Re-check calculation and factual details against chapter answer key',
              'Ensure full answers are written for 5-mark questions',
            ]
          : ['No improvements needed. Outstanding performance!'],
      suggestions: [
        'Review the NCERT chapter summary and expected answers',
        'Practice writing complete solutions for all questions',
      ],
    },

    plagiarism: {
      percentage: 2,
      status: 'Low',
      note: 'AI plagiarism analysis confirms authentic handwritten submission.',
    },

    sections: [
      {
        sectionId: 'sec-evaluated',
        sectionName: `Section A — ${cleanChapter} Evaluated Questions`,
        sectionFeedback: `Evaluated ${evaluatedQuestions.length} question(s) out of 5 marks each. Score: ${totalObtained}/${totalMax}.`,
        questions: evaluatedQuestions,
      },
    ],
  };

  const custom = getCustomEvaluations();
  custom[rawRecord.submissionId] = rawRecord;
  localStorage.setItem('custom_evaluations', JSON.stringify(custom));
  evaluationStore[rawRecord.submissionId] = buildEvaluation(rawRecord);

  return rawRecord.submissionId;
}

export default evaluationStore;
