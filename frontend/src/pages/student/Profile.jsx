import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Mail,
  Phone,
  Building2,
  GraduationCap,
  BadgeCheck,
  Edit3,
  Lock,
  Bell,
  LogOut,
  Save,
  X,
  BookOpen,
  Award,
  TrendingUp,
  BarChart3,
  ChevronRight,
  Upload,
  ShieldCheck,
} from 'lucide-react';

import { Card, Badge, Button, PageHeader, Modal } from '../../components/common';
import { StatCard } from '../../components/cards';
import { AuthContext } from '../../context/AuthContext';
import { getAllEvaluations } from '../../data/evaluationStore';

// ─── Mock profile data ──────────────────────────────────────────
// TODO: Replace with → GET /api/students/me
const INITIAL_PROFILE = {
  firstName: 'Alex',
  lastName: 'Morgan',
  email: 'alex.morgan@student.edu',
  studentId: 'STU-2025-0042',
  classGrade: 'Grade 8 — Section A',
  institution: 'Greenwood International School',
  phone: '+91 98765 43210',
  role: 'Student',
  joinedDate: 'January 2025',
  avatarInitials: 'AM',
  avatarGradient: 'from-[#4F46E5] to-[#4338CA]',
};

// ─── Derive academic stats from evaluation store ────────────────
function computeAcademicStats(evaluations) {
  const evaluated = evaluations.filter((e) => e.status === 'evaluated');
  if (!evaluated.length) return { avg: 0, total: 0, best: 0, progress: 0 };
  const avg = Math.round(evaluated.reduce((a, e) => a + e.percentage, 0) / evaluated.length);
  const best = Math.max(...evaluated.map((e) => e.percentage));
  const sorted = [...evaluated].sort(
    (a, b) => new Date(a.submissionDate) - new Date(b.submissionDate),
  );
  const progress =
    sorted.length >= 2 ? sorted[sorted.length - 1].percentage - sorted[0].percentage : 0;
  return { avg, total: evaluated.length, best, progress };
}

// ─── Info row used inside Personal Information card ────────────
function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-gray-50 last:border-0">
      <div className="h-8 w-8 rounded-lg bg-[#4F46E5]/8 flex items-center justify-center flex-shrink-0 mt-0.5">
        <Icon className="h-4 w-4 text-[#4F46E5]" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">{label}</p>
        <p className="text-sm font-semibold text-gray-900 mt-0.5 break-words">{value}</p>
      </div>
    </div>
  );
}

