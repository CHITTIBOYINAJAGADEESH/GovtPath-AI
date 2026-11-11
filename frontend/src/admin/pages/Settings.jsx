import { useState } from 'react';
import {
  Settings as SettingsIcon,
  Save,
  ShieldCheck,
  User,
  Palette,
  Bell,
  Globe,
  Sliders,
  Sparkles,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { settingsService } from '../../services/admin/systemServices';
import { useAdminStore } from '../../store/useAdminStore';

export default function Settings() {
  const { adminUser, setAdminUser } = useAdminStore();
  const [activeTab, setActiveTab] = useState('general');

  // Settings State
  const [settings, setSettings] = useState(() => settingsService.getSettings());

  // Profile State
  const [profileForm, setProfileForm] = useState({
    name: adminUser?.name || 'Jagadeesh Chittiboyina',
    email: adminUser?.email || 'jagadeeshchittiboyina07@gmail.com',
    avatar: adminUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleSaveSettings = (e) => {
    e.preventDefault();
    try {
      settingsService.saveSettings(settings);
      toast.success('System settings saved successfully');
    } catch (err) {
      toast.error('Failed to save settings');
    }
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (profileForm.newPassword && profileForm.newPassword !== profileForm.confirmPassword) {
      return toast.error('New passwords do not match');
    }

    const updatedUser = {
      ...adminUser,
      name: profileForm.name,
      email: profileForm.email,
      avatar: profileForm.avatar,
    };
    setAdminUser(updatedUser);
    localStorage.setItem('govtpath_admin_auth_user', JSON.stringify(updatedUser));
    toast.success('Admin profile updated successfully');
  };

  const tabs = [
    { id: 'general', label: 'General Platform', icon: Globe },
    { id: 'appearance', label: 'Design & Appearance', icon: Palette },
    { id: 'examinations', label: 'Examination Settings', icon: Sliders },
    { id: 'notifications', label: 'Admin Notifications', icon: Bell },
    { id: 'profile', label: 'Admin Profile', icon: User },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-black text-admin-text tracking-tight">Admin Settings</h1>
        <p className="text-xs text-admin-muted mt-1">
          Configure platform branding, examination approval defaults, notification thresholds, and administrator credentials.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-admin-border gap-2 overflow-x-auto text-xs">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 py-3 px-3.5 font-bold border-b-2 transition whitespace-nowrap ${
                isActive
                  ? 'border-admin-primary text-admin-primary'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon size={15} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab 1: General Platform */}
      {activeTab === 'general' && (
        <form onSubmit={handleSaveSettings} className="admin-card space-y-4 text-xs">
          <h2 className="text-sm font-bold text-admin-text border-b border-admin-border pb-3">
            General Platform Settings
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-admin-text mb-1">Platform Brand Name</label>
              <input
                type="text"
                value={settings.general.platformName}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    general: { ...settings.general, platformName: e.target.value },
                  })
                }
                className="admin-input"
              />
            </div>

            <div>
              <label className="block font-semibold text-admin-text mb-1">Default Portal Language</label>
              <select
                value={settings.general.defaultLanguage}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    general: { ...settings.general, defaultLanguage: e.target.value },
                  })
                }
                className="admin-select"
              >
                <option value="English">English (Official)</option>
                <option value="Hindi">Hindi / English Bilingual</option>
                <option value="Telugu">Telugu / Regional</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-admin-text mb-1">Platform Description</label>
            <textarea
              rows={2}
              value={settings.general.tagline}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  general: { ...settings.general, tagline: e.target.value },
                })
              }
              className="admin-input"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-admin-text mb-1">Contact Email</label>
              <input
                type="email"
                value={settings.general.contactEmail}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    general: { ...settings.general, contactEmail: e.target.value },
                  })
                }
                className="admin-input"
              />
            </div>
            <div>
              <label className="block font-semibold text-admin-text mb-1">Support Helpline</label>
              <input
                type="text"
                value={settings.general.supportPhone}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    general: { ...settings.general, supportPhone: e.target.value },
                  })
                }
                className="admin-input"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button type="submit" className="admin-btn-primary">
              <Save size={14} /> Save General Settings
            </button>
          </div>
        </form>
      )}

      {/* Tab 2: Appearance */}
      {activeTab === 'appearance' && (
        <form onSubmit={handleSaveSettings} className="admin-card space-y-4 text-xs">
          <h2 className="text-sm font-bold text-admin-text border-b border-admin-border pb-3">
            Design & Appearance Palette
          </h2>

          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-xl border border-admin-border p-3">
              <div className="h-8 rounded-lg mb-2" style={{ backgroundColor: settings.appearance.primaryColor }} />
              <label className="block font-semibold text-admin-text mb-1">Primary Color</label>
              <input
                type="text"
                value={settings.appearance.primaryColor}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    appearance: { ...settings.appearance, primaryColor: e.target.value },
                  })
                }
                className="admin-input font-mono"
              />
            </div>

            <div className="rounded-xl border border-admin-border p-3">
              <div className="h-8 rounded-lg mb-2" style={{ backgroundColor: settings.appearance.secondaryColor }} />
              <label className="block font-semibold text-admin-text mb-1">Secondary Color</label>
              <input
                type="text"
                value={settings.appearance.secondaryColor}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    appearance: { ...settings.appearance, secondaryColor: e.target.value },
                  })
                }
                className="admin-input font-mono"
              />
            </div>

            <div className="rounded-xl border border-admin-border p-3">
              <div className="h-8 rounded-lg mb-2" style={{ backgroundColor: settings.appearance.accentColor }} />
              <label className="block font-semibold text-admin-text mb-1">Accent Color</label>
              <input
                type="text"
                value={settings.appearance.accentColor}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    appearance: { ...settings.appearance, accentColor: e.target.value },
                  })
                }
                className="admin-input font-mono"
              />
            </div>
          </div>

          <div className="space-y-2 border-t border-slate-100 pt-4">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="motionToggle"
                checked={settings.appearance.enableFramerMotion}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    appearance: { ...settings.appearance, enableFramerMotion: e.target.checked },
                  })
                }
                className="rounded border-slate-300 text-admin-primary focus:ring-admin-primary"
              />
              <label htmlFor="motionToggle" className="font-semibold text-admin-text cursor-pointer">
                Enable lightweight smooth Framer Motion transitions
              </label>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button type="submit" className="admin-btn-primary">
              <Save size={14} /> Save Appearance
            </button>
          </div>
        </form>
      )}

      {/* Tab 3: Examinations Settings */}
      {activeTab === 'examinations' && (
        <form onSubmit={handleSaveSettings} className="admin-card space-y-4 text-xs">
          <h2 className="text-sm font-bold text-admin-text border-b border-admin-border pb-3">
            Examination Catalogue Defaults
          </h2>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="requireSyllabus"
                checked={settings.examinations.requireSyllabusVerification}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    examinations: { ...settings.examinations, requireSyllabusVerification: e.target.checked },
                  })
                }
                className="rounded border-slate-300 text-admin-primary focus:ring-admin-primary"
              />
              <label htmlFor="requireSyllabus" className="font-semibold text-admin-text cursor-pointer">
                Require source verification badge before publishing syllabus updates to student portal
              </label>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="guestBrowsing"
                checked={settings.examinations.allowGuestExamBrowsing}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    examinations: { ...settings.examinations, allowGuestExamBrowsing: e.target.checked },
                  })
                }
                className="rounded border-slate-300 text-admin-primary focus:ring-admin-primary"
              />
              <label htmlFor="guestBrowsing" className="font-semibold text-admin-text cursor-pointer">
                Allow guests to browse examination catalogue before logging in
              </label>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button type="submit" className="admin-btn-primary">
              <Save size={14} /> Save Examination Rules
            </button>
          </div>
        </form>
      )}

      {/* Tab 4: Notifications */}
      {activeTab === 'notifications' && (
        <form onSubmit={handleSaveSettings} className="admin-card space-y-4 text-xs">
          <h2 className="text-sm font-bold text-admin-text border-b border-admin-border pb-3">
            Admin Notification & Alert Preferences
          </h2>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="instantAlerts"
                checked={settings.notifications.instantReviewQueueAlerts}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    notifications: { ...settings.notifications, instantReviewQueueAlerts: e.target.checked },
                  })
                }
                className="rounded border-slate-300 text-admin-primary focus:ring-admin-primary"
              />
              <label htmlFor="instantAlerts" className="font-semibold text-admin-text cursor-pointer">
                Instant bell notifications when new custom examination requests arrive
              </label>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="dailyDigest"
                checked={settings.notifications.dailyDigestSummary}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    notifications: { ...settings.notifications, dailyDigestSummary: e.target.checked },
                  })
                }
                className="rounded border-slate-300 text-admin-primary focus:ring-admin-primary"
              />
              <label htmlFor="dailyDigest" className="font-semibold text-admin-text cursor-pointer">
                Daily digest summary of completed student mock test attempts
              </label>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button type="submit" className="admin-btn-primary">
              <Save size={14} /> Save Preferences
            </button>
          </div>
        </form>
      )}

      {/* Tab 5: Profile Settings */}
      {activeTab === 'profile' && (
        <form onSubmit={handleSaveProfile} className="admin-card space-y-4 text-xs">
          <div className="flex items-center justify-between border-b border-admin-border pb-3">
            <div>
              <h2 className="text-sm font-bold text-admin-text">Administrator Profile Credentials</h2>
              <p className="text-[11px] text-admin-muted">
                Official Super Admin: {adminUser?.name || 'Jagadeesh Chittiboyina'}
              </p>
            </div>
            <span className="admin-badge bg-emerald-50 text-emerald-700">
              <ShieldCheck size={12} /> Super Admin
            </span>
          </div>

          <div className="flex items-center gap-4 py-2">
            <img
              src={profileForm.avatar}
              alt="Profile"
              className="h-16 w-16 rounded-2xl object-cover border border-slate-200"
            />
            <div className="flex-1">
              <label className="block font-semibold text-admin-text mb-1">Profile Image URL</label>
              <input
                type="url"
                value={profileForm.avatar}
                onChange={(e) => setProfileForm({ ...profileForm, avatar: e.target.value })}
                className="admin-input"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-admin-text mb-1">Full Name</label>
              <input
                type="text"
                required
                value={profileForm.name}
                onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                className="admin-input"
              />
            </div>

            <div>
              <label className="block font-semibold text-admin-text mb-1">Admin Email Address</label>
              <input
                type="email"
                required
                value={profileForm.email}
                onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                className="admin-input font-mono"
              />
            </div>
          </div>

          <div className="border-t border-slate-100 pt-4 space-y-3">
            <span className="font-bold text-admin-text block">Password Management</span>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-admin-text mb-1">New Password</label>
                <input
                  type="password"
                  placeholder="Enter new password"
                  value={profileForm.newPassword}
                  onChange={(e) => setProfileForm({ ...profileForm, newPassword: e.target.value })}
                  className="admin-input"
                />
              </div>

              <div>
                <label className="block font-semibold text-admin-text mb-1">Confirm New Password</label>
                <input
                  type="password"
                  placeholder="Repeat new password"
                  value={profileForm.confirmPassword}
                  onChange={(e) => setProfileForm({ ...profileForm, confirmPassword: e.target.value })}
                  className="admin-input"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button type="submit" className="admin-btn-primary">
              <Save size={14} /> Update Admin Profile
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
