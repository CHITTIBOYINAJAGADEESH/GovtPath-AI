import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, Sparkles, HelpCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { examManagementService } from '../../services/admin/examManagementService';
import { useAdminStore } from '../../store/useAdminStore';

export default function AddEditExam() {
  const { examId } = useParams();
  const navigate = useNavigate();
  const { refreshData } = useAdminStore();
  const isEditing = !!examId;

  const categories = examManagementService.getAllCategories();

  const [form, setForm] = useState({
    name: '',
    id: '',
    category: 'engineering',
    categoryLabel: 'Engineering Entrance',
    org: '',
    level: 'Graduate',
    state: 'All India',
    qualification: 'Bachelor Degree',
    ageLimit: '21 to 32 years',
    desc: '',
    pattern: 'Prelims (Objective CBT) + Mains (Descriptive) + Interview',
    subjects: 'General Studies, Aptitude, Technical Discipline',
    officialWebsite: '',
    applicationWebsite: '',
    status: 'Active',
    isPopular: false,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEditing) {
      const existing = examManagementService.getExamById(examId);
      if (existing) {
        setForm({
          ...existing,
          categoryLabel: existing.categoryLabel || existing.category,
          subjects: Array.isArray(existing.subjects)
            ? existing.subjects.join(', ')
            : existing.subjects || '',
        });
      } else {
        toast.error('Examination not found');
        navigate('/admin/exams');
      }
    }
  }, [examId, isEditing, navigate]);

  const handleNameChange = (e) => {
    const val = e.target.value;
    if (!isEditing) {
      const autoSlug = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setForm((prev) => ({ ...prev, name: val, id: autoSlug }));
    } else {
      setForm((prev) => ({ ...prev, name: val }));
    }
  };

  const handleCategoryChange = (e) => {
    const catId = e.target.value;
    const catObj = categories.find((c) => c.id === catId);
    setForm((prev) => ({
      ...prev,
      category: catId,
      categoryLabel: catObj ? catObj.name || catObj.label : catId,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const err = {};
    if (!form.name.trim()) err.name = 'Examination name is required';
    if (!form.id.trim()) err.id = 'Unique examination ID is required';
    if (!form.org.trim()) err.org = 'Conducting organization is required';
    if (!form.desc.trim()) err.desc = 'Description is required';

    if (form.officialWebsite) {
      try {
        new URL(form.officialWebsite);
      } catch {
        err.officialWebsite = 'Enter a valid URL (https://...)';
      }
    }

    setErrors(err);
    if (Object.keys(err).length > 0) {
      toast.error('Please fix the validation errors');
      return;
    }

    try {
      const subjectsArray = typeof form.subjects === 'string'
        ? form.subjects.split(',').map((s) => s.trim()).filter(Boolean)
        : form.subjects;

      const payload = {
        ...form,
        subjects: subjectsArray,
        verified: true,
      };

      if (isEditing) {
        examManagementService.updateExam(examId, payload);
        toast.success(`Updated examination: ${form.name}`);
      } else {
        examManagementService.createExam(payload);
        toast.success(`Created examination: ${form.name}`);
      }

      refreshData();
      navigate('/admin/exams');
    } catch (err) {
      toast.error(err.message || 'Failed to save examination');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Top breadcrumb & title */}
      <div className="flex items-center justify-between">
        <Link
          to="/admin/exams"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-admin-muted hover:text-admin-text transition"
        >
          <ArrowLeft size={14} /> Back to Examination Catalogue
        </Link>
      </div>

      <div className="admin-card">
        <div className="border-b border-admin-border pb-4 mb-6">
          <h1 className="text-xl font-black text-admin-text tracking-tight">
            {isEditing ? `Edit Examination: ${form.name}` : 'Create New Examination'}
          </h1>
          <p className="text-xs text-admin-muted mt-1">
            Configure examination catalogue entry, patterns, eligibility, and student portal visibility.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* General Information */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-admin-primary mb-3">
              1. General Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-admin-text mb-1">
                  Examination Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. UPSC Combined Geo-Scientist Examination"
                  value={form.name}
                  onChange={handleNameChange}
                  className="admin-input"
                />
                {errors.name && <p className="mt-1 text-xs text-admin-error">{errors.name}</p>}
              </div>

              <div>
                <label className="block font-semibold text-admin-text mb-1">
                  Unique Catalogue ID (Slug) *
                </label>
                <input
                  type="text"
                  required
                  disabled={isEditing}
                  placeholder="e.g. upsc-geo-scientist"
                  value={form.id}
                  onChange={(e) => setForm({ ...form, id: e.target.value })}
                  className="admin-input font-mono"
                />
                {errors.id && <p className="mt-1 text-xs text-admin-error">{errors.id}</p>}
              </div>

              <div>
                <label className="block font-semibold text-admin-text mb-1">Category *</label>
                <select
                  value={form.category}
                  onChange={handleCategoryChange}
                  className="admin-select"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name || c.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-admin-text mb-1">
                  Conducting Organization *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Union Public Service Commission"
                  value={form.org}
                  onChange={(e) => setForm({ ...form, org: e.target.value })}
                  className="admin-input"
                />
                {errors.org && <p className="mt-1 text-xs text-admin-error">{errors.org}</p>}
              </div>
            </div>
          </div>

          {/* Level & Eligibility */}
          <div className="border-t border-slate-100 pt-6">
            <h2 className="text-xs font-bold uppercase tracking-wider text-admin-primary mb-3">
              2. Eligibility & Regional Scope
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-admin-text mb-1">Academic Level</label>
                <select
                  value={form.level}
                  onChange={(e) => setForm({ ...form, level: e.target.value })}
                  className="admin-select"
                >
                  {['10th / Secondary', 'Intermediate', 'Graduate', 'Postgraduate', 'Professional', 'Doctoral'].map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-admin-text mb-1">Regional Scope</label>
                <select
                  value={form.state}
                  onChange={(e) => setForm({ ...form, state: e.target.value })}
                  className="admin-select"
                >
                  {['All India', 'Andhra Pradesh', 'Telangana', 'Maharashtra', 'Tamil Nadu', 'Karnataka', 'Kerala', 'Uttar Pradesh'].map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-admin-text mb-1">Minimum Qualification</label>
                <input
                  type="text"
                  placeholder="e.g. Master's in Geology / Geophysics"
                  value={form.qualification}
                  onChange={(e) => setForm({ ...form, qualification: e.target.value })}
                  className="admin-input"
                />
              </div>

              <div>
                <label className="block font-semibold text-admin-text mb-1">Age Eligibility</label>
                <input
                  type="text"
                  placeholder="e.g. 21 to 32 years (Relaxations apply)"
                  value={form.ageLimit}
                  onChange={(e) => setForm({ ...form, ageLimit: e.target.value })}
                  className="admin-input"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block font-semibold text-admin-text mb-1">
                  Key Subjects (Comma Separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. General Studies, Geology Paper I, Hydrogeology"
                  value={form.subjects}
                  onChange={(e) => setForm({ ...form, subjects: e.target.value })}
                  className="admin-input"
                />
              </div>
            </div>
          </div>

          {/* Description & URLs */}
          <div className="border-t border-slate-100 pt-6">
            <h2 className="text-xs font-bold uppercase tracking-wider text-admin-primary mb-3">
              3. Description, Pattern & Official Links
            </h2>
            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-admin-text mb-1">
                  Examination Description *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Provide an overview of the examination, career opportunities, and target posts..."
                  value={form.desc}
                  onChange={(e) => setForm({ ...form, desc: e.target.value })}
                  className="admin-input"
                />
                {errors.desc && <p className="mt-1 text-xs text-admin-error">{errors.desc}</p>}
              </div>

              <div>
                <label className="block font-semibold text-admin-text mb-1">
                  Examination Pattern Summary
                </label>
                <input
                  type="text"
                  placeholder="e.g. Stage 1: Preliminary Computer-Based Screening; Stage 2: Main Written Exam"
                  value={form.pattern}
                  onChange={(e) => setForm({ ...form, pattern: e.target.value })}
                  className="admin-input"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-admin-text mb-1">
                    Official Website URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://upsc.gov.in"
                    value={form.officialWebsite}
                    onChange={(e) => setForm({ ...form, officialWebsite: e.target.value })}
                    className="admin-input"
                  />
                  {errors.officialWebsite && (
                    <p className="mt-1 text-xs text-admin-error">{errors.officialWebsite}</p>
                  )}
                </div>

                <div>
                  <label className="block font-semibold text-admin-text mb-1">
                    Online Application Portal URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://upsconline.nic.in"
                    value={form.applicationWebsite}
                    onChange={(e) => setForm({ ...form, applicationWebsite: e.target.value })}
                    className="admin-input"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Visibility and Status */}
          <div className="border-t border-slate-100 pt-6">
            <h2 className="text-xs font-bold uppercase tracking-wider text-admin-primary mb-3">
              4. Publication Settings
            </h2>
            <div className="flex flex-wrap items-center gap-6 text-xs">
              <div>
                <label className="block font-semibold text-admin-text mb-1">Status</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="admin-select w-40"
                >
                  <option value="Active">Active (Visible to Students)</option>
                  <option value="Inactive">Inactive (Hidden)</option>
                </select>
              </div>

              <div className="mt-4 flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isPopular"
                  checked={form.isPopular}
                  onChange={(e) => setForm({ ...form, isPopular: e.target.checked })}
                  className="h-4 w-4 rounded border-slate-300 text-admin-primary focus:ring-admin-primary"
                />
                <label htmlFor="isPopular" className="font-semibold text-admin-text select-none cursor-pointer">
                  Feature in Popular Examinations section
                </label>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-6">
            <Link to="/admin/exams" className="admin-btn-outline">
              Cancel
            </Link>
            <button type="submit" className="admin-btn-primary">
              <Save size={15} />
              {isEditing ? 'Save Changes' : 'Publish Examination'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