// ─── Settings action row ────────────────────────────────────────
function SettingsRow({ icon: Icon, label, description, iconBg, onClick, danger = false }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all text-left group
        ${danger
          ? 'border-red-100 hover:bg-red-50 hover:border-red-200'
          : 'border-gray-100 hover:bg-gray-50 hover:border-gray-200'
        }`}
    >
      <div className={`h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0 ${iconBg}`}>
        <Icon className={`h-5 w-5 ${danger ? 'text-red-600' : 'text-[#4F46E5]'}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-semibold ${danger ? 'text-red-600' : 'text-gray-900'}`}>{label}</p>
        {description && <p className="text-xs text-gray-400 mt-0.5">{description}</p>}
      </div>
      <ChevronRight className={`h-4 w-4 flex-shrink-0 transition-transform group-hover:translate-x-0.5
        ${danger ? 'text-red-300' : 'text-gray-300 group-hover:text-[#4F46E5]'}`}
      />
    </button>
  );
}

// ─── Edit Profile Modal ─────────────────────────────────────────
function EditProfileModal({ isOpen, onClose, profile, onSave }) {
  const [form, setForm] = useState({ ...profile });

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSave(form);
    onClose();
  }

  const fields = [
    { name: 'firstName', label: 'First Name', type: 'text' },
    { name: 'lastName', label: 'Last Name', type: 'text' },
    { name: 'email', label: 'Email Address', type: 'email' },
    { name: 'phone', label: 'Phone Number', type: 'tel' },
    { name: 'classGrade', label: 'Class / Grade', type: 'text' },
    { name: 'institution', label: 'Institution', type: 'text' },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Profile"
      description="Update your personal information below."
      size="lg"
      footer={
        <>
          <Button variant="outline" size="md" icon={<X className="h-4 w-4" />} onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="md"
            icon={<Save className="h-4 w-4" />}
            onClick={handleSubmit}
          >
            Save Changes
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {fields.map(({ name, label, type }) => (
            <div key={name}>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                {label}
              </label>
              <input
                type={type}
                name={name}
                value={form[name] ?? ''}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-sm text-gray-900 bg-white border border-gray-200 rounded-xl
                  focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/30 focus:border-[#4F46E5]
                  placeholder:text-gray-300 transition-all"
              />
            </div>
          ))}
        </div>
        {/* Read-only fields */}
        <div className="pt-2 border-t border-gray-100">
          <p className="text-xs text-gray-400 flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-gray-400" />
            Student ID and role cannot be changed. Contact your institution to update them.
          </p>
        </div>
      </form>
    </Modal>
  );
}

// ─── Change Password Modal (UI-only) ───────────────────────────
function ChangePasswordModal({ isOpen, onClose }) {
  const [form, setForm] = useState({ current: '', next: '', confirm: '' });
  const [saved, setSaved] = useState(false);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    // TODO: POST /api/auth/change-password
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      setForm({ current: '', next: '', confirm: '' });
      onClose();
    }, 1200);
  }

  const pwFields = [
    { name: 'current', label: 'Current Password' },
    { name: 'next', label: 'New Password' },
    { name: 'confirm', label: 'Confirm New Password' },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Change Password"
      description="Choose a strong password you haven't used before."
      size="md"
      footer={
        <>
          <Button variant="outline" size="md" onClick={onClose}>Cancel</Button>
          <Button
            variant="primary"
            size="md"
            icon={<Lock className="h-4 w-4" />}
            onClick={handleSubmit}
            loading={saved}
          >
            {saved ? 'Saved!' : 'Update Password'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {pwFields.map(({ name, label }) => (
          <div key={name}>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
              {label}
            </label>
            <input
              type="password"
              name={name}
              value={form[name]}
              onChange={handleChange}
              autoComplete="new-password"
              className="w-full px-3.5 py-2.5 text-sm text-gray-900 bg-white border border-gray-200 rounded-xl
                focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/30 focus:border-[#4F46E5] transition-all"
            />
          </div>
        ))}
        <p className="text-xs text-gray-400 pt-1">
          Password must be at least 8 characters and include a number.
        </p>
      </form>
    </Modal>
  );
}

// ─── Notification Preferences Modal (UI-only) ──────────────────
const NOTIF_OPTIONS = [
  { key: 'evaluation', label: 'Evaluation complete', description: 'When your notebook is evaluated' },
  { key: 'feedback', label: 'New AI feedback', description: 'When AI feedback is generated' },
  { key: 'performance', label: 'Performance updates', description: 'Weekly performance summary' },
  { key: 'reminders', label: 'Upload reminders', description: 'Reminders to submit notebooks' },
];

function NotificationsModal({ isOpen, onClose }) {
  const [prefs, setPrefs] = useState({ evaluation: true, feedback: true, performance: false, reminders: true });

  function toggle(key) {
    setPrefs((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Notification Preferences"
      description="Choose which notifications you want to receive."
      size="md"
      footer={
        <>
          <Button variant="outline" size="md" onClick={onClose}>Cancel</Button>
          <Button variant="primary" size="md" icon={<Save className="h-4 w-4" />} onClick={onClose}>
            Save Preferences
          </Button>
        </>
      }
    >
      {/* TODO: POST /api/students/me/notifications */}
      <div className="space-y-3">
        {NOTIF_OPTIONS.map(({ key, label, description }) => (
          <div
            key={key}
            className="flex items-center justify-between gap-4 p-3.5 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors"
          >
            <div>
              <p className="text-sm font-semibold text-gray-900">{label}</p>
              <p className="text-xs text-gray-400 mt-0.5">{description}</p>
            </div>
            <button
              onClick={() => toggle(key)}
              className={`relative h-6 w-11 rounded-full transition-colors flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/30
                ${prefs[key] ? 'bg-[#4F46E5]' : 'bg-gray-200'}`}
              role="switch"
              aria-checked={prefs[key]}
            >
              <span
                className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform
                  ${prefs[key] ? 'translate-x-5' : 'translate-x-0'}`}
              />
            </button>
          </div>
        ))}
      </div>
    </Modal>
  );
}

