import { useState, useId } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GraduationCap,
  Briefcase,
  Layers,
  ArrowRight,
  GitFork,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Compass,
  BookOpen,
  ChevronRight,
  Info,
  Scale
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const PATHWAY_DATA = {
  class10: {
    stageLabel: 'Class 10 Completed',
    subtitle: 'Stream Selection & Foundation Building',
    description: 'Decide your 10+2 academic combination based on subject affinity, long-term flexibility, and entrance criteria.',
    options: [
      {
        id: 'mpc',
        title: 'MPC (Maths, Physics, Chemistry)',
        badge: 'Technical & Engineering Track',
        duration: '2 Years (Class 11 & 12)',
        prerequisites: 'Minimum 50% in Class 10 with Mathematics and Science.',
        eligibilityStatus: 'Verified · Core Pre-Engineering',
        degrees: [
          {
            name: 'B.Tech / B.E. (Engineering)',
            duration: '4 Years',
            specialisations: ['Computer Science & AI', 'Electronics & VLSI', 'Data Science', 'Mechanical & Robotics'],
            skills: ['Calculus & Linear Algebra', 'Programming Logic (Python/C++)', 'Physics Modeling', 'Problem Decomposition'],
            careers: ['Software Engineer', 'Robotics Systems Architect', 'VLSI Design Engineer', 'Data Scientist'],
            exams: ['JEE Main', 'JEE Advanced', 'TS EAMCET', 'BITSAT'],
            alternatives: ['Polytechnic Diploma (Lateral Entry to 2nd year B.Tech)', 'B.Sc Computing & Data Science', 'Integrated BS-MS (IISER)']
          },
          {
            name: 'B.Arch (Architecture)',
            duration: '5 Years',
            specialisations: ['Sustainable Urban Design', 'Interior Architecture', 'Landscape Architecture', 'BIM Modeling'],
            skills: ['Spatial Visualization', 'AutoCAD / Revit', 'Freehand Drafting', 'Structural Principles'],
            careers: ['Licensed Architect', 'Urban Planner', 'BIM Specialist', 'Computational Designer'],
            exams: ['NATA', 'JEE Main Paper 2'],
            alternatives: ['Diploma in Architectural Assistantship', 'B.Des Interior Design']
          },
          {
            name: 'BS-MS Dual Degree / Research',
            duration: '5 Years',
            specialisations: ['Theoretical Physics', 'Applied Mathematics', 'Computational Chemistry', 'Materials Science'],
            skills: ['Scientific Method', 'Advanced Statistical Inference', 'Laboratory Instrumentation', 'Technical Writing'],
            careers: ['Research Scientist', 'Quantitative Analyst', 'Laboratory Director', 'Academic Professor'],
            exams: ['IAT (IISER Aptitude Test)', 'JEE Advanced'],
            alternatives: ['B.Sc (Hons) with subsequent Master’s', 'Integrated Ph.D pathways']
          }
        ]
      },
      {
        id: 'bipc',
        title: 'BiPC (Biology, Physics, Chemistry)',
        badge: 'Healthcare & Life Sciences Track',
        duration: '2 Years (Class 11 & 12)',
        prerequisites: 'Minimum 50% in Class 10 with Science/Biology.',
        eligibilityStatus: 'Verified · Medical & Allied Core',
        degrees: [
          {
            name: 'MBBS / BDS (Medicine & Dental)',
            duration: '5.5 Years (including internship)',
            specialisations: ['General Medicine', 'Surgery', 'Pediatrics', 'Maxillofacial Surgery'],
            skills: ['Clinical Anatomy & Pathology', 'Diagnostic Reasoning', 'Patient Empathy', 'Surgical Dexterity'],
            careers: ['Physician', 'Surgeon', 'Medical Officer', 'Public Health Director'],
            exams: ['NEET-UG (National Eligibility cum Entrance Test)'],
            alternatives: ['B.Sc Allied Health Sciences (Cardiology/Radiology Tech)', 'B.P.T. (Physiotherapy)', 'B.V.Sc (Veterinary Sciences)']
          },
          {
            name: 'B.Pharm / Pharm.D (Pharmacy)',
            duration: '4 – 6 Years',
            specialisations: ['Clinical Pharmacology', 'Pharmaceutical Chemistry', 'Regulatory Affairs', 'Drug Formulation'],
            skills: ['Medicinal Chemistry', 'Clinical Trials Governance', 'Quality Control', 'Pharmacokinetics'],
            careers: ['Clinical Pharmacist', 'Drug Safety Associate', 'Regulatory Affairs Specialist', 'Formulation Scientist'],
            exams: ['TS EAPCET', 'NEET-UG', 'GPAT (for PG)'],
            alternatives: ['B.Sc Biotechnology', 'B.Sc Industrial Chemistry', 'M.Sc Clinical Research']
          },
          {
            name: 'B.Sc Biotechnology / Life Sciences',
            duration: '3 – 4 Years',
            specialisations: ['Genomics & CRISPR', 'Microbiology', 'Bioinformatics', 'Immunology'],
            skills: ['Gene Sequencing Protocols', 'Python for Bioinformatics', 'Cell Culture Techniques', 'Assay Validation'],
            careers: ['Biotech Research Associate', 'Bioinformatician', 'Quality Assurance Specialist', 'Genetic Counselor'],
            exams: ['CUET-UG', 'State University Entrance Exams'],
            alternatives: ['B.Tech Biotechnology (with Maths bridge)', 'Agricultural Sciences (B.Sc Agri)']
          }
        ]
      },
      {
        id: 'commerce',
        title: 'Commerce (Accounts, Economics, Business)',
        badge: 'Finance & Enterprise Track',
        duration: '2 Years (Class 11 & 12)',
        prerequisites: 'Class 10 completion (Maths recommended for MEC/Finance).',
        eligibilityStatus: 'Verified · Corporate & Finance',
        degrees: [
          {
            name: 'B.Com (Hons) / B.Com Professional',
            duration: '3 – 4 Years',
            specialisations: ['Accounting & Taxation', 'Financial Markets', 'Banking & Insurance', 'FinTech Analytics'],
            skills: ['Double-Entry Ledger Accounting', 'Financial Statements Analysis', 'Corporate Tax Law', 'Advanced Excel'],
            careers: ['Chartered Accountant (via ICAI)', 'Investment Analyst', 'Statutory Auditor', 'Financial Controller'],
            exams: ['ICAI CA Foundation', 'CUET-UG', 'Institutional Merit'],
            alternatives: ['ACCA (UK Qualification) integration', 'CMA (Cost & Management Accounting)', 'CS (Company Secretary)']
          },
          {
            name: 'BBA / IPM (Management Studies)',
            duration: '3 – 5 Years (IPM Integrated)',
            specialisations: ['Strategy & Operations', 'Marketing Management', 'Digital Enterprise', 'Human Capital'],
            skills: ['Market Research', 'Operational Workflows', 'Business Communication', 'Quantitative Analysis'],
            careers: ['Management Consultant', 'Product Operations Associate', 'Brand Strategist', 'Business Development Lead'],
            exams: ['IPMAT (IIM Indore/Rohtak)', 'JIPMAT', 'SET', 'CUET-UG'],
            alternatives: ['BMS (Bachelor of Management Studies)', 'Direct MBA after B.Com/B.Sc']
          }
        ]
      },
      {
        id: 'polytechnic',
        title: 'Polytechnic Diploma (Lateral Entry Track)',
        badge: 'Applied Vocational & Technical',
        duration: '3 Years Diploma',
        prerequisites: 'Class 10 pass with minimum 35-50% in Maths & Science.',
        eligibilityStatus: 'Verified · Applied Engineering Pathway',
        degrees: [
          {
            name: 'Diploma in Engineering (CSE / ECE / Mech / Civil)',
            duration: '3 Years (leads directly to 2nd Year B.Tech)',
            specialisations: ['Computer Engineering', 'Automobile Engineering', 'Civil Infrastructure', 'Electronics & Communication'],
            skills: ['Hands-on Lab Instrumentation', 'CAD Drafting', 'Microcontroller Wiring', 'Applied Fabrication'],
            careers: ['Junior Systems Engineer', 'Technical Supervisor', 'Drafting Specialist', 'Site Maintenance Lead'],
            exams: ['POLYCET (State Polytechnic Common Entrance Test)', 'TS ECET (for B.Tech Lateral)'],
            alternatives: ['Direct industry employment as Junior Engineer', 'B.Voc (Bachelor of Vocational Studies)']
          }
        ]
      }
    ]
  },

  class12_mpc: {
    stageLabel: 'Class 12 MPC (STEM / Tech)',
    subtitle: 'Undergraduate Degree Options & Career Trajectories',
    description: 'Explore undergraduate engineering, physical sciences, computing, and emerging interdisciplinary fields.',
    options: [
      {
        id: 'btech_cse',
        title: 'B.Tech Computer Science & AI',
        badge: 'Software Systems & AI Track',
        duration: '4 Years',
        prerequisites: 'Minimum 50% in 10+2 with Physics, Mathematics & Chemistry.',
        eligibilityStatus: 'Verified · High Demand',
        degrees: [
          {
            name: 'B.Tech CSE / AI & ML',
            duration: '4 Years (8 Semesters)',
            specialisations: ['Distributed Systems & Cloud', 'Deep Learning & NLP', 'Full-Stack Software Architecture', 'Cybersecurity & Cryptography'],
            skills: ['Data Structures & Algorithms', 'Python / Go / TypeScript', 'Docker & Kubernetes', 'System Design & APIs'],
            careers: ['Full-Stack Software Engineer', 'AI / ML Research Engineer', 'Cloud Infrastructure Engineer', 'Site Reliability Engineer'],
            exams: ['JEE Main', 'JEE Advanced', 'TS EAMCET', 'BITSAT', 'VITEEE'],
            alternatives: ['B.Sc Computer Science / Data Science (3-4 Years)', 'BCA with subsequent MCA at top NITs', 'B.Tech Data Engineering']
          }
        ]
      },
      {
        id: 'btech_ece',
        title: 'B.Tech Electronics & Communication (ECE / VLSI)',
        badge: 'Hardware & Semiconductor Track',
        duration: '4 Years',
        prerequisites: 'Minimum 50% in 10+2 with PCM.',
        eligibilityStatus: 'Verified · Core Technology',
        degrees: [
          {
            name: 'B.Tech ECE & Microelectronics',
            duration: '4 Years',
            specialisations: ['VLSI Chip Design', 'Embedded IoT Systems', '5G Communications', 'Robotics & Control Systems'],
            skills: ['Verilog / VHDL', 'Digital Signal Processing', 'PCB Layout & Schematics', 'C/C++ for Microcontrollers'],
            careers: ['ASIC / FPGA Design Engineer', 'Embedded Firmware Developer', 'RF Systems Specialist', 'Hardware Test Engineer'],
            exams: ['JEE Main', 'JEE Advanced', 'TS EAMCET'],
            alternatives: ['B.Tech Mechatronics', 'B.Tech Electrical & Electronics (EEE)']
          }
        ]
      },
      {
        id: 'btech_core',
        title: 'B.Tech Mechanical / Civil / Aerospace',
        badge: 'Infrastructure & Heavy Engineering Track',
        duration: '4 Years',
        prerequisites: 'Minimum 50% in 10+2 with PCM.',
        eligibilityStatus: 'Verified · Core Industrial Engineering',
        degrees: [
          {
            name: 'B.Tech Mechanical / Civil / Aerospace',
            duration: '4 Years',
            specialisations: ['Computational Fluid Dynamics (CFD)', 'Structural Finite Element Analysis', 'Renewable Energy Systems', 'Smart Manufacturing'],
            skills: ['SolidWorks / ANSYS', 'Thermodynamics Modeling', 'Structural Mechanics', 'MATLAB / Simulink'],
            careers: ['Aerospace Design Engineer', 'Structural Consulting Engineer', 'Automotive R&D Specialist', 'Project Construction Manager'],
            exams: ['JEE Main', 'JEE Advanced', 'TS EAMCET', 'AERO CET'],
            alternatives: ['B.Des Product / Industrial Design', 'M.Tech via GATE', 'Public Sector Undertakings (PSU) via GATE']
          }
        ]
      }
    ]
  },

  class12_bipc: {
    stageLabel: 'Class 12 BiPC (Healthcare / Sciences)',
    subtitle: 'Clinical, Pharmacy & Allied Healthcare Tracks',
    description: 'Discover medical clinical careers, pharmaceutical research, bio-manufacturing, and clinical diagnostic fields.',
    options: [
      {
        id: 'mbbs_bds',
        title: 'Clinical Medicine (MBBS / BDS)',
        badge: 'Direct Clinical Healthcare',
        duration: '5.5 Years',
        prerequisites: 'Minimum 50% in 10+2 with PCB (40% for reserved categories) and qualifying NEET-UG.',
        eligibilityStatus: 'Verified · Regulated by NMC',
        degrees: [
          {
            name: 'Bachelor of Medicine & Surgery (MBBS)',
            duration: '4.5 Years Academic + 1 Year Mandatory Rotary Internship',
            specialisations: ['Internal Medicine (MD)', 'General Surgery (MS)', 'Pediatrics', 'Radiology', 'Cardiology'],
            skills: ['Clinical Examination', 'Pharmacotherapy', 'Patient Diagnostic Workup', 'Emergency Triaging'],
            careers: ['Licensed Physician', 'Surgeon Specialist', 'Clinical Researcher', 'Hospital Superintendent'],
            exams: ['NEET-UG (Mandatory nationwide)', 'NExT (National Exit Test for licensing & PG)'],
            alternatives: ['BDS (Dental Surgery)', 'BAMS / BHMS (Ayush Systems)', 'B.Sc Anesthesia & OT Technology']
          }
        ]
      },
      {
        id: 'pharm_biotech',
        title: 'Pharmacy & Drug Sciences (Pharm.D / B.Pharm)',
        badge: 'Therapeutics & Clinical Trials',
        duration: '4 – 6 Years',
        prerequisites: '10+2 with Physics, Chemistry & Biology/Mathematics (min 50%).',
        eligibilityStatus: 'Verified · PCI Regulated',
        degrees: [
          {
            name: 'Doctor of Pharmacy (Pharm.D) / B.Pharm',
            duration: 'Pharm.D: 6 Years | B.Pharm: 4 Years',
            specialisations: ['Clinical Pharmacokinetics', 'Pharmacovigilance', 'Industrial Formulation', 'Regulatory Dossier Submission'],
            skills: ['Adverse Drug Event Reporting', 'Bio-analytical Validation', 'GMP Compliance', 'Dosage Form Design'],
            careers: ['Clinical Research Associate (CRA)', 'Drug Safety Officer', 'Formulation Scientist', 'Medical Science Liaison (MSL)'],
            exams: ['TS EAPCET', 'NEET-UG', 'GPAT'],
            alternatives: ['B.Sc Clinical Nutrition', 'B.Sc Medical Laboratory Technology (MLT)']
          }
        ]
      }
    ]
  },

  class12_commerce: {
    stageLabel: 'Class 12 Commerce & Arts',
    subtitle: 'Finance, Corporate Governance, Law & Creative Enterprise',
    description: 'Pathways across accounting, wealth management, corporate litigation, public policy, and product design.',
    options: [
      {
        id: 'chartered_finance',
        title: 'Professional Accounting & Finance (CA / B.Com / CFA)',
        badge: 'Capital Markets & Audit',
        duration: '3 – 5 Years',
        prerequisites: 'Class 12 pass in any stream (Commerce or Maths preferred).',
        eligibilityStatus: 'Verified · Professional Qualification',
        degrees: [
          {
            name: 'ICAI Chartered Accountancy (CA) + B.Com',
            duration: '4.5 – 5 Years (Concurrent with Degree)',
            specialisations: ['Statutory & Internal Audit', 'Corporate Taxation & GST', 'Mergers & Acquisitions', 'Forensic Accounting'],
            skills: ['Accounting Standards (Ind-AS/IFRS)', 'Tax Compliance Filing', 'Financial Auditing Standards', 'Corporate Law Advisory'],
            careers: ['Chartered Accountant (FCA)', 'Chief Financial Officer (CFO)', 'Tax Partner', 'Valuation Specialist'],
            exams: ['ICAI CA Foundation', 'ICAI Intermediate', 'CUET-UG for B.Com'],
            alternatives: ['CFA (Chartered Financial Analyst)', 'US CPA / CMA', 'ACCA (Global Chartered Accounting)']
          }
        ]
      },
      {
        id: 'law_humanities',
        title: 'Integrated Law (5-Year B.A. LL.B. / B.Com LL.B.)',
        badge: 'Jurisprudence & Corporate Law',
        duration: '5 Years Integrated',
        prerequisites: 'Minimum 45% in Class 12 from any recognized board.',
        eligibilityStatus: 'Verified · Bar Council of India (BCI)',
        degrees: [
          {
            name: '5-Year Integrated B.A. LL.B. (Hons)',
            duration: '5 Years (10 Semesters)',
            specialisations: ['Corporate & Commercial Law', 'Intellectual Property (IPR)', 'Constitutional & Criminal Litigation', 'Tech & Data Privacy Law'],
            skills: ['Legal Drafting & Briefs', 'Moot Court Advocacy', 'Contract Negotiation', 'Statutory Interpretation'],
            careers: ['Corporate In-House Counsel', 'Litigation Advocate', 'Judicial Magistrate (via PCS-J)', 'IPR Consultant'],
            exams: ['CLAT (Common Law Admission Test - NLUs)', 'AILET (NLU Delhi)', 'TS LAWCET'],
            alternatives: ['3-Year LL.B. after Graduation', 'Company Secretary (CS) + Law', 'Public Policy Masters (MPP)']
          }
        ]
      }
    ]
  },

  undergraduate: {
    stageLabel: 'Undergraduate Degree Holders',
    subtitle: 'Postgraduate Specialisation & Advanced Industry Roles',
    description: 'Navigate postgraduate master’s, global research, MBA leadership, or direct competitive entry routes.',
    options: [
      {
        id: 'postgrad_tech',
        title: 'M.Tech / MS Abroad (Technical Mastery)',
        badge: 'Advanced R&D & Systems',
        duration: '2 Years',
        prerequisites: 'B.Tech / B.E. / B.Sc+MCA in relevant discipline with min 60% / 6.5 CGPA.',
        eligibilityStatus: 'Verified · Master’s Level',
        degrees: [
          {
            name: 'M.Tech / M.S. in Computer Science & AI',
            duration: '2 Years (Thesis or Coursework)',
            specialisations: ['Generative AI & Foundation Models', 'Distributed Cloud Architecture', 'Quantum Computing', 'Autonomous Robotics'],
            skills: ['PyTorch / JAX', 'Research Paper Authorship', 'Distributed Concurrency', 'Kernel Optimization'],
            careers: ['Principal AI Scientist', 'System Architect', 'R&D Director', 'Tenure-track Professor'],
            exams: ['GATE (for IITs/NITs)', 'GRE + TOEFL/IELTS (for MS abroad)'],
            alternatives: ['Direct Ph.D from B.Tech (Prime Minister’s Research Fellows - PMRF)', 'Specialized PG Diplomas (CDAC)']
          }
        ]
      },
      {
        id: 'postgrad_mba',
        title: 'MBA / Post Graduate Diploma in Management (PGDM)',
        badge: 'Leadership & Corporate Strategy',
        duration: '2 Years',
        prerequisites: 'Bachelor’s degree in any discipline with min 50% marks.',
        eligibilityStatus: 'Verified · Management Track',
        degrees: [
          {
            name: 'Master of Business Administration (MBA / PGDM)',
            duration: '2 Years Full-Time',
            specialisations: ['Product Management', 'Management Consulting', 'Investment Banking', 'Operations & Supply Chain'],
            skills: ['Strategic Decision-Making', 'P&L Financial Modeling', 'Executive Presentation', 'Cross-functional Leadership'],
            careers: ['Product Manager', 'Engagement Manager (McKinsey/BCG)', 'Investment Banker (Goldman Sachs)', 'Chief Operating Officer'],
            exams: ['CAT (Common Admission Test - IIMs)', 'XAT (XLRI)', 'GMAT / GRE'],
            alternatives: ['Executive MBA (with 3-5 years work experience)', 'Specialized Master’s in Business Analytics']
          }
        ]
      }
    ]
  }
};

