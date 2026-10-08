import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Mail,
  Phone,
  Building2,
  GraduationCap,
  BadgeCheck,
  Bell,
  Lock,
  Sun,
  LogOut,
  Save,
  ShieldCheck,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff,
  Monitor,
} from 'lucide-react';

import { Card, Button, PageHeader, Badge } from '../../components/common';
import { AuthContext } from '../../context/AuthContext';

// ─── localStorage keys ──────────────────────────────────────────
const LS_NOTIF = 'settings_notifications';
const LS_APPEARANCE = 'settings_appearance';
const LS_ACCOUNT = 'settings_account';

function readLS(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

// ─── Default values ─────────────────────────────────────────────
const DEFAULT_ACCOUNT = {
  firstName: 'Alex',
  lastName: 'Morgan',
  email: 'alex.morgan@student.edu',
  studentId: 'STU-2025-0042',
  classGrade: 'Grade 8 — Section A',
  institution: 'Greenwood International School',
  phone: '+91 98765 43210',
};

const DEFAULT_NOTIF = {
  evaluation: true,
  feedback: true,
  submission: false,
  performance: true,
  reminders: false,
};

const DEFAULT_APPEARANCE = { theme: 'light' };

// ─── Reusable: section heading ──────────────────────────────────
function SectionHeading({ icon: Icon, title, description }) {
  return (
    <div className="flex items-start gap-3 mb-5">
      <div className="h-9 w-9 rounded-xl bg-[#4F46E5]/8 flex items-center justify-center flex-shrink-0 mt-0.5">
        <Icon className="h-4.5 w-4.5 text-[#4F46E5]" />
      </div>
      <div>
        <h2 className="text-base font-semibold text-gray-900">{title}</h2>
        {description && <p className="text-xs text-gray-400 mt-0.5">{description}</p>}
      </div>
    </div>
  );
}

// ─── Reusable: labelled input ───────────────────────────────────
function Field({ label, type = 'text', name, value, onChange, readOnly = false, hint }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        readOnly={readOnly}
        className={`w-full px-3.5 py-2.5 text-sm rounded-xl border transition-all
          ${readOnly
            ? 'bg-gray-50 text-gray-400 border-gray-100 cursor-not-allowed'
            : 'bg-white text-gray-900 border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/30 focus:border-[#4F46E5]'
          }`}
      />
      {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
    </div>
  );
}

// ─── Reusable: toggle switch ────────────────────────────────────
function Toggle({ checked, onChange, id }) {
  return (
    <button
      id={id}
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className={`relative h-6 w-11 rounded-full transition-colors flex-shrink-0
        focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/30 focus:ring-offset-1
        ${checked ? 'bg-[#4F46E5]' : 'bg-gray-200'}`}
    >
      <span
        className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform
          ${checked ? 'translate-x-5' : 'translate-x-0'}`}
      />
    </button>
  );
}

// ─── Reusable: notification row ─────────────────────────────────
function NotifRow({ id, label, description, checked, onChange }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3.5 border-b border-gray-50 last:border-0">
      <label htmlFor={id} className="flex-1 cursor-pointer">
        <p className="text-sm font-medium text-gray-900">{label}</p>
        <p className="text-xs text-gray-400 mt-0.5">{description}</p>
      </label>
      <Toggle id={id} checked={checked} onChange={onChange} />
    </div>
  );
}

// ─── Section 1: Account Settings ───────────────────────────────
function AccountSection() {
  const [form, setForm] = useState(() => readLS(LS_ACCOUNT, DEFAULT_ACCOUNT));
  const [saved, setSaved] = useState(false);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSave() {
    localStorage.setItem(LS_ACCOUNT, JSON.stringify(form));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  const editableFields = [
    { name: 'firstName', label: 'First Name' },
    { name: 'lastName', label: 'Last Name' },
    { name: 'email', label: 'Email Address', type: 'email' },
    { name: 'phone', label: 'Phone Number', type: 'tel' },
    { name: 'classGrade', label: 'Class / Grade' },
    { name: 'institution', label: 'Institution' },
  ];

  return (
    <Card>
      <SectionHeading
        icon={User}
        title="Account Settings"
        description="Update your personal information. Student ID cannot be changed."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {editableFields.map(({ name, label, type }) => (
          <Field
            key={name}
            name={name}
            label={label}
            type={type || 'text'}
            value={form[name] ?? ''}
            onChange={handleChange}
          />
        ))}
        <Field
          name="studentId"
          label="Student ID"
          value={form.studentId}
          readOnly
          hint="Contact your institution to update."
        />
      </div>

      <div className="mt-5 flex items-center justify-between gap-3 pt-4 border-t border-gray-100">
        <p className="text-xs text-gray-400 flex items-center gap-1.5">
          <ShieldCheck className="h-3.5 w-3.5" />
          Changes are saved locally until the backend is connected.
        </p>
        <div className="flex items-center gap-3">
          {saved && (
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#10B981]">
              <CheckCircle className="h-3.5 w-3.5" />
              Saved
            </span>
          )}
          <Button
            variant="primary"
            size="sm"
            icon={<Save className="h-4 w-4" />}
            onClick={handleSave}
          >
            Save Changes
          </Button>
        </div>
      </div>
    </Card>
  );
}

// ─── Section 2: Notification Preferences ───────────────────────
const NOTIF_OPTIONS = [
  {
    key: 'evaluation',
    label: 'Evaluation completed',
    description: 'Notify when your notebook evaluation is ready',
  },
  {
    key: 'feedback',
    label: 'AI feedback available',
    description: 'Notify when AI feedback is generated for a submission',
  },
  {
    key: 'submission',
    label: 'Submission status updates',
    description: 'Notify on processing, errors, or re-evaluation',
  },
  {
    key: 'performance',
    label: 'Weekly performance summary',
    description: 'Receive a weekly digest of your academic progress',
  },
  {
    key: 'reminders',
    label: 'Upload reminders',
    description: 'Remind you to submit notebooks before deadlines',
  },
];

function NotificationsSection() {
  const [prefs, setPrefs] = useState(() => readLS(LS_NOTIF, DEFAULT_NOTIF));
  const [saved, setSaved] = useState(false);

  function toggle(key) {
    setPrefs((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  function handleSave() {
    // TODO: POST /api/students/me/notifications when backend is ready
    localStorage.setItem(LS_NOTIF, JSON.stringify(prefs));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  const enabledCount = Object.values(prefs).filter(Boolean).length;

  return (
    <Card>
      <div className="flex items-start justify-between gap-4 mb-5">
        <div className="flex items-start gap-3">
          <div className="h-9 w-9 rounded-xl bg-[#4F46E5]/8 flex items-center justify-center flex-shrink-0 mt-0.5">
            <Bell className="h-4 w-4 text-[#4F46E5]" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-gray-900">Notification Preferences</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Choose which alerts you want to receive.
            </p>
          </div>
        </div>
        <Badge variant="primary" size="sm">{enabledCount} active</Badge>
      </div>

      <div className="divide-y divide-gray-50">
        {NOTIF_OPTIONS.map(({ key, label, description }) => (
          <NotifRow
            key={key}
            id={`notif-${key}`}
            label={label}
            description={description}
            checked={!!prefs[key]}
            onChange={() => toggle(key)}
          />
        ))}
      </div>

      <div className="mt-5 flex items-center justify-between gap-3 pt-4 border-t border-gray-100">
        <p className="text-xs text-gray-400 flex items-center gap-1.5">
          <ShieldCheck className="h-3.5 w-3.5" />
          Preferences saved locally until backend is connected.
        </p>
        <div className="flex items-center gap-3">
          {saved && (
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#10B981]">
              <CheckCircle className="h-3.5 w-3.5" />
              Saved
            </span>
          )}
          <Button
            variant="primary"
            size="sm"
            icon={<Save className="h-4 w-4" />}
            onClick={handleSave}
          >
            Save Preferences
          </Button>
        </div>
      </div>
    </Card>
  );
}

// ─── Section 3: Appearance ──────────────────────────────────────
const THEME_OPTIONS = [
  {
    value: 'light',
    label: 'Light',
    description: 'Clean white interface',
    icon: Sun,
  },
  {
    value: 'system',
    label: 'System',
    description: 'Follows your OS setting',
    icon: Monitor,
  },
];

function AppearanceSection() {
  const [appearance, setAppearance] = useState(() =>
    readLS(LS_APPEARANCE, DEFAULT_APPEARANCE),
  );
  const [saved, setSaved] = useState(false);

  function handleSelect(value) {
    setAppearance({ theme: value });
  }

  function handleSave() {
    localStorage.setItem(LS_APPEARANCE, JSON.stringify(appearance));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <Card>
      <SectionHeading
        icon={Sun}
        title="Appearance"
        description="Customize how the Student Portal looks. Dark mode will be available once the theme system is implemented."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {THEME_OPTIONS.map(({ value, label, description, icon: Icon }) => {
          const active = appearance.theme === value;
          return (
            <button
              key={value}
              onClick={() => handleSelect(value)}
              className={`flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all
                ${active
                  ? 'border-[#4F46E5] bg-[#4F46E5]/5'
                  : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                }`}
            >
              <div className={`h-9 w-9 rounded-xl flex items-center justify-center flex-shrink-0
                ${active ? 'bg-[#4F46E5] text-white' : 'bg-gray-100 text-gray-500'}`}
              >
                <Icon className="h-4 w-4" />
              </div>
              <div>
                <p className={`text-sm font-semibold ${active ? 'text-[#4F46E5]' : 'text-gray-900'}`}>
                  {label}
                </p>
                <p className="text-xs text-gray-400">{description}</p>
              </div>
              {active && (
                <CheckCircle className="h-4 w-4 text-[#4F46E5] ml-auto flex-shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-4 p-3.5 rounded-xl bg-amber-50 border border-amber-100 flex items-start gap-2.5">
        <AlertCircle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-amber-700">
          Dark mode is not yet implemented. Your preference will be applied once the theme system is built.
        </p>
      </div>

      <div className="mt-5 flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
        {saved && (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#10B981]">
            <CheckCircle className="h-3.5 w-3.5" />
            Saved
          </span>
        )}
        <Button
          variant="primary"
          size="sm"
          icon={<Save className="h-4 w-4" />}
          onClick={handleSave}
        >
          Save Preference
        </Button>
      </div>
    </Card>
  );
}

// ─── Section 4: Security / Change Password ──────────────────────
function SecuritySection() {
  const [form, setForm] = useState({ current: '', next: '', confirm: '' });
  const [show, setShow] = useState({ current: false, next: false, confirm: false });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null); // 'success' | 'error' | null

  function toggleShow(field) {
    setShow((prev) => ({ ...prev, [field]: !prev[field] }));
  }

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: '' }));
    setStatus(null);
  }

  function validate() {
    const errs = {};
    if (!form.current) errs.current = 'Current password is required.';
    if (!form.next) errs.next = 'New password is required.';
    else if (form.next.length < 8) errs.next = 'Must be at least 8 characters.';
    else if (!/\d/.test(form.next)) errs.next = 'Must include at least one number.';
    if (!form.confirm) errs.confirm = 'Please confirm your new password.';
    else if (form.next !== form.confirm) errs.confirm = 'Passwords do not match.';
    return errs;
  }

  function handleSubmit() {
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    // TODO: POST /api/auth/change-password when backend is ready
    setStatus('success');
    setForm({ current: '', next: '', confirm: '' });
    setErrors({});
    setTimeout(() => setStatus(null), 3000);
  }

  const pwFields = [
    { name: 'current', label: 'Current Password' },
    { name: 'next', label: 'New Password', hint: 'Min 8 characters, must include a number.' },
    { name: 'confirm', label: 'Confirm New Password' },
  ];

  return (
    <Card>
      <SectionHeading
        icon={Lock}
        title="Security"
        description="Update your password. Use a strong password you haven't used before."
      />

      <div className="space-y-4 max-w-md">
        {pwFields.map(({ name, label, hint }) => (
          <div key={name}>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
              {label}
            </label>
            <div className="relative">
              <input
                type={show[name] ? 'text' : 'password'}
                name={name}
                value={form[name]}
                onChange={handleChange}
                autoComplete="new-password"
                className={`w-full px-3.5 py-2.5 pr-10 text-sm rounded-xl border transition-all
                  focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/30 focus:border-[#4F46E5]
                  ${errors[name] ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white text-gray-900'}`}
              />
              <button
                type="button"
                onClick={() => toggleShow(name)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label={show[name] ? 'Hide password' : 'Show password'}
              >
                {show[name] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors[name] && (
              <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                <AlertCircle className="h-3 w-3 flex-shrink-0" />
                {errors[name]}
              </p>
            )}
            {hint && !errors[name] && (
              <p className="text-xs text-gray-400 mt-1">{hint}</p>
            )}
          </div>
        ))}
      </div>

      {status === 'success' && (
        <div className="mt-4 p-3.5 rounded-xl bg-green-50 border border-green-100 flex items-center gap-2.5">
          <CheckCircle className="h-4 w-4 text-[#10B981] flex-shrink-0" />
          <p className="text-sm font-medium text-green-700">
            Password updated successfully.
          </p>
        </div>
      )}

      <div className="mt-5 flex items-center justify-between gap-3 pt-4 border-t border-gray-100">
        <p className="text-xs text-gray-400 flex items-center gap-1.5">
          <ShieldCheck className="h-3.5 w-3.5" />
          Password change will connect to the backend when available.
        </p>
        <Button
          variant="primary"
          size="sm"
          icon={<Lock className="h-4 w-4" />}
          onClick={handleSubmit}
        >
          Update Password
        </Button>
      </div>
    </Card>
  );
}

// ─── Section 5: Account Actions ─────────────────────────────────
function AccountActionsSection() {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  function handleLogout() {
    logout(); // clears localStorage via authService
    navigate('/login');
  }

  return (
    <Card>
      <SectionHeading
        icon={LogOut}
        title="Account Actions"
        description="Manage your session and account."
      />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl border border-red-100 bg-red-50/40">
        <div>
          <p className="text-sm font-semibold text-gray-900">Sign out of your account</p>
          <p className="text-xs text-gray-500 mt-0.5">
            You will be redirected to the login page. Your data will not be deleted.
          </p>
        </div>
        <Button
          variant="danger"
          size="sm"
          icon={<LogOut className="h-4 w-4" />}
          onClick={handleLogout}
          className="flex-shrink-0"
        >
          Logout
        </Button>
      </div>
    </Card>
  );
}

// ─── Main Component ────────────────────────────────────────────
function StudentSettings() {
  return (
    <div className="space-y-6 sm:space-y-8 pb-8">
      <PageHeader
        title="Settings"
        description="Manage your account, notifications, appearance, and security."
        breadcrumbs={[
          { label: 'Dashboard', path: '/student' },
          { label: 'Settings' },
        ]}
      />

      <AccountSection />
      <NotificationsSection />
      <AppearanceSection />
      <SecuritySection />
      <AccountActionsSection />
    </div>
  );
}

export default StudentSettings;
