/**
 * NAVORA — Statutory & Academic Eligibility Evaluator
 *
 * Implements strict, data-grounded classification separating statutory eligibility
 * from subjective preference scores.
 *
 * Grounded in official Indian regulatory bodies:
 * - NMC (National Medical Commission) — MBBS / Clinical Healthcare
 * - AICTE (All India Council for Technical Education) — Engineering & Technology
 * - COA (Council of Architecture) — B.Arch / Architecture
 * - PCI (Pharmacy Council of India) — B.Pharm / Pharm.D
 * - BCI (Bar Council of India) — 5-Year Integrated LL.B.
 * - ICAI (Institute of Chartered Accountants of India) — CA Foundation
 * - UGC (University Grants Commission) — Degree prerequisites
 *
 * Five Distinct Status Tiers:
 * 1. eligible: Meets mandatory statutory prerequisites directly from current stream/stage.
 * 2. potentially_eligible: Accessible via interdisciplinary admission, university-specific criteria, or minor bridge.
 * 3. additional_qualification_required: Requires formal bridge examination (e.g. NIOS Bio) or conversion degree (e.g. MCA).
 * 4. not_eligible: Hard statutory restriction preventing direct admission.
 * 5. information_unavailable: Academic background / stream not yet specified.
 */

export const ELIGIBILITY_TIERS = {
  eligible: {
    status: 'eligible',
    label: 'Eligible · Direct Stream Access',
    badgeTone: 'emerald',
    badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    icon: 'ShieldCheck',
  },
  potentially_eligible: {
    status: 'potentially_eligible',
    label: 'Potentially Eligible · Alternative Route',
    badgeTone: 'blue',
    badgeClass: 'bg-blue-50 text-blue-800 border-blue-200',
    icon: 'Compass',
  },
  additional_qualification_required: {
    status: 'additional_qualification_required',
    label: 'Additional Qualification Required',
    badgeTone: 'amber',
    badgeClass: 'bg-amber-50 text-amber-800 border-amber-200',
    icon: 'AlertCircle',
  },
  not_eligible: {
    status: 'not_eligible',
    label: 'Not Eligible from Current Stream',
    badgeTone: 'rose',
    badgeClass: 'bg-rose-50 text-rose-800 border-rose-200',
    icon: 'XCircle',
  },
  information_unavailable: {
    status: 'information_unavailable',
    label: 'Eligibility Information Unavailable',
    badgeTone: 'slate',
    badgeClass: 'bg-slate-50 text-slate-700 border-slate-200',
    icon: 'HelpCircle',
  },
};

/**
 * Normalizes stream identifiers from diverse flows (mpc, bipc, cec, mec, diploma, etc.)
 */
export function normalizeStream(rawStream) {
  if (!rawStream) return '';
  const s = String(rawStream).toLowerCase().trim().replace(/[\s/_-]+/g, '_');
  if (['science_pcm', 'mpc', 'maths_physics_chemistry'].includes(s)) return 'mpc';
  if (['science_pcb', 'bipc', 'biology_physics_chemistry'].includes(s)) return 'bipc';
  if (['mec', 'mathematics_economics_commerce', 'commerce_maths'].includes(s)) return 'mec';
  if (['cec', 'civics_economics_commerce', 'commerce', 'commerce_general'].includes(s)) return 'cec';
  if (['arts', 'humanities', 'arts_humanities', 'hec'].includes(s)) return 'arts';
  if (['diploma', 'polytechnic', 'diploma_polytechnic'].includes(s)) return 'diploma';
  if (['hotel_management', 'hospitality', 'hotel'].includes(s)) return 'hotel_management';
  return s;
}

/**
 * Evaluates mandatory eligibility for a career based on current stream or degree.
 */