// ─── Main Component ────────────────────────────────────────────
function StudentProfile() {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  const nameParts = (user?.name || 'Student').trim().split(' ');
  const userFirstName = nameParts[0] || 'Student';
  const userLastName = nameParts.slice(1).join(' ') || '';
  const userInitials = (userFirstName[0] + (userLastName[0] || '')).toUpperCase();

  const [profile, setProfile] = useState(() => ({
    ...INITIAL_PROFILE,
    firstName: userFirstName,
    lastName: userLastName,
    email: user?.email || INITIAL_PROFILE.email,
    avatarInitials: userInitials,
  }));
  const [editOpen, setEditOpen] = useState(false);
  const [pwOpen, setPwOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  // Academic stats derived from the evaluation store
  const evaluations = getAllEvaluations();
  const stats = computeAcademicStats(evaluations);

  const academicCards = [
    {
      title: 'Overall Average',
      value: `${stats.avg}%`,
      icon: <BarChart3 className="h-5 w-5" />,
      bgGradient: 'purple',
      trend: stats.progress,
      trendLabel: 'since first submission',
    },
    {
      title: 'Notebooks Evaluated',
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
      title: 'Progress',
      value: `${stats.progress >= 0 ? '+' : ''}${stats.progress}%`,
      icon: <TrendingUp className="h-5 w-5" />,
      bgGradient: stats.progress >= 0 ? 'cyan' : 'orange',
      trendLabel: 'first → latest submission',
    },
  ];

  const personalFields = [
    { icon: User, label: 'Full Name', value: `${profile.firstName} ${profile.lastName}` },
    { icon: Mail, label: 'Email Address', value: profile.email },
    { icon: BadgeCheck, label: 'Student ID', value: profile.studentId },
    { icon: GraduationCap, label: 'Class / Grade', value: profile.classGrade },
    { icon: Building2, label: 'Institution', value: profile.institution },
    { icon: Phone, label: 'Phone Number', value: profile.phone },
  ];

  const settingsRows = [
    {
      icon: Edit3,
      label: 'Edit Profile',
      description: 'Update your name, email, and contact details',
      iconBg: 'bg-[#4F46E5]/8',
      onClick: () => setEditOpen(true),
    },
    {
      icon: Lock,
      label: 'Change Password',
      description: 'Update your account password',
      iconBg: 'bg-amber-50',
      onClick: () => setPwOpen(true),
    },
    {
      icon: Bell,
      label: 'Notification Preferences',
      description: 'Manage what alerts you receive',
      iconBg: 'bg-emerald-50',
      onClick: () => setNotifOpen(true),
    },
  ];

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <div className="space-y-6 sm:space-y-8 pb-8">
      {/* ── PAGE HEADER ── */}
      <PageHeader
        title="My Profile"
        description="Manage your personal information and account settings."
        breadcrumbs={[
          { label: 'Dashboard', path: '/student' },
          { label: 'Profile' },
        ]}
        actions={
          <Button
            variant="primary"
            size="sm"
            icon={<Edit3 className="h-4 w-4" />}
            onClick={() => setEditOpen(true)}
          >
            Edit Profile
          </Button>
        }
      />

      {/* ── PROFILE HERO CARD ── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#4F46E5] via-[#4338CA] to-[#3730A3] rounded-3xl p-6 sm:p-8 shadow-xl shadow-[#4F46E5]/20">
        {/* Decorative blobs */}
        <div className="absolute -top-20 -right-20 h-64 w-64 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-12 h-56 w-56 bg-white/5 rounded-full blur-3xl" />

        <div className="relative flex flex-col sm:flex-row sm:items-center gap-6">
          {/* Avatar */}
          <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-2xl bg-white/15 backdrop-blur-sm border-2 border-white/25 flex items-center justify-center flex-shrink-0 shadow-lg">
            <span className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {profile.avatarInitials}
            </span>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                {profile.firstName} {profile.lastName}
              </h2>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/15 border border-white/20 text-xs font-semibold text-white">
                <BadgeCheck className="h-3 w-3" />
                {profile.role}
              </span>
            </div>
            <p className="text-indigo-200 text-sm">{profile.email}</p>
            <p className="text-indigo-300 text-xs mt-1">
              {profile.institution} · Joined {profile.joinedDate}
            </p>
          </div>

          {/* CTA */}
          <div className="flex-shrink-0">
            <button
              onClick={() => setEditOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-[#4F46E5] font-semibold text-sm rounded-xl hover:bg-indigo-50 transition-all shadow-lg shadow-black/10 hover:-translate-y-0.5 active:scale-[0.97]"
            >
              <Edit3 className="h-4 w-4" />
              Edit Profile
            </button>
          </div>
        </div>
      </div>

      {/* ── ACADEMIC STATS ── */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-[#4F46E5]" />
          Academic Overview
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
          {academicCards.map((c) => (
            <StatCard key={c.title} {...c} />
          ))}
        </div>
      </div>

      {/* ── MAIN GRID: Personal Info + Settings ── */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Personal Information — 2 cols */}
        <div className="lg:col-span-2">
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <User className="h-4 w-4 text-[#4F46E5]" />
                Personal Information
              </h3>
              <button
                onClick={() => setEditOpen(true)}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-[#4F46E5] hover:text-[#4338CA] transition-colors"
              >
                <Edit3 className="h-3.5 w-3.5" />
                Edit
              </button>
            </div>
            <div className="divide-y divide-gray-50">
              {personalFields.map(({ icon, label, value }) => (
                <InfoRow key={label} icon={icon} label={label} value={value} />
              ))}
            </div>
          </Card>
        </div>

        {/* Account Settings — 1 col */}
        <div className="space-y-6">
          <Card>
            <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-4">
              <ShieldCheck className="h-4 w-4 text-[#4F46E5]" />
              Account Settings
            </h3>
            <div className="space-y-2">
              {settingsRows.map((row) => (
                <SettingsRow key={row.label} {...row} />
              ))}
              <SettingsRow
                icon={LogOut}
                label="Logout"
                description="Sign out of your account"
                iconBg="bg-red-50"
                onClick={handleLogout}
                danger
              />
            </div>
          </Card>

          {/* Quick links */}
          <Card>
            <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-4">
              <Upload className="h-4 w-4 text-[#4F46E5]" />
              Quick Links
            </h3>
            <div className="space-y-2">
              {[
                { label: 'Upload Notebook', path: '/student/upload', color: 'text-[#4F46E5]' },
                { label: 'View Results', path: '/student/results?id=sub-001', color: 'text-[#4F46E5]' },
                { label: 'Performance History', path: '/student/performance', color: 'text-[#4F46E5]' },
              ].map(({ label, path, color }) => (
                <button
                  key={label}
                  onClick={() => navigate(path)}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border border-gray-100 hover:bg-gray-50 hover:border-gray-200 transition-all group text-left"
                >
                  <span className={`text-sm font-medium ${color}`}>{label}</span>
                  <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-[#4F46E5] group-hover:translate-x-0.5 transition-all" />
                </button>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* ── MODALS ── */}
      <EditProfileModal
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        profile={profile}
        onSave={(updated) => setProfile((prev) => ({ ...prev, ...updated }))}
      />
      <ChangePasswordModal isOpen={pwOpen} onClose={() => setPwOpen(false)} />
      <NotificationsModal isOpen={notifOpen} onClose={() => setNotifOpen(false)} />
    </div>
  );
}

export default StudentProfile;
