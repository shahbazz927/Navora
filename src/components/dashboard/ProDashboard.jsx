import { Link } from 'react-router-dom';
import DashboardHeader from './DashboardHeader';
import RoadmapHero from './RoadmapHero';
import SummaryCards from './SummaryCards';
import CareerPaths from './CareerPaths';
import ProfileSummary from './ProfileSummary';
import CollegeRecs from './CollegeRecs';
import AIAdvisorWidget from './AIAdvisorWidget';
import { CourseCompareCard, ActionPlan, ReportsCard, SubscriptionCard } from './ProSections';
import { SectionError } from './DashboardHeader';

export default function ProDashboard({ d, onUpgrade }) {
  return (
    <div className="space-y-6 sm:space-y-8">
      <DashboardHeader isPro user={d.user} onboarding={d.onboardingData} planLabel="NAVORA Pro · Connect the dots and build your plan" />

      {d.remoteError ? (
        <SectionError onRetry={d.retry} />
      ) : (
        <RoadmapHero answers={d.answers} userType={d.userType} onboarding={d.onboardingData} />
      )}

      <SummaryCards
        careerCount={d.unified.length}
        courseCount={d.courseCount}
        collegeCount={d.colleges.length}
        userType={d.userType}
      />

      <CareerPaths items={d.unified} userType={d.userType} />

      <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
        <ProfileSummary answers={d.answers} userType={d.userType} />
        <div className="space-y-4 sm:space-y-6">
          <CourseCompareCard />
          <ReportsCard hasAssessment={d.hasAssessment} isPro onLocked={onUpgrade} />
        </div>
      </div>

      <CollegeRecs colleges={d.colleges} />

      <ActionPlan userId={d.user?.id} />

      <AIAdvisorWidget isPro used={d.aiUsed} limit={d.aiLimit} onUpgrade={onUpgrade} />

      <SubscriptionCard isPro expiresAt={d.expiresAt} onUpgrade={onUpgrade} />

      <p className="text-center text-xs text-ink-3">
        Want a parent-friendly overview? <Link to="/parents" className="text-brand-600 font-semibold hover:text-brand-700">Open Parent Summary →</Link>
      </p>
    </div>
  );
}
