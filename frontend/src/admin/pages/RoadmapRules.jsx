import { useState } from 'react';
import { Sliders, Save, RefreshCw, Sparkles, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function RoadmapRules() {
  const [rules, setRules] = useState({
    beginnerMultiplier: 1.3,
    intermediateMultiplier: 1.0,
    advancedMultiplier: 0.8,
    foundationPhaseRatio: 0.25,
    corePhaseRatio: 0.45,
    revisionPhaseRatio: 0.15,
    mockPhaseRatio: 0.15,
    dailyMaxStudyHours: 12,
    dailyMinStudyHours: 2,
    enableAdaptiveWeakTopicPrioritization: true,
    enableMilestoneReminders: true,
  });

  const handleSave = (e) => {
    e.preventDefault();
    localStorage.setItem('govtpath_roadmap_engine_rules', JSON.stringify(rules));
    toast.success('Roadmap calculation rules saved successfully');
  };

  const handleReset = () => {
    setRules({
      beginnerMultiplier: 1.3,
      intermediateMultiplier: 1.0,
      advancedMultiplier: 0.8,
      foundationPhaseRatio: 0.25,
      corePhaseRatio: 0.45,
      revisionPhaseRatio: 0.15,
      mockPhaseRatio: 0.15,
      dailyMaxStudyHours: 12,
      dailyMinStudyHours: 2,
      enableAdaptiveWeakTopicPrioritization: true,
      enableMilestoneReminders: true,
    });
    toast.success('Rules reset to defaults');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-admin-text tracking-tight">
            AI Roadmap Engine Rules
          </h1>
          <p className="text-xs text-admin-muted mt-1">
            Configure algorithmic pacing multipliers, phase ratios, and adaptive schedule tuning parameters.
          </p>
        </div>

        <button type="button" onClick={handleReset} className="admin-btn-outline text-xs">
          <RefreshCw size={13} /> Reset Defaults
        </button>
      </div>

      <div className="admin-card">
        <form onSubmit={handleSave} className="space-y-6 text-xs">
          {/* Multipliers */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-admin-primary mb-3">
              1. Preparation Level Multipliers (Hour Adjustments)
            </h2>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold text-admin-text mb-1">
                  Beginner Multiplier
                </label>
                <input
                  type="number"
                  step={0.1}
                  value={rules.beginnerMultiplier}
                  onChange={(e) => setRules({ ...rules, beginnerMultiplier: Number(e.target.value) })}
                  className="admin-input"
                />
                <span className="text-[10px] text-admin-muted mt-1 block">Increases study allocation by 30%</span>
              </div>

              <div>
                <label className="block font-semibold text-admin-text mb-1">
                  Intermediate Multiplier
                </label>
                <input
                  type="number"
                  step={0.1}
                  value={rules.intermediateMultiplier}
                  onChange={(e) => setRules({ ...rules, intermediateMultiplier: Number(e.target.value) })}
                  className="admin-input"
                />
                <span className="text-[10px] text-admin-muted mt-1 block">Baseline allocation (1.0x)</span>
              </div>

              <div>
                <label className="block font-semibold text-admin-text mb-1">
                  Advanced Multiplier
                </label>
                <input
                  type="number"
                  step={0.1}
                  value={rules.advancedMultiplier}
                  onChange={(e) => setRules({ ...rules, advancedMultiplier: Number(e.target.value) })}
                  className="admin-input"
                />
                <span className="text-[10px] text-admin-muted mt-1 block">Faster pace (0.8x)</span>
              </div>
            </div>
          </div>

          {/* Phase distribution */}
          <div className="border-t border-slate-100 pt-6">
            <h2 className="text-xs font-bold uppercase tracking-wider text-admin-primary mb-3">
              2. Timeline Phase Weightages (% of total weeks)
            </h2>
            <div className="grid grid-cols-4 gap-4">
              <div>
                <label className="block font-semibold text-admin-text mb-1">Foundation Phase</label>
                <input
                  type="number"
                  step={0.05}
                  value={rules.foundationPhaseRatio}
                  onChange={(e) => setRules({ ...rules, foundationPhaseRatio: Number(e.target.value) })}
                  className="admin-input"
                />
              </div>
              <div>
                <label className="block font-semibold text-admin-text mb-1">Core Learning</label>
                <input
                  type="number"
                  step={0.05}
                  value={rules.corePhaseRatio}
                  onChange={(e) => setRules({ ...rules, corePhaseRatio: Number(e.target.value) })}
                  className="admin-input"
                />
              </div>
              <div>
                <label className="block font-semibold text-admin-text mb-1">Revision Phase</label>
                <input
                  type="number"
                  step={0.05}
                  value={rules.revisionPhaseRatio}
                  onChange={(e) => setRules({ ...rules, revisionPhaseRatio: Number(e.target.value) })}
                  className="admin-input"
                />
              </div>
              <div>
                <label className="block font-semibold text-admin-text mb-1">Mocks Marathon</label>
                <input
                  type="number"
                  step={0.05}
                  value={rules.mockPhaseRatio}
                  onChange={(e) => setRules({ ...rules, mockPhaseRatio: Number(e.target.value) })}
                  className="admin-input"
                />
              </div>
            </div>
          </div>

          {/* Adaptive Engine Toggles */}
          <div className="border-t border-slate-100 pt-6 space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-admin-primary">
              3. Dynamic Adaptive Optimization
            </h2>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="adaptiveTopics"
                checked={rules.enableAdaptiveWeakTopicPrioritization}
                onChange={(e) => setRules({ ...rules, enableAdaptiveWeakTopicPrioritization: e.target.checked })}
                className="rounded border-slate-300 text-admin-primary focus:ring-admin-primary"
              />
              <label htmlFor="adaptiveTopics" className="font-semibold text-admin-text cursor-pointer">
                Automatically prioritize weak subjects based on student practice accuracy history
              </label>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="milestoneReminders"
                checked={rules.enableMilestoneReminders}
                onChange={(e) => setRules({ ...rules, enableMilestoneReminders: e.target.checked })}
                className="rounded border-slate-300 text-admin-primary focus:ring-admin-primary"
              />
              <label htmlFor="milestoneReminders" className="font-semibold text-admin-text cursor-pointer">
                Generate weekly revision checkpoints and mock test prompts in student study planner
              </label>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-6">
            <button type="submit" className="admin-btn-primary">
              <Save size={14} /> Save Calculation Rules
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