export default function CareerPathwayMap({ defaultStage = 'class10' }) {
  const [selectedStageKey, setSelectedStageKey] = useState(defaultStage);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(0);
  const [selectedDegreeIndex, setSelectedDegreeIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('overview'); // overview | prerequisites | alternatives

  const currentStage = PATHWAY_DATA[selectedStageKey] || PATHWAY_DATA.class10;
  const currentOption = currentStage.options[selectedOptionIndex] || currentStage.options[0];
  const currentDegree = currentOption.degrees[selectedDegreeIndex] || currentOption.degrees[0];

  const handleStageChange = (key) => {
    setSelectedStageKey(key);
    setSelectedOptionIndex(0);
    setSelectedDegreeIndex(0);
  };

  const handleOptionChange = (idx) => {
    setSelectedOptionIndex(idx);
    setSelectedDegreeIndex(0);
  };

  return (
    <div className="w-full bg-white border border-line rounded-panel overflow-hidden shadow-card" aria-label="Interactive Career Pathway Map">
      {/* ── Top Bar: Education Stage Switcher ────────────────── */}
      <div className="bg-paper-subtle border-b border-line px-5 py-4 sm:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-brand-700">
              <Compass className="w-3.5 h-3.5" aria-hidden="true" />
              Interactive Pathway Explorer
            </span>
            <h3 className="font-ui font-bold text-lg sm:text-xl text-ink mt-0.5">
              Chart Your Education Trajectory
            </h3>
          </div>
          <div className="flex items-center gap-2 text-xs text-ink-3">
            <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              Verified Criteria
            </span>
            <span className="hidden sm:inline">|</span>
            <span className="hidden sm:inline">Independent Data</span>
          </div>
        </div>

        {/* Stage selection pills */}
        <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none" role="tablist" aria-label="Education stages">
          {[
            { key: 'class10', label: 'Class 10 Completed', short: 'Class 10' },
            { key: 'class12_mpc', label: 'Class 12 MPC (STEM)', short: 'Class 12 MPC' },
            { key: 'class12_bipc', label: 'Class 12 BiPC (Healthcare)', short: 'Class 12 BiPC' },
            { key: 'class12_commerce', label: 'Class 12 Commerce & Arts', short: 'Class 12 Comm/Arts' },
            { key: 'undergraduate', label: 'Undergraduate Degree', short: 'College / Degree' },
          ].map((stage) => {
            const isActive = selectedStageKey === stage.key;
            return (
              <button
                key={stage.key}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => handleStageChange(stage.key)}
                className={`shrink-0 px-3.5 py-2 rounded-control text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${
                  isActive
                    ? 'bg-brand-600 text-white shadow-xs'
                    : 'bg-white text-ink-2 hover:text-ink hover:bg-paper border border-line'
                }`}
              >
                <span>{stage.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Stage Description Strip ───────────────────────────── */}
      <div className="bg-brand-50/50 border-b border-brand-100/60 px-5 sm:px-8 py-3 text-xs sm:text-sm text-ink-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <p>
          <strong className="text-ink font-semibold">{currentStage.stageLabel}:</strong> {currentStage.description}
        </p>
        <span className="text-xs text-brand-700 font-medium shrink-0">
          {currentStage.options.length} Stream Track{currentStage.options.length > 1 ? 's' : ''} Available
        </span>
      </div>

      {/* ── Main Pathway Body ──────────────────────────────────── */}
      <div className="p-5 sm:p-8">
        {/* Stream / Field Cards selector */}
        <div className="mb-6">
          <label className="block text-xs font-bold text-ink-3 uppercase tracking-wider mb-2.5">
            1. Select Academic Stream / Track
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {currentStage.options.map((opt, idx) => {
              const isSelected = selectedOptionIndex === idx;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => handleOptionChange(idx)}
                  className={`text-left p-4 rounded-card border transition-all cursor-pointer flex flex-col justify-between focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${
                    isSelected
                      ? 'border-brand-500 bg-brand-50/40 ring-1 ring-brand-500 shadow-xs'
                      : 'border-line bg-white hover:border-brand-200 hover:bg-paper'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="text-[11px] font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded-full border border-brand-100">
                        {opt.badge}
                      </span>
                      <span className="text-xs text-ink-3">{opt.duration}</span>
                    </div>
                    <h4 className="font-ui font-bold text-sm sm:text-base text-ink">{opt.title}</h4>
                  </div>
                  <div className="mt-3 pt-2.5 border-t border-line/60 flex items-center justify-between text-xs">
                    <span className="text-ink-3">{opt.degrees.length} Degree Option{opt.degrees.length > 1 ? 's' : ''}</span>
                    <span className={`font-semibold flex items-center gap-1 ${isSelected ? 'text-brand-600' : 'text-ink-3'}`}>
                      {isSelected ? 'Selected' : 'Explore'}
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Degree selection if multiple */}
        {currentOption.degrees.length > 1 && (
          <div className="mb-6 pt-2">
            <label className="block text-xs font-bold text-ink-3 uppercase tracking-wider mb-2">
              2. Select Degree Programme
            </label>
            <div className="flex flex-wrap gap-2">
              {currentOption.degrees.map((deg, dIdx) => (
                <button
                  key={deg.name}
                  type="button"
                  onClick={() => setSelectedDegreeIndex(dIdx)}
                  className={`px-3.5 py-2 rounded-control text-xs sm:text-sm font-semibold transition-all cursor-pointer border ${
                    selectedDegreeIndex === dIdx
                      ? 'bg-ink text-white border-ink shadow-xs'
                      : 'bg-white text-ink-2 border-line hover:border-brand-300 hover:text-ink'
                  }`}
                >
                  {deg.name}
                  <span className="ml-1.5 text-xs opacity-70">({deg.duration})</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Pathway Flow Visual Nodes (Current Degree Node Detail) ── */}
        <div className="bg-paper border border-line rounded-card p-5 sm:p-6 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-line">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-brand-500 text-white flex items-center justify-center shrink-0">
                <GraduationCap className="w-4 h-4" />
              </span>
              <div>
                <h4 className="font-ui font-bold text-base sm:text-lg text-ink">
                  {currentDegree.name}
                </h4>
                <p className="text-xs text-ink-3">Standard Duration: {currentDegree.duration}</p>
              </div>
            </div>

            {/* View tabs inside node */}
            <div className="flex items-center gap-1 bg-white border border-line p-1 rounded-control">
              <button
                type="button"
                onClick={() => setActiveTab('overview')}
                className={`px-3 py-1 rounded text-xs font-semibold cursor-pointer transition-colors ${
                  activeTab === 'overview' ? 'bg-brand-50 text-brand-700' : 'text-ink-2 hover:text-ink'
                }`}
              >
                Overview & Skills
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('prerequisites')}
                className={`px-3 py-1 rounded text-xs font-semibold cursor-pointer transition-colors ${
                  activeTab === 'prerequisites' ? 'bg-brand-50 text-brand-700' : 'text-ink-2 hover:text-ink'
                }`}
              >
                Eligibility & Entrance
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('alternatives')}
                className={`px-3 py-1 rounded text-xs font-semibold cursor-pointer transition-colors ${
                  activeTab === 'alternatives' ? 'bg-brand-50 text-brand-700' : 'text-ink-2 hover:text-ink'
                }`}
              >
                Alternative Pathways
              </button>
            </div>
          </div>

          <div className="pt-5">
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* Specialisations */}
                <div className="bg-white border border-line rounded-xl p-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-ink-3 uppercase tracking-wider mb-3">
                    <Layers className="w-4 h-4 text-brand-600" />
                    Specialisation Areas
                  </div>
                  <ul className="space-y-2">
                    {currentDegree.specialisations.map((spec) => (
                      <li key={spec} className="text-xs sm:text-sm text-ink flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-1.5 shrink-0" />
                        <span>{spec}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Core Practical Skills */}
                <div className="bg-white border border-line rounded-xl p-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-ink-3 uppercase tracking-wider mb-3">
                    <Sparkles className="w-4 h-4 text-teal-600" />
                    Core Practical Skills
                  </div>
                  <ul className="space-y-2">
                    {currentDegree.skills.map((skill) => (
                      <li key={skill} className="text-xs sm:text-sm text-ink flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 mt-0.5 shrink-0" />
                        <span>{skill}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Target Career Roles */}
                <div className="bg-white border border-line rounded-xl p-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-ink-3 uppercase tracking-wider mb-3">
                    <Briefcase className="w-4 h-4 text-brand-700" />
                    Career Trajectories
                  </div>
                  <ul className="space-y-2">
                    {currentDegree.careers.map((career) => (
                      <li key={career} className="text-xs sm:text-sm text-ink font-medium flex items-start gap-2">
                        <ArrowRight className="w-3.5 h-3.5 text-brand-600 mt-0.5 shrink-0" />
                        <span>{career}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'prerequisites' && (
              <div className="bg-white border border-line rounded-xl p-5 space-y-4">
                <div>
                  <h5 className="font-ui font-bold text-sm text-ink mb-1">Academic Prerequisites</h5>
                  <p className="text-xs sm:text-sm text-ink-2 leading-relaxed">
                    {currentOption.prerequisites}
                  </p>
                </div>
                <div className="border-t border-line/70 pt-4">
                  <h5 className="font-ui font-bold text-sm text-ink mb-2">Key Entrance Examinations</h5>
                  <div className="flex flex-wrap gap-2">
                    {currentDegree.exams.map((exam) => (
                      <span key={exam} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-control bg-paper border border-line text-xs font-semibold text-ink">
                        <BookOpen className="w-3.5 h-3.5 text-brand-600" />
                        {exam}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="border-t border-line/70 pt-4 flex items-start gap-2 text-xs text-ink-3">
                  <Info className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
                  <span>
                    Eligibility benchmarks represent baseline qualification criteria. Admission cutoffs, reservation quotas, and seat allocations are determined officially by regulatory and examination authorities each year.
                  </span>
                </div>
              </div>
            )}

            {activeTab === 'alternatives' && (
              <div className="bg-white border border-line rounded-xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <GitFork className="w-4 h-4 text-teal-600" />
                  <h5 className="font-ui font-bold text-sm text-ink">Parallel & Bridge Options</h5>
                </div>
                <p className="text-xs sm:text-sm text-ink-2 mb-4">
                  No single degree closes every door. These adjacent tracks allow lateral entry, parallel qualification, or bridge transfers:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {currentDegree.alternatives.map((alt) => (
                    <div key={alt} className="p-3 bg-paper rounded-lg border border-line flex items-start gap-2 text-xs sm:text-sm text-ink">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-600 mt-2 shrink-0" />
                      <span>{alt}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Verified Transparency Notice & Non-Guarantee Disclaimer ─ */}
        <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/80 text-amber-950 flex items-start gap-3 text-xs leading-relaxed">
          <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <strong className="font-semibold text-amber-900 block mb-0.5">
              Consultancy Governance & Verification Disclaimer:
            </strong>
            NAVORA pathways synthesize verified curriculum structures, national entrance mechanisms, and institutional eligibility guidelines.
            Exploring a pathway does not guarantee admission to any college or guarantee employment in any role. Always confirm specific year cutoffs and eligibility mandates directly with official university admission boards.
          </div>
        </div>

        {/* Action Link to Assessment */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 pt-5 border-t border-line">
          <p className="text-xs sm:text-sm text-ink-3">
            Want to see which pathway aligns best with your specific subject comfort and priorities?
          </p>
          <Link
            to="/get-started"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs sm:text-sm font-semibold px-5 py-2.5 transition-colors shadow-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
          >
            Take 2-Min Assessment
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