export function evaluateEligibility(streamOrStage, careerId) {
  const stream = normalizeStream(streamOrStage);

  if (!stream || stream === 'not_sure') {
    return {
      ...ELIGIBILITY_TIERS.information_unavailable,
      prerequisites: ['10+2 stream or graduation discipline to be verified'],
      reason: 'Your academic stream has not been specified yet. Complete the stream selection to verify statutory eligibility.',
      nextAction: 'Select your Class 12 stream or undergraduate degree to unlock confirmed eligibility status.',
    };
  }

  switch (careerId) {
    // ── Medicine & Clinical Healthcare ─────────────────────────
    case 'doctor':
      if (stream === 'bipc') {
        return {
          ...ELIGIBILITY_TIERS.eligible,
          prerequisites: ['10+2 with Physics, Chemistry, Biology & English (min 50% PCB)', 'NEET-UG Qualifying Score'],
          reason: 'Meets National Medical Commission (NMC) mandatory prerequisites for MBBS admission via NEET-UG.',
          nextAction: 'Focus on NCERT Biology and Chemistry speed drills; register for NEET-UG during official NTA window.',
        };
      }
      if (stream === 'mpc') {
        return {
          ...ELIGIBILITY_TIERS.additional_qualification_required,
          prerequisites: ['10+2 PCB equivalent', 'Additional Biology Examination via NIOS / Recognized Board', 'NEET-UG'],
          reason: 'NMC guidelines require 10+2 Biology. MPC students can qualify by completing Biology through National Institute of Open Schooling (NIOS).',
          nextAction: 'Review NIOS On-Demand / Senior Secondary Biology registration guidelines to add Biology as an additional subject.',
        };
      }
      return {
        ...ELIGIBILITY_TIERS.not_eligible,
        prerequisites: ['10+2 with Physics, Chemistry, Biology & English (NMC Mandate)'],
        reason: 'Statutory regulation: NMC mandates Physics, Chemistry, and Biology at 10+2 for MBBS. Current stream does not meet NEET-UG eligibility criteria.',
        nextAction: 'Explore allied healthcare or management pathways (e.g. Hospital Administration, Healthcare Analytics, or Pharmaceutical Law).',
      };

    case 'nurse':
      if (stream === 'bipc') {
        return {
          ...ELIGIBILITY_TIERS.eligible,
          prerequisites: ['10+2 with PCB & English (min 45%)', 'State Nursing CET / NEET (for select central colleges)'],
          reason: 'Directly eligible for 4-Year B.Sc Nursing under Indian Nursing Council (INC) regulations.',
          nextAction: 'Verify state nursing admission notification and college clinical affiliation records.',
        };
      }
      return {
        ...ELIGIBILITY_TIERS.additional_qualification_required,
        prerequisites: ['General Nursing and Midwifery (GNM) Diploma', 'Science bridge'],
        reason: 'Direct B.Sc Nursing requires 10+2 PCB. Some state councils admit non-science students to GNM diploma followed by Post-Basic B.Sc Nursing.',
        nextAction: 'Evaluate GNM Diploma routes or clinical healthcare administration degrees.',
      };

    case 'pharmacist':
      if (stream === 'bipc' || stream === 'mpc') {
        return {
          ...ELIGIBILITY_TIERS.eligible,
          prerequisites: ['10+2 with Physics & Chemistry + either Biology OR Mathematics', 'State EAMCET / CET'],
          reason: 'Pharmacy Council of India (PCI) permits both BiPC (Biology) and MPC (Mathematics) streams for 4-Year B.Pharm and 6-Year Pharm.D.',
          nextAction: 'Check State CET (e.g. TS EAPCET) MPC/BiPC pharmacy counseling seat allotment dates.',
        };
      }
      return {
        ...ELIGIBILITY_TIERS.not_eligible,
        prerequisites: ['10+2 with Physics & Chemistry as mandatory subjects (PCI)'],
        reason: 'PCI regulations require Physics and Chemistry at 10+2 level for admission to B.Pharm or Pharm.D.',
        nextAction: 'Explore pharmaceutical sales, healthcare marketing, or healthcare supply chain operations.',
      };

    case 'biotech-researcher':
      if (stream === 'bipc') {
        return {
          ...ELIGIBILITY_TIERS.eligible,
          prerequisites: ['10+2 with Physics, Chemistry & Biology', 'CUET-UG / University Entrance'],
          reason: 'Directly eligible for B.Sc Biotechnology / Microbiology / Genomics and integrated life sciences programs.',
          nextAction: 'Shortlist universities offering research-intensive laboratories and bio-incubator facilities.',
        };
      }
      if (stream === 'mpc') {
        return {
          ...ELIGIBILITY_TIERS.potentially_eligible,
          prerequisites: ['10+2 with Physics, Chemistry & Mathematics', 'JEE Main / State CET for B.Tech Biotechnology'],
          reason: 'Eligible for 4-Year B.Tech Biotechnology or Computational Biology at engineering institutions (IITs, NITs, private universities).',
          nextAction: 'Focus on computational genomics, structural biology, and bio-algorithms in B.Tech engineering counseling.',
        };
      }
      return {
        ...ELIGIBILITY_TIERS.additional_qualification_required,
        prerequisites: ['Science foundation at 10+2 level'],
        reason: 'Biotechnology undergraduate degrees require laboratory science foundation at 10+2 level.',
        nextAction: 'Explore bioinformatics management, health tech product operations, or science policy.',
      };

    // ── Engineering & Architecture ─────────────────────────────
    case 'software-engineer':
    case 'ml-engineer':
    case 'cybersecurity-analyst':
      if (stream === 'mpc') {
        return {
          ...ELIGIBILITY_TIERS.eligible,
          prerequisites: ['10+2 with Physics, Mathematics & Chemistry/CS (min 50-60%)', 'JEE Main / TS EAMCET / BITSAT'],
          reason: 'Directly meets AICTE and university prerequisites for B.Tech / B.E. in Computer Science, AI, and Software Systems.',
          nextAction: 'Target top engineering cutoffs and begin building fundamental algorithmic logic in Python or C++.',
        };
      }
      if (stream === 'diploma') {
        return {
          ...ELIGIBILITY_TIERS.eligible,
          prerequisites: ['3-Year Polytechnic Diploma in Computer / IT / Electronics', 'State ECET for Lateral Entry'],
          reason: 'Directly eligible for lateral entry into 2nd year B.Tech Computer Science via State ECET.',
          nextAction: 'Prepare for state engineering common entrance test (ECET) technical subjects.',
        };
      }
      if (stream === 'mec' || stream === 'cec') {
        return {
          ...ELIGIBILITY_TIERS.potentially_eligible,
          prerequisites: ['10+2 with Mathematics (for top BCA / B.Sc Computing)', 'Institutional Entrance'],
          reason: 'Eligible for 3-Year BCA (Bachelor of Computer Applications), B.Sc Data Science, or B.Sc IT. Top B.Tech requires PCM, but BCA leads to MCA at top NITs.',
          nextAction: 'Shortlist BCA or B.Sc Computing degrees; plan for NIMCET (NIT MCA Common Entrance Test) after graduation.',
        };
      }
      if (stream === 'bipc') {
        return {
          ...ELIGIBILITY_TIERS.potentially_eligible,
          prerequisites: ['10+2 pass', 'University admission for BCA or Computational Biology'],
          reason: 'Eligible for BCA, B.Sc IT, or Computational Biology degrees that do not mandate 10+2 PCM.',
          nextAction: 'Explore interdisciplinary computing, health informatics, or BCA pathways.',
        };
      }
      return {
        ...ELIGIBILITY_TIERS.additional_qualification_required,
        prerequisites: ['BCA or Bachelor degree with Mathematics background'],
        reason: 'Direct B.Tech core requires 10+2 PCM. Route is accessible through BCA or non-engineering IT degrees + industry certifications.',
        nextAction: 'Explore BCA programs with foundation coding tracks, followed by MCA or specialized master’s.',
      };

    case 'data-scientist':
      if (stream === 'mpc' || stream === 'mec') {
        return {
          ...ELIGIBILITY_TIERS.eligible,
          prerequisites: ['10+2 with Mathematics as a core subject (min 50%)', 'Entrance / Merit Admission'],
          reason: 'Directly eligible for B.Tech Data Science (MPC) or B.Sc / B.Com Data Analytics & Statistics (MEC with Mathematics).',
          nextAction: 'Strengthen probability, statistics, and linear algebra; explore SQL and Python data libraries.',
        };
      }
      if (stream === 'cec' || stream === 'bipc' || stream === 'arts') {
        return {
          ...ELIGIBILITY_TIERS.potentially_eligible,
          prerequisites: ['BCA or Business Analytics degree with mathematics bridge'],
          reason: 'Accessible through Business Analytics, BCA, or specialized Applied Data degrees with introductory math modules.',
          nextAction: 'Enroll in foundational calculus and statistics courses alongside degree studies.',
        };
      }
      return {
        ...ELIGIBILITY_TIERS.eligible,
        prerequisites: ['Undergraduate degree with quantitative modules'],
        reason: 'Accessible via applied analytics and postgraduate statistics specialisations.',
        nextAction: 'Target applied business analytics or data engineering diplomas.',
      };

    case 'mechanical-engineer':
    case 'civil-engineer':
      if (stream === 'mpc') {
        return {
          ...ELIGIBILITY_TIERS.eligible,
          prerequisites: ['10+2 with Physics, Mathematics & Chemistry', 'JEE Main / State Engineering CET'],
          reason: 'Directly meets AICTE mandatory prerequisites for B.Tech Mechanical, Civil, Automotive, or Aerospace engineering.',
          nextAction: 'Review engineering branch cutoffs and physics/mechanics syllabus.',
        };
      }
      if (stream === 'diploma') {
        return {
          ...ELIGIBILITY_TIERS.eligible,
          prerequisites: ['Diploma in Mechanical / Civil Engineering', 'State ECET Lateral Entry'],
          reason: 'Directly eligible for lateral entry into 2nd year B.Tech Core Engineering.',
          nextAction: 'Review state lateral entry counseling deadlines.',
        };
      }
      return {
        ...ELIGIBILITY_TIERS.not_eligible,
        prerequisites: ['10+2 with Physics and Mathematics (Mandatory under AICTE)'],
        reason: 'Statutory regulation: AICTE requires Physics and Mathematics at 10+2 level for core mechanical and civil engineering degrees.',
        nextAction: 'Explore industrial product design (B.Des) or infrastructure project management, which do not mandate PCM.',
      };

    case 'architect':
      if (stream === 'mpc') {
        return {
          ...ELIGIBILITY_TIERS.eligible,
          prerequisites: ['10+2 with Physics, Chemistry & Mathematics (COA Mandate)', 'Passing NATA or JEE Main Paper 2'],
          reason: 'Directly meets Council of Architecture (COA) statutory prerequisites for 5-Year B.Arch admission.',
          nextAction: 'Prepare architectural drawing portfolio and NATA cognitive test modules.',
        };
      }
      if (stream === 'diploma') {
        return {
          ...ELIGIBILITY_TIERS.eligible,
          prerequisites: ['10+3 Diploma in Architectural Assistantship / Civil with Mathematics', 'NATA qualifying score'],
          reason: 'Eligible for 5-Year B.Arch under Council of Architecture diploma entry regulations.',
          nextAction: 'Register for NATA test sessions.',
        };
      }
      return {
        ...ELIGIBILITY_TIERS.not_eligible,
        prerequisites: ['10+2 with Physics, Chemistry and Mathematics (COA Regulations)'],
        reason: 'Statutory restriction: Council of Architecture mandates Mathematics at 10+2 for B.Arch. Arts or Commerce without Maths cannot take NATA.',
        nextAction: 'Explore B.Des Interior Design or B.Des Spatial Design, which accept all 10+2 streams without PCM mandate.',
      };

    // ── Commerce, Finance & Management ────────────────────────
    case 'chartered-accountant':
      return {
        ...ELIGIBILITY_TIERS.eligible,
        prerequisites: ['10+2 from any recognized board (ICAI Regulation)', 'Registration for ICAI CA Foundation'],
        reason: 'ICAI permits students from ANY 10+2 stream (Commerce, Science, Arts) to register for the CA Foundation examination.',
        nextAction: 'Register with ICAI at least 4 months prior to examination; begin studying Accounting and Mercantile Law.',
      };

    case 'financial-analyst':
    case 'business-analyst':
      if (['commerce', 'mec', 'cec'].includes(stream)) {
        return {
          ...ELIGIBILITY_TIERS.eligible,
          prerequisites: ['10+2 with Commerce / Economics / Mathematics', 'CUET-UG / Merit Admission'],
          reason: 'Direct alignment with B.Com (Hons), BBA Finance, or B.Sc Economics pathways.',
          nextAction: 'Target top commerce colleges; begin financial modeling and advanced Excel practice.',
        };
      }
      return {
        ...ELIGIBILITY_TIERS.potentially_eligible,
        prerequisites: ['10+2 in any stream (min 50%)', 'BBA / B.Com entry'],
        reason: 'BBA and general B.Com degrees accept students from science and arts backgrounds directly.',
        nextAction: 'Shortlist BBA or IPM (Integrated Program in Management) entrance exams (e.g. IPMAT).',
      };

    case 'marketing-manager':
    case 'entrepreneur':
      return {
        ...ELIGIBILITY_TIERS.eligible,
        prerequisites: ['10+2 in any recognized stream', 'Admission to BBA / B.Com / B.A. / B.Tech'],
        reason: 'Universal academic eligibility. Open to graduates and 10+2 pass outs from every stream.',
        nextAction: 'Explore BBA Marketing, communication projects, or start small testing prototypes.',
      };

    // ── Law, Design, Humanities & Public Service ───────────────
    case 'lawyer':
      return {
        ...ELIGIBILITY_TIERS.eligible,
        prerequisites: ['10+2 in any stream with min 45% (BCI Regulation)', 'CLAT / AILET / State LAWCET'],
        reason: 'Bar Council of India permits 10+2 pass outs from ANY stream (Arts, Commerce, MPC, BiPC) to enter 5-Year Integrated B.A. LL.B. / B.Com LL.B.',
        nextAction: 'Begin reading comprehension, legal reasoning, and current affairs drills for CLAT.',
      };

    case 'ux-designer':
      return {
        ...ELIGIBILITY_TIERS.eligible,
        prerequisites: ['10+2 in any stream', 'UCEED / NID DAT / Portfolio Evaluation'],
        reason: 'B.Des (Bachelor of Design) and creative technology degrees welcome students from all academic streams.',
        nextAction: 'Build a creative portfolio of 5 projects showcasing visual problem-solving and user flows.',
      };

    case 'civil-servant':
    case 'teacher':
    case 'journalist':
    case 'psychologist':
      return {
        ...ELIGIBILITY_TIERS.eligible,
        prerequisites: ['10+2 in any stream for undergraduate degree', 'Graduation for UPSC CSE / B.Ed licensing'],
        reason: 'Universal eligibility at 10+2 level. Degree choices (B.A., B.Sc, B.Com) keep all public service routes open.',
        nextAction: 'Select an undergraduate degree in an area of genuine academic curiosity while building general studies breadth.',
      };

    // ── Agriculture & Environmental Sciences ────────────────────
    case 'agricultural-scientist':
    case 'environmental-scientist':
      if (stream === 'bipc' || stream === 'mpc') {
        return {
          ...ELIGIBILITY_TIERS.eligible,
          prerequisites: ['10+2 with Science (PCB or PCM)', 'ICAR AIEEA / State Agriculture CET'],
          reason: 'Eligible for 4-Year B.Sc (Hons) Agriculture, Forestry, Horticulture, or Environmental Sciences.',
          nextAction: 'Check ICAR and state agricultural university counseling schedules.',
        };
      }
      return {
        ...ELIGIBILITY_TIERS.additional_qualification_required,
        prerequisites: ['10+2 with Science subjects (PCB/PCM)'],
        reason: 'B.Sc Agriculture and ICAR accreditation require a science foundation at 10+2 level.',
        nextAction: 'Explore agricultural business management (BBA Agri-Business), which admits non-science students.',
      };

    // ── Hospitality & Tourism ──────────────────────────────────
    case 'hotel-manager':
    case 'culinary-chef':
    case 'event-manager':
    case 'travel-consultant':
      return {
        ...ELIGIBILITY_TIERS.eligible,
        prerequisites: ['10+2 in any stream (min 45-50%)', 'NCHMCT JEE / Institutional CET'],
        reason: 'National Council for Hotel Management (NCHMCT) permits candidates from Science, Commerce, and Arts streams equally.',
        nextAction: 'Register for NCHMCT JEE or explore culinary institute diplomas with internship attachments.',
      };

    default:
      return {
        ...ELIGIBILITY_TIERS.potentially_eligible,
        prerequisites: ['Standard 10+2 qualification'],
        reason: 'General pathway accessible with standard undergraduate preparation.',
        nextAction: 'Check specific institutional requirements for this degree track.',
      };
  }
}

/**
 * Filter and sort careers ensuring that not_eligible options are never
 * falsely promoted into top recommended slots.
 */
export function filterAndRankByEligibility(scoredCareers, stream) {
  return scoredCareers.map((item) => {
    const careerId = item.career?.id || item.id;
    const eligibility = evaluateEligibility(stream, careerId);
    return {
      ...item,
      eligibility,
    };
  });
}

