import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Pencil, PieChart, ListFilter } from 'lucide-react';
import StudentProfileVisualizer from '../StudentProfileVisualizer';

function Row({ label, value }) {
  const missing = !value;
  return (
    <div className="py-2.5 border-b border-line/60 last:border-0">
      <p className="text-xs text-ink-3">{label}</p>
      {missing ? (
        <p className="text-sm text-ink-3 italic">Not added yet</p>
      ) : (
        <p className="text-sm font-medium text-ink">{value}</p>
      )}
    </div>
  );
}

function val(...parts) {
  const s = parts
    .map((p) => {
      if (p == null) return '';
      if (Array.isArray(p))
        return p
          .map((x) => (typeof x === 'object' ? (x.label ?? x.value ?? '') : String(x)))
          .filter(Boolean)
          .join(', ');
      if (typeof p === 'object') return p.label ?? p.value ?? p.name ?? '';
      return String(p);
    })
    .map((x) => x.trim())
    .filter(Boolean)
    .join(' · ');
  return s || '';
}

export default function ProfileSummary({ answers = {}, userType }) {
  const [viewMode, setViewMode] = useState('visual'); // 'visual' | 'table'
  const a = answers;
  const academic = val(
    a.stream || a.streamV2 || a.currentDegree || a.degree,
    a.marks || a.percentage || a.cgpa,
    a.board || a.university
  );

  const hasAnyAnswers = answers && Object.keys(answers).length > 0;

  return (
    <section className="space-y-4" aria-labelledby="profile-summary">
      {/* Switcher bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 bg-paper border border-line p-1 rounded-control">
          <button
            type="button"
            onClick={() => setViewMode('visual')}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded text-xs font-semibold cursor-pointer transition-colors ${
              viewMode === 'visual' ? 'bg-white text-brand-700 shadow-xs' : 'text-ink-2 hover:text-ink'
            }`}
          >
            <PieChart className="w-3.5 h-3.5" />
            Visual Profile
          </button>
          <button
            type="button"
            onClick={() => setViewMode('table')}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded text-xs font-semibold cursor-pointer transition-colors ${
              viewMode === 'table' ? 'bg-white text-brand-700 shadow-xs' : 'text-ink-2 hover:text-ink'
            }`}
          >
            <ListFilter className="w-3.5 h-3.5" />
            Detail List
          </button>
        </div>

        <Link
          to="/account"
          className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-700"
        >
          <Pencil className="w-3 h-3" /> Edit Profile
        </Link>
      </div>

      {viewMode === 'visual' ? (
        <StudentProfileVisualizer answers={answers} userType={userType} showEdit={false} />
      ) : (
        <div className="bg-white border border-line rounded-2xl p-5 sm:p-6 shadow-card">
          <h2 id="profile-summary" className="font-ui font-bold text-[1.15rem] tracking-[-0.02em] text-ink mb-2">
            Detailed Profile Parameters
          </h2>
          <Row label="Academic Profile" value={academic} />
          <Row label="Interests" value={val(a.interests || a.interest || a.interestArea || a.subjectInterests || a.favoriteSubject)} />
          <Row label="Strengths" value={val(a.strengths || a.skills)} />
          <Row label="Preferred Work Style" value={val(a.workStyle || a.work || a.workEnvironment)} />
          <Row label="Budget" value={val(a.budget || a.budgetId)} />
          <Row label="Preferred Location" value={val(a.preferredLocation || a.location || a.city || a.preference)} />
          <Row label="Goal" value={val(a.goal || a.futureDirection || a.careerGoal || a.motivation)} />
          {!academic && (
            <Link
              to="/get-started"
              className="mt-4 inline-flex items-center rounded-xl bg-ink text-white text-sm font-semibold px-5 py-2.5 hover:bg-brand-950 transition-colors"
            >
              Add information
            </Link>
          )}
          {userType && <p className="text-xs text-ink-3 mt-3">Stage: {userType}</p>}
        </div>
      )}
    </section>
  );
}
