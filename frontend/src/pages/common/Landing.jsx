import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Scan,
  Brain,
  MessageSquareText,
  BarChart3,
  LayoutDashboard,
  ShieldCheck,
  ArrowRight,
  ChevronDown,
} from 'lucide-react';

const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.6, ease: 'easeOut' },
};

const stagger = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.5, ease: 'easeOut' },
};

const features = [
  {
    icon: Scan,
    title: 'OCR Recognition',
    description: 'Accurately digitize handwritten text from scanned notebook pages using state-of-the-art optical character recognition.',
    gradient: 'from-violet-500 to-purple-600',
  },
  {
    icon: Brain,
    title: 'AI Evaluation',
    description: 'Leverage large language models to evaluate answers, check correctness, and assess conceptual understanding.',
    gradient: 'from-blue-500 to-indigo-600',
  },
  {
    icon: MessageSquareText,
    title: 'Personalized Feedback',
    description: 'Generate tailored, constructive feedback for each student highlighting strengths and areas for improvement.',
    gradient: 'from-emerald-500 to-teal-600',
  },
  {
    icon: BarChart3,
    title: 'Performance Analytics',
    description: 'Track class-wide and individual progress over time with interactive charts and detailed performance metrics.',
    gradient: 'from-orange-500 to-amber-600',
  },
  {
    icon: LayoutDashboard,
    title: 'Teacher Dashboard',
    description: 'A unified dashboard for teachers to manage notebooks, review evaluations, and monitor student progress.',
    gradient: 'from-rose-500 to-pink-600',
  },
  {
    icon: ShieldCheck,
    title: 'Plagiarism Detection',
    description: 'Automatically flag potential plagiarism across submissions with intelligent text similarity analysis.',
    gradient: 'from-cyan-500 to-sky-600',
  },
];

const steps = [
  {
    step: 1,
    title: 'Upload Notebook',
    description: 'Scan or photograph handwritten notebook pages and upload them to the platform.',
    icon: '📤',
  },
  {
    step: 2,
    title: 'OCR Recognition',
    description: 'Our system digitizes handwriting using advanced TrOCR models for accurate text extraction.',
    icon: '🔍',
  },
  {
    step: 3,
    title: 'AI Evaluation',
    description: 'Flan-T5 models analyze answers against expected responses for intelligent grading.',
    icon: '🧠',
  },
  {
    step: 4,
    title: 'Feedback Generation',
    description: 'Personalized feedback is automatically generated for each student submission.',
    icon: '💬',
  },
  {
    step: 5,
    title: 'Teacher Dashboard',
    description: 'Teachers review results, track class performance, and access plagiarism reports.',
    icon: '📊',
  },
];

const benefits = [
  {
    role: '🎓 Student',
    title: 'Student Benefits',
    items: [
      'Instant feedback on handwritten assignments',
      'Track academic progress over time',
      'Understand strengths and improvement areas',
      'Learn at your own pace with AI guidance',
    ],
  },
  {
    role: '👨‍🏫 Teacher',
    title: 'Teacher Benefits',
    items: [
      'Automate grading of handwritten notebooks',
      'Monitor entire class performance at a glance',
      'Detect plagiarism across submissions',
      'Save hours of manual evaluation time',
    ],
  },
  {
    role: '🏫 School',
    title: 'School Benefits',
    items: [
      'Standardize assessment across departments',
      'Generate institutional performance reports',
      'Embrace digital transformation in education',
      'Reduce teacher workload and burnout',
    ],
  },
];

