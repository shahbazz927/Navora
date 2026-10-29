import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Check,
  Scale,
  Lightbulb,
  TrendingUp,
  BookOpen,
  MessageCircle,
  Plus,
  GraduationCap,
  FileText,
  Zap,
  Target,
  Building2,
} from 'lucide-react';
import Button from '../components/Button';
import BackLink from '../components/BackLink';
import { FadeIn, StaggerContainer, StaggerItem } from '../components/AnimatedPage';
import { useUser } from '../context/UserContext';
import { recommendationDescriptions, getRecommendation } from '../data/recommendations';
import { useScrollTop } from '../hooks/useLocalStorage';
import { personas } from '../data/personas';
import ResultGate from '../components/ResultGate';
import AICareerAdvisor from '../components/ai/AICareerAdvisor';
import { getCollegesMatchingProfile } from '../data/institutionsMaster';
import CollegeCard from '../components/CollegeCard';

export default function Recommendations() {
  useScrollTop();
  const { userType } = useParams();
  const { answers, onboardingData, comparisonItems, setComparisonItems, setAnswers } = useUser();
  const navigate = useNavigate();

  // The assessment stores the student Graduation journey as "graduation", while
  // the persona / description / recommendation engine speaks "graduate". Map it
  // so a Graduation student gets graduation styling and sections, not parent/class10
  // fallbacks. Parent journeys keep userType "parent".
  const stageUserType = userType === 'graduation' ? 'graduate' : userType;
  const persona = personas[stageUserType] || personas.class10;
  const rec = getRecommendation(stageUserType, answers);
  const displayCourses = rec.topCourses;
  const displayRecs = rec.recommendations;
  const rawStream = Array.isArray(answers.stream) ? answers.stream?.[0] : (answers.stream || '');
  const isStreamDiscovery = userType === 'class12' && rawStream === 'not_sure';
  const matchingColleges = getCollegesMatchingProfile({ ...answers, userType });

  const handleAddToCompare = (course) => {
    if (!comparisonItems.find((c) => c.name === course.name)) {
      setComparisonItems([...comparisonItems, course]);
    }
  };

  const handleSaveToDashboard = () => {
    setAnswers({ ...answers, lastSavedAt: new Date().toISOString() });
    navigate('/dashboard');
  };

  const accent = persona.accent;
  const accentText = accent === 'p10' ? 'text-p10' : accent === 'p12' ? 'text-p12' : accent === 'grad' ? 'text-grad' : 'text-pt';
  const accentChip = accent === 'p10' ? 'bg-p10-soft text-p10' : accent === 'p12' ? 'bg-p12-soft text-p12' : accent === 'grad' ? 'bg-grad-soft text-grad' : 'bg-pt-soft text-pt';
  const accentDot = accent === 'p10' ? 'bg-p10' : accent === 'p12' ? 'bg-p12' : accent === 'grad' ? 'bg-grad' : 'bg-pt';

  const name = onboardingData?.name?.trim();

  return (
    <ResultGate flowKey={userType || 'recommendations'} title="Your Career Direction">
    <div className="min-h-screen bg-surface">
      <div className="max-w-5xl mx-auto px-5 sm:px-8 py-10 lg:py-14">
        <div className="flex items-center justify-between mb-8">
          <BackLink />
          <div className="flex gap-2">
            {comparisonItems.length > 0 && (
              <Link to="/compare">
                <Button variant="secondary" size="sm">
                  <Scale className="w-4 h-4" />
                  Compare ({comparisonItems.length})
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Header */}
        <FadeIn>
          <div>
            <p className="inline-flex items-center gap-2 eyebrow text-brand-600 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-500" />
              Your results
            </p>
            <h1 className="font-ui font-bold text-4xl sm:text-5xl text-ink tracking-[-0.03em] text-balance">
              {name
                ? `${name}, here\u2019s the path that fits.`
                : `Here\u2019s the path that fits.`}
            </h1>
            <p className="mt-4 text-lg text-ink-2 leading-relaxed max-w-2xl">
              {(isStreamDiscovery
                ? 'A stream recommended from your interests, strengths, and career goals.'
                : recommendationDescriptions[stageUserType] || 'Your personalized guidance.')} Every option below is explained, including why it fits and what you would be trading.
            </p>
          </div>
        </FadeIn>

        {/* Student context strip */}
        {rec.context && (rec.context.stream || rec.context.field || rec.context.selections.length > 0) && (
          <FadeIn delay={0.05} className="mt-6">
            <div className="flex flex-wrap items-center gap-2 bg-white border border-line rounded-2xl px-4 py-3 shadow-sm">
              <span className="eyebrow text-ink-3 mr-1">Your context</span>
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink bg-paper border border-line rounded-control px-3 py-1">
                {rec.context.stageLabel}
              </span>
              {rec.context.stream && (
                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-2 bg-paper border border-line rounded-control px-3 py-1">
                  {rec.context.stream.label}
                </span>
              )}
              {rec.context.field && (
                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-2 bg-paper border border-line rounded-control px-3 py-1">
                  {rec.context.field.label}
                </span>
              )}
              {rec.context.selections.map((s) => (
                <span key={s.id} className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-700 bg-brand-50 border border-brand-100 rounded-control px-3 py-1">
                  {s.label}
                </span>
              ))}
            </div>
          </FadeIn>
        )}

        {/* Graduation: relevant specialisations for the chosen branch */}
        {stageUserType === 'graduate' && rec.context?.specializations?.length > 0 && (
          <div className="mt-10">
            <FadeIn>
              <h3 className="font-ui font-bold text-2xl text-ink">
                Specialisations to explore
              </h3>
              <p className="text-sm text-ink-3 mt-1">
                Relevant directions for {rec.context.selections[0]?.label || 'your branch'}, narrowed to your degree and field.
              </p>
            </FadeIn>
            <div className="mt-5 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {rec.context.specializations.map((s, i) => (
                <FadeIn key={s.id} delay={0.05 * i}>
                  <div className="flex items-center gap-3 bg-white border border-line rounded-xl px-4 py-3 h-full card-lift hover:border-brand-200">
                    <span className="font-medium text-sm text-ink">{s.label}</span>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        )}

        {/* Main recommendation */}
        <FadeIn delay={0.1} className="mt-10">
          <div className="bg-brand-950 text-white rounded-panel p-8 sm:p-10">
            <div className="flex items-center gap-2 mb-5">
              <span className={`w-2 h-2 rounded-full ${accentDot}`} />
              <p className="eyebrow text-white/60">Recommended for you</p>
            </div>
            <h2 className="font-display font-bold text-3xl sm:text-4xl tracking-[-0.02em]">
              {rec.title}
            </h2>
            <p className="mt-3 text-white/80 text-lg leading-relaxed max-w-xl">
              {rec.description}
            </p>
            <p className="mt-5 text-sm font-medium text-white/85 leading-relaxed max-w-xl">
              {rec.fitSummary}
            </p>
            {rec.confidence && (
              <div className="mt-5 inline-flex items-center gap-2.5 rounded-control border border-white/15 px-3 py-1.5">
                <span className="text-xs font-semibold text-white/60">Stream fit</span>
                <span className="w-1.5 h-1.5 rounded-full bg-brand-300" />
                <span className="font-ui font-bold text-white">{rec.confidence}%</span>
              </div>
            )}
          </div>
        </FadeIn>

        {/* Why it fits */}
        {rec.whyFits && (
          <div className="mt-10">
            <FadeIn>
              <h3 className="font-ui font-bold text-2xl text-ink">Why this fits you</h3>
              <p className="text-sm text-ink-3 mt-1">Based on your answers, not a generic category.</p>
            </FadeIn>
            <StaggerContainer className="mt-6 space-y-3">
              {rec.whyFits.map((item) => (
                <StaggerItem key={item.label}>
                  <div className="flex gap-4 bg-white border border-line rounded-[1.2rem] p-6 card-lift hover:border-brand-200">
                    <span className={`w-8 h-8 rounded-full ${accentChip} flex items-center justify-center shrink-0 mt-0.5 shadow-sm`}>
                      <Check className="w-4 h-4" strokeWidth={2.5} />
                    </span>
                    <div>
                      <h4 className="font-ui font-semibold text-ink">{item.label}</h4>
                      <p className="mt-1 text-sm text-ink-2 leading-relaxed">{item.copy}</p>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        )}

        {/* Key subjects involved */}
        {rec.keySubjects && rec.keySubjects.length > 0 && (
          <div className="mt-10">
            <FadeIn>
              <h3 className="font-ui font-bold text-2xl text-ink">Key subjects involved</h3>
              <p className="text-sm text-ink-3 mt-1">The core subjects this stream is built around.</p>
            </FadeIn>
            <div className="mt-5 flex flex-wrap gap-2">
              {rec.keySubjects.map((subject) => (
                <FadeIn key={subject} delay={0.04}>
                  <span className="inline-flex items-center gap-2 text-sm font-medium text-ink-2 bg-white border border-line rounded-full px-4 py-2 shadow-sm">
                    <BookOpen className="w-4 h-4 text-brand-500" />
                    {subject}
                  </span>
                </FadeIn>
              ))}
            </div>
          </div>
        )}

        {/* Future career opportunities */}
        {rec.futureCareers && rec.futureCareers.length > 0 && (
          <div className="mt-10">
            <FadeIn>
              <h3 className="font-ui font-bold text-2xl text-ink">Future career opportunities</h3>
              <p className="text-sm text-ink-3 mt-1">Where this stream can take you.</p>
            </FadeIn>
            <div className="mt-5 flex flex-wrap gap-2">
              {rec.futureCareers.map((career) => (
                <FadeIn key={career} delay={0.04}>
                  <span className="inline-flex items-center gap-2 text-sm font-medium text-brand-700 bg-brand-50 border border-brand-100 rounded-full px-4 py-2">
                    <TrendingUp className="w-4 h-4" />
                    {career}
                  </span>
                </FadeIn>
              ))}
            </div>
          </div>
        )}

        {/* Alternatives & trade-offs */}
        {rec.alternatives && (
          <div className="mt-10">
            <FadeIn>
              <h3 className="font-ui font-bold text-2xl text-ink">Worth weighing too</h3>
              <p className="text-sm text-ink-3 mt-1">Honest alternatives, so you are choosing rather than accepting.</p>
            </FadeIn>
            <div className="mt-6 grid sm:grid-cols-2 gap-4">
              {rec.alternatives.map((alt, i) => (
                <FadeIn key={alt.title} delay={0.06 * i}>
                  <div className="bg-white border border-line rounded-[1.4rem] p-6 h-full card-lift hover:border-brand-200">
                    <div className="flex items-center gap-2.5 mb-3">
                      <span className="w-8 h-8 rounded-control bg-brand-50 text-brand-700 flex items-center justify-center">
                        <Scale className="w-4 h-4" />
                      </span>
                      <h4 className="font-ui font-semibold text-ink">{alt.title}</h4>
                    </div>
                    <p className="text-sm text-ink-2 leading-relaxed mb-3">
                      <span className="font-medium text-success">Better for:</span> {alt.betterFor}
                    </p>
                    <p className="text-sm text-ink-2 leading-relaxed">
                      <span className="font-medium text-warning">The trade-off:</span> {alt.tradeoff}
                    </p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        )}

        {/* Entrance exams + colleges (Class 12 / stream data) */}
        {(rec.entranceExams || rec.topColleges) && (
          <div className="mt-10 grid sm:grid-cols-2 gap-4">
            {rec.entranceExams && (
              <FadeIn>
                <div className="h-full bg-white border border-line rounded-[1.4rem] p-7 card-lift hover:border-brand-200">
                  <div className="flex items-center gap-2.5 mb-4">
                    <span className="w-9 h-9 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center">
                      <FileText className="w-4 h-4" />
                    </span>
                    <h4 className="font-ui font-semibold text-ink">Entrance exams</h4>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {rec.entranceExams.map((exam) => (
                      <span key={exam} className="inline-flex items-center gap-1.5 text-xs font-medium text-ink-2 bg-paper border border-line rounded-control px-3 py-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-500" />
                        {exam}
                      </span>
                    ))}
                  </div>
                </div>
              </FadeIn>
            )}
            {rec.topColleges && (
              <FadeIn delay={0.05}>
                <div className="h-full bg-white border border-line rounded-[1.4rem] p-7 card-lift hover:border-brand-200">
                  <div className="flex items-center gap-2.5 mb-4">
                    <span className="w-9 h-9 rounded-control bg-brand-50 text-brand-700 flex items-center justify-center">
                      <GraduationCap className="w-4 h-4" />
                    </span>
                    <h4 className="font-ui font-semibold text-ink">Colleges worth researching</h4>
                  </div>
                  <ul className="space-y-2">
                    {rec.topColleges.map((college) => (
                      <li key={college} className="flex items-center gap-2.5 text-sm text-ink-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-300" />
                        {college}
                      </li>
                    ))}
                  </ul>
                </div>
              </FadeIn>
            )}
          </div>
        )}

        {/* Courses / recommendations */}
        {displayCourses && (
          <div className="mt-10">
            <FadeIn className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-brand-600" />
              <h3 className="font-ui font-bold text-2xl text-ink">Courses worth researching</h3>
            </FadeIn>
            <StaggerContainer className="mt-6 space-y-3">
              {displayCourses.map((course, index) => (
                <StaggerItem key={course.name}>
                  <div className="group bg-white border border-line rounded-[1.2rem] p-5 sm:p-6 card-lift hover:border-brand-200">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <span className={`w-9 h-9 rounded-control flex items-center justify-center font-display text-base ${accentChip}`}>{String(index + 1).padStart(2, '0')}</span>
                          <h4 className="font-ui font-semibold text-ink text-lg">{course.name}</h4>
                        </div>
                        {course.note && (
                          <p className="mt-1.5 text-sm text-ink-3">{course.note}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-5 sm:gap-6">
                        <div className="text-center">
                          <p className="text-[0.68rem] font-semibold text-ink-3">Fit</p>
                          <p className={`font-ui font-bold text-lg ${accentText}`}>{course.fit}%</p>
                        </div>
                        <div className="text-center">
                          <p className="text-[0.68rem] font-semibold text-ink-3">Growth</p>
                          <p className="font-ui font-bold text-lg text-success">{course.growth}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-[0.68rem] font-semibold text-ink-3">Salary</p>
                          <p className="font-ui font-bold text-sm text-ink">{course.salary}</p>
                        </div>
                        <button
                          onClick={() => handleAddToCompare(course)}
                          className="ml-1 w-9 h-9 rounded-lg border border-line text-ink-3 hover:text-brand-700 hover:border-brand-300 hover:bg-brand-50 flex items-center justify-center transition-colors"
                          aria-label={`Add ${course.name} to compare`}
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
            <FadeIn delay={0.1} className="mt-4 text-right">
              <Link to="/compare" className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-700 hover:text-brand-800">
                Open comparison <ArrowRight className="w-4 h-4" />
              </Link>
            </FadeIn>
          </div>
        )}

        {/* Graduate: Degree-specific ranked career directions */}
        {displayRecs && stageUserType === 'graduate' && (
          <div className="mt-10">
            <FadeIn className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-brand-600" />
              <h3 className="font-ui font-bold text-2xl text-ink">Your ranked career directions</h3>
            </FadeIn>
            <StaggerContainer className="mt-6 space-y-4">
              {displayRecs.map((item, i) => (
                <StaggerItem key={item.title}>
                  <div className="bg-white border border-line rounded-[1.4rem] p-6 sm:p-8 card-lift hover:border-brand-200">
                    <div className="flex items-center justify-between mb-4">
                      <span className={`text-xs font-bold rounded-control px-3 py-1 ${accentChip}`}>
                        #{i + 1} Best Match
                      </span>
                      <div className="flex items-center gap-1.5">
                        <Target className="w-4 h-4 text-brand-500" />
                        <span className="font-ui font-bold text-brand-600">{item.matchScore}%</span>
                        <span className="text-xs text-ink-3">match</span>
                      </div>
                    </div>
                    <h4 className="font-ui font-semibold text-ink text-xl">{item.title}</h4>
                    {item.whyItMatches && item.whyItMatches.length > 0 && (
                      <div className="mt-3 space-y-1.5">
                        {item.whyItMatches.map((reason) => (
                          <p key={reason} className="text-sm text-ink-2 flex items-start gap-2">
                            <Check className="w-4 h-4 text-success mt-0.5 shrink-0" />
                            {reason}
                          </p>
                        ))}
                      </div>
                    )}
                    {item.strongSkills && item.strongSkills.length > 0 && (
                      <div className="mt-4">
                        <p className="text-xs font-semibold text-success mb-2 flex items-center gap-1.5">
                          <Zap className="w-3.5 h-3.5" /> Your Strong Skills
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {item.strongSkills.map((skill) => (
                            <span key={skill} className="inline-flex items-center gap-1 text-xs font-medium text-success bg-green-50 border border-green-200 rounded-full px-2.5 py-1">
                              <Check className="w-3 h-3" /> {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {item.skillsToStrengthen && item.skillsToStrengthen.length > 0 && (
                      <div className="mt-3">
                        <p className="text-xs font-semibold text-warning mb-2 flex items-center gap-1.5">
                          <Target className="w-3.5 h-3.5" /> Skills to Strengthen
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {item.skillsToStrengthen.map((skill) => (
                            <span key={skill} className="inline-flex items-center gap-1 text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200 rounded-full px-2.5 py-1">
                              <ArrowRight className="w-3 h-3" /> {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        )}

        {/* Parent recommendations */}
        {rec.recommendations && stageUserType === 'parent' && (
          <div className="mt-10">
            <FadeIn>
              <h3 className="font-ui font-bold text-2xl text-ink">What to focus on</h3>
            </FadeIn>
            <StaggerContainer className="mt-6 grid sm:grid-cols-2 gap-4">
              {rec.recommendations.map((item) => (
                <StaggerItem key={item.title}>
                  <div className="bg-white border border-line rounded-[1.4rem] p-6 card-lift hover:border-brand-200">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-ui font-semibold text-ink">{item.title}</h4>
                      <span className={`text-xs font-semibold rounded-full px-2.5 py-1 ${
                        item.importance === 'High' ? accentChip : 'bg-paper-deep text-ink-2'
                      }`}>
                        {item.importance}
                      </span>
                    </div>
                    <p className="text-sm text-ink-2 leading-relaxed">{item.description}</p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        )}

        {/* Tips */}
        {rec.tips && (
          <div className="mt-12">
            <FadeIn>
              <h3 className="font-ui font-bold text-2xl text-ink">Advice worth keeping</h3>
            </FadeIn>
            <div className="mt-6 bg-white border border-line rounded-[1.6rem] p-7 sm:p-8">
              <ul className="space-y-4">
                {rec.tips.map((tip, i) => (
                  <FadeIn key={tip} delay={0.05 * i}>
                    <li className="flex items-start gap-4">
                      <span className="w-7 h-7 rounded-full bg-brand-600 text-white flex items-center justify-center font-ui font-bold text-xs shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <span className="text-[0.95rem] text-ink-2 leading-relaxed">{tip}</span>
                    </li>
                  </FadeIn>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Matching Higher Education Institutions */}
        {matchingColleges.length > 0 && (
          <div className="mt-14">
            <FadeIn>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-800 text-xs font-semibold mb-2">
                    <Building2 className="w-3.5 h-3.5 text-blue-600" />
                    <span>Verified Hyderabad & Indian Institutions</span>
                  </div>
                  <h3 className="font-ui font-bold text-2xl text-ink">Colleges Matching Your Profile</h3>
                  <p className="text-sm text-ink-2 mt-1">
                    Accredited institutions offering degrees aligned with your career direction.
                  </p>
                </div>
                <Link
                  to="/colleges"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800 shrink-0"
                >
                  <span>Explore All Institutions</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </FadeIn>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {matchingColleges.slice(0, 4).map((inst) => (
                <CollegeCard key={inst.id} institution={inst} />
              ))}
            </div>
          </div>
        )}

        {/* AI Career Advisor */}
        <AICareerAdvisor userType={userType} />

        {/* Actions */}
        <FadeIn delay={0.2} className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-3 border-t border-line pt-10">
          <Button size="lg" fullWidth className="sm:w-auto" onClick={handleSaveToDashboard}>
            Save to dashboard
            <ArrowRight className="w-4 h-4" />
          </Button>
          <Link to="/advisor" className="w-full sm:w-auto">
            <Button size="lg" variant="secondary" fullWidth className="sm:w-auto">
              <MessageCircle className="w-4 h-4" />
              Ask a follow-up
            </Button>
          </Link>
        </FadeIn>
      </div>
    </div>
    </ResultGate>
  );
}