function Landing() {
  return (
    <>
      {/* ───── HERO SECTION ───── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#F8FAFC] via-white to-indigo-50/40">
        {/* Decorative blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#4F46E5]/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#10B981]/5 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 lg:pt-28 lg:pb-32">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left: Text */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#4F46E5]/5 border border-[#4F46E5]/10 rounded-full text-sm font-medium text-[#4F46E5] mb-6">
                <span className="h-2 w-2 rounded-full bg-[#4F46E5] animate-pulse" />
                AI-Powered Notebook Analysis
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-[1.1] tracking-tight">
                <span className="bg-gradient-to-r from-[#4F46E5] to-[#10B981] bg-clip-text text-transparent">
                  NotebookAI
                </span>
                <br />
                <span className="text-3xl sm:text-4xl lg:text-5xl">
                  Smart Handwritten Notebook<br />
                  Analysis & Automated Feedback
                </span>
              </h1>

              <p className="mt-6 text-lg text-gray-500 leading-relaxed max-w-xl">
                Transform the way handwritten notebooks are evaluated. 
                NotebookAI uses cutting-edge AI to digitize, analyze, and 
                provide personalized feedback on student submissions — 
                saving teachers hours while improving learning outcomes.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#4F46E5] text-white font-medium rounded-xl hover:bg-[#4338CA] transition-all shadow-lg shadow-[#4F46E5]/25 hover:shadow-xl hover:shadow-[#4F46E5]/30 hover:-translate-y-0.5"
                >
                  Get Started
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href="#features"
                  className="inline-flex items-center gap-2 px-6 py-3 border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all"
                >
                  Learn More
                  <ChevronDown className="h-4 w-4" />
                </a>
              </div>

              {/* Stats */}
              <div className="mt-12 flex items-center gap-8 sm:gap-12">
                <div>
                  <p className="text-2xl font-bold text-gray-900">98%</p>
                  <p className="text-sm text-gray-500">OCR Accuracy</p>
                </div>
                <div className="h-10 w-px bg-gray-200" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">10x</p>
                  <p className="text-sm text-gray-500">Faster Grading</p>
                </div>
                <div className="h-10 w-px bg-gray-200" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">100+</p>
                  <p className="text-sm text-gray-500">Schools Trust</p>
                </div>
              </div>
            </motion.div>

            {/* Right: Illustration */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut', delay: 0.2 }}
              className="relative"
            >
              <div className="relative bg-gradient-to-br from-[#4F46E5]/10 to-[#10B981]/10 rounded-3xl p-8 border border-[#4F46E5]/10 shadow-xl shadow-[#4F46E5]/5">
                <div className="aspect-[4/3] relative overflow-hidden rounded-2xl bg-white/50 backdrop-blur-sm border border-white/60 shadow-inner">
                  {/* Dashboard mockup */}
                  <div className="absolute inset-0 p-5 flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-red-400" />
                      <div className="h-3 w-3 rounded-full bg-yellow-400" />
                      <div className="h-3 w-3 rounded-full bg-green-400" />
                      <div className="ml-2 h-3 w-20 bg-gray-200 rounded" />
                    </div>
                    <div className="flex gap-3 flex-1">
                      <div className="w-1/3 bg-white rounded-xl border border-gray-100 p-3 flex flex-col gap-2 shadow-sm">
                        <div className="h-2 w-16 bg-gray-200 rounded" />
                        <div className="flex-1 bg-gradient-to-br from-[#4F46E5]/20 to-[#10B981]/20 rounded-lg" />
                        <div className="h-2 w-12 bg-gray-200 rounded" />
                        <div className="h-2 w-20 bg-gray-200 rounded" />
                      </div>
                      <div className="flex-1 bg-white rounded-xl border border-gray-100 p-3 flex flex-col gap-2 shadow-sm">
                        <div className="h-2 w-24 bg-gray-200 rounded" />
                        <div className="flex gap-1.5 flex-1 items-end">
                          {[40, 65, 50, 80, 45, 70, 90].map((h, i) => (
                            <div
                              key={i}
                              className="flex-1 rounded-t-md bg-gradient-to-t from-[#4F46E5]/50 to-[#10B981]/50"
                              style={{ height: `${h}%` }}
                            />
                          ))}
                        </div>
                        <div className="h-2 w-16 bg-gray-200 rounded" />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <div className="h-2 w-14 bg-green-100 rounded" />
                      <div className="h-2 w-14 bg-gray-100 rounded" />
                      <div className="h-2 w-14 bg-gray-100 rounded" />
                    </div>
                  </div>
                </div>
                {/* Floating badge */}
                <div className="absolute -bottom-3 -right-3 bg-white rounded-xl shadow-lg border border-gray-100 px-4 py-2.5 flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#4F46E5] to-[#10B981] flex items-center justify-center">
                    <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-900">AI Evaluation</p>
                    <p className="text-[10px] text-gray-500">Real-time feedback</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ───── FEATURES SECTION ───── */}
      <section id="features" className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center max-w-2xl mx-auto mb-16" {...fadeInUp}>
            <span className="text-sm font-semibold text-[#4F46E5] tracking-widest uppercase">Features</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-gray-900">
              Everything you need to transform notebook evaluation
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              From digitization to plagiarism detection — NotebookAI provides a complete workflow for modern classrooms.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: index * 0.08, ease: 'easeOut' }}
                whileHover={{ y: -6 }}
                className="group relative bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-xl hover:border-gray-200 transition-all duration-300"
              >
                <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-lg shadow-black/5 mb-5 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── HOW IT WORKS SECTION ───── */}
      <section className="py-20 lg:py-28 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center max-w-2xl mx-auto mb-16" {...fadeInUp}>
            <span className="text-sm font-semibold text-[#4F46E5] tracking-widest uppercase">How It Works</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-gray-900">
              From paper to insights in 5 simple steps
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              The entire workflow is automated — just upload and let AI do the rest.
            </p>
          </motion.div>

          <div className="relative">
            {/* Vertical connecting line */}
            <div className="absolute left-6 sm:left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#4F46E5]/30 via-[#10B981]/30 to-[#4F46E5]/30 hidden md:block" />

            <div className="space-y-8 md:space-y-0 relative">
              {steps.map((step, index) => (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.5, delay: index * 0.1, ease: 'easeOut' }}
                  className={`md:flex items-center gap-8 ${
                    index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  } ${index !== steps.length - 1 ? 'md:mb-16' : ''}`}
                >
                  {/* Step content */}
                  <div className="flex-1">
                    <div className={`bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow ${
                      index % 2 === 0 ? 'md:mr-8' : 'md:ml-8'
                    }`}>
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-br from-[#4F46E5] to-[#10B981] flex items-center justify-center text-white font-bold text-sm shadow-md">
                          {step.step}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-1">
                            <span className="text-xl">{step.icon}</span>
                            <h3 className="text-lg font-semibold text-gray-900">{step.title}</h3>
                          </div>
                          <p className="text-sm text-gray-500">{step.description}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Arrow indicator (desktop) */}
                  <div className="hidden md:flex items-center justify-center flex-shrink-0 relative z-10">
                    <div className="h-12 w-12 rounded-full bg-white border-2 border-[#4F46E5]/20 flex items-center justify-center shadow-md">
                      <ChevronDown className="h-5 w-5 text-[#4F46E5]" />
                    </div>
                  </div>

                  {/* Placeholder for alignment on alternating rows */}
                  <div className="hidden md:block flex-1" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ───── BENEFITS SECTION ───── */}
      <section className="py-20 lg:py-28 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center max-w-2xl mx-auto mb-16" {...fadeInUp}>
            <span className="text-sm font-semibold text-[#4F46E5] tracking-widest uppercase">Benefits</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-gray-900">
              Who benefits from NotebookAI?
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              Designed for the entire educational ecosystem — students, teachers, and institutions.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: index * 0.1, ease: 'easeOut' }}
                whileHover={{ y: -4 }}
                className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-xl transition-all duration-300"
              >
                <div className="text-3xl mb-4">{benefit.role}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{benefit.title}</h3>
                <ul className="space-y-3">
                  {benefit.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                      <svg className="h-5 w-5 flex-shrink-0 text-[#10B981] mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── CALL TO ACTION ───── */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="relative overflow-hidden bg-gradient-to-br from-[#4F46E5] to-[#4338CA] rounded-3xl p-8 sm:p-12 lg:p-16 text-center shadow-2xl shadow-[#4F46E5]/25"
          >
            {/* Decorative circles */}
            <div className="absolute -top-20 -right-20 w-60 h-60 bg-white/5 rounded-full blur-2xl" />
            <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-white/5 rounded-full blur-2xl" />

            <div className="relative">
              <h2 className="text-3xl sm:text-4xl font-bold text-white leading-tight">
                Ready to experience AI-powered<br />
                notebook evaluation?
              </h2>
              <p className="mt-4 text-indigo-200 text-lg max-w-xl mx-auto">
                Join hundreds of schools already using NotebookAI to transform their grading workflow.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-[#4F46E5] font-semibold rounded-xl hover:bg-indigo-50 transition-all shadow-lg shadow-black/10 hover:shadow-xl hover:-translate-y-0.5"
                >
                  Get Started Free
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href="#features"
                  className="inline-flex items-center gap-2 px-8 py-3.5 border border-white/30 text-white font-medium rounded-xl hover:bg-white/10 transition-all"
                >
                  View Features
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}

export default Landing;

