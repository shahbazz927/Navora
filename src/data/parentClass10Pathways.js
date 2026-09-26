/**
 * NAVORA Parent Class 10 Pathway & Gateway Architecture
 * 
 * Core Mapping:
 * Pathway → Subjects → Gateways → Courses → Careers → Alternatives
 * 
 * Supported Pathways:
 * - MPC (Mathematics, Physics, Chemistry)
 * - BiPC (Biology, Physics, Chemistry)
 * - MEC (Mathematics, Economics, Commerce)
 * - CEC (Civics, Economics, Commerce)
 * - HEC / Humanities (Humanities, Social Sciences, Law, Arts)
 * - Diploma / Polytechnic (3-Year Technical Engineering)
 * - Vocational / Skill Pathway (ITI & Industry Certifications)
 * - Undecided / Exploration (Balanced multi-stream comparative roadmap)
 */

export const PATHWAY_KEYS = {
  MPC: 'mpc',
  BIPC: 'bipc',
  MEC: 'mec',
  CEC: 'cec',
  HEC: 'hec',
  DIPLOMA: 'diploma',
  VOCATIONAL: 'vocational',
  UNDECIDED: 'undecided',
};

export const PATHWAYS_DATA = {
  [PATHWAY_KEYS.MPC]: {
    id: PATHWAY_KEYS.MPC,
    code: 'MPC',
    name: 'MPC — Mathematics, Physics, Chemistry',
    badge: 'Science & Technology Stream',
    color: '#0284c7', // sky-600
    accentBg: '#f0f9ff',
    accentBorder: '#bae6fd',
    summary: 'The primary quantitative pathway for students who enjoy mathematical problem solving and want to pursue careers in engineering, computer science, physical sciences, or defense.',
    subjectsInPlusTwo: ['Mathematics (Calculus, Algebra, Coordinate Geometry)', 'Physics (Mechanics, Electromagnetism, Optics)', 'Chemistry (Physical, Organic, Inorganic)', 'English & Second Language / Elective'],
    gateways: [
      {
        id: 'engineering',
        title: 'Engineering (Core & Advanced Branches)',
        summary: 'Rigorous engineering programs building physical systems, infrastructure, and hardware technologies.',
        courses: [
          'B.Tech / B.E. in Mechanical Engineering',
          'B.Tech in Civil & Environmental Engineering',
          'B.Tech in Electrical & Electronics Engineering (EEE)',
          'B.Tech in Aerospace / Aeronautical Engineering',
          'B.Tech in Chemical Engineering',
        ],
        careers: [
          'Design & Systems Engineer',
          'Aerospace Specialist',
          'Robotics & Automation Engineer',
          'Infrastructure Project Engineer',
          'R&D Specialist',
        ],
        entranceRoutes: ['JEE Main & JEE Advanced', 'State Engineering CETs (EAMCET, KCET, MHT-CET, WBJEE)', 'BITSAT, VITEEE, SRMJEEE'],
      },
      {
        id: 'computer_science',
        title: 'Computer Science & Information Technology',
        summary: 'Software systems, algorithm development, artificial intelligence, and enterprise technology infrastructure.',
        courses: [
          'B.Tech in Computer Science & Engineering (CSE)',
          'B.Tech in Artificial Intelligence & Machine Learning (AI & ML)',
          'B.Tech in Data Science & Big Data Analytics',
          'B.Tech in Cyber Security & Cryptography',
          'B.Sc Computer Science / B.Sc Data Science',
        ],
        careers: [
          'Software Development Engineer (SDE)',
          'Machine Learning / AI Engineer',
          'Data Scientist & Quant Analyst',
          'Cloud Solutions Architect',
          'Cybersecurity Analyst',
        ],
        entranceRoutes: ['JEE Main / Advanced', 'BITSAT, State CETs', 'CUET-UG for B.Sc Central Universities'],
      },
      {
        id: 'architecture',
        title: 'Architecture & Spatial Planning',
        summary: 'Blending design aesthetics, structural physics, urban sociology, and building engineering.',
        courses: [
          'B.Arch (Bachelor of Architecture — 5 Years)',
          'B.Plan (Bachelor of Planning — 4 Years)',
          'B.Des in Industrial / Spatial Design',
        ],
        careers: [
          'Licensed Architect & Urban Designer',
          'Sustainable Building Consultant',
          'Interior & Spatial Architect',
          'Regional Urban Planner',
        ],
        entranceRoutes: ['NATA (National Aptitude Test in Architecture)', 'JEE Main Paper 2 (B.Arch/B.Plan)', 'State Architecture Admissions'],
      },
      {
        id: 'pure_science',
        title: 'B.Sc. Science & Foundational Research',
        summary: 'In-depth scientific investigation, experimental research, and preparation for scientific academia or R&D.',
        courses: [
          'B.Sc (Hons) / BS-MS in Physics',
          'B.Sc (Hons) / BS-MS in Chemistry',
          'B.Sc Applied Physical Sciences',
          'Integrated M.Sc in Earth & Atmospheric Sciences',
        ],
        careers: [
          'Scientific Officer / Research Scientist (BARC, ISRO, DRDO)',
          'Laboratory R&D Director',
          'Materials Scientist',
          'Professor & Academic Researcher',
        ],
        entranceRoutes: ['IISER Aptitude Test (IAT)', 'NEST (NISER / UM-DAE CEBS)', 'CUET-UG', 'State University Entrance Exams'],
      },
      {
        id: 'mathematics_physics',
        title: 'Mathematics, Statistics & Quantitative Analytics',
        summary: 'Mathematical modeling, actuarial calculations, risk forecasting, and computational mathematics.',
        courses: [
          'B.Stat (Bachelor of Statistics — ISI Kolkata)',
          'B.Math (Bachelor of Mathematics — ISI / CMI)',
          'B.Sc (Hons) Mathematics / Applied Mathematics',
          'B.Sc Actuarial Science',
        ],
        careers: [
          'Actuary & Insurance Risk Assessor',
          'Quantitative Financial Analyst (Hedge Funds & Fintech)',
          'Data Cryptographer & Statistical Modeler',
          'Operations Research Analyst',
        ],
        entranceRoutes: ['ISI Admission Test', 'CMI Entrance Exam', 'CUET-UG for DU & Central Universities', 'ACET for Actuaries'],
      },
      {
        id: 'defence_aviation',
        title: 'Defence, Armed Forces & Aviation',
        summary: 'National defense leadership, military engineering technical branches, and civil aviation flight operations.',
        courses: [
          'NDA (National Defence Academy — Army, Navy, Air Force wings)',
          'Indian Navy 10+2 B.Tech Cadet Entry Scheme',
          'Commercial Pilot Training (CPL — DGCA Approved Flying Schools)',
          'B.Sc Aviation / Aeronautics',
        ],
        careers: [
          'Commissioned Officer in Indian Armed Forces (IAF, Navy, Army)',
          'Commercial Airline Pilot / First Officer',
          'Military Aeronautical Engineer',
          'Air Traffic Controller (AAI)',
        ],
        entranceRoutes: ['NDA & NA Exam (conducted by UPSC)', 'Indian Navy 10+2 Cadet Entry (via JEE Main)', 'DGCA Pilot Cadet Programs'],
      },
    ],
  },

  [PATHWAY_KEYS.BIPC]: {
    id: PATHWAY_KEYS.BIPC,
    code: 'BiPC',
    name: 'BiPC — Biology, Physics, Chemistry',
    badge: 'Medical & Life Sciences Stream',
    color: '#059669', // emerald-600
    accentBg: '#ecfdf5',
    accentBorder: '#a7f3d0',
    summary: 'The dedicated pathway for students fascinated by the living world, healthcare, diagnostic sciences, and medical research.',
    subjectsInPlusTwo: ['Biology (Botany, Zoology, Human Physiology, Genetics)', 'Physics (Mechanics, Wave Optics, Modern Physics)', 'Chemistry (Organic, Bio-molecules, Inorganic)', 'English & Elective'],
    gateways: [
      {
        id: 'medicine',
        title: 'Medicine / MBBS & Clinical Practice',
        summary: 'Primary healthcare diagnosis, clinical medicine, hospital practice, and surgical treatment of disease.',
        courses: [
          'MBBS (Bachelor of Medicine & Bachelor of Surgery — 5.5 Years)',
          'BAMS (Ayurvedic Medicine & Surgery)',
          'BHMS (Homeopathic Medicine & Surgery)',
        ],
        careers: [
          'General Physician & Family Doctor',
          'Medical Specialist (Cardiologist, Neurologist, Pediatrician post-MD)',
          'Surgeon (General, Orthopedic, Neuro post-MS)',
          'Hospital Medical Superintendent',
        ],
        entranceRoutes: ['NEET-UG (National Eligibility cum Entrance Test)', 'State Quota NEET Counselling'],
      },
      {
        id: 'dental',
        title: 'Dental Sciences & Oral Healthcare',
        summary: 'Comprehensive oral healthcare, dentofacial aesthetics, orthodontics, and restorative dentistry.',
        courses: [
          'BDS (Bachelor of Dental Surgery — 5 Years)',
          'MDS Specializations (Orthodontics, Oral Surgery, Prosthodontics)',
        ],
        careers: [
          'Dental Surgeon & Private Practitioner',
          'Orthodontist & Smile Restoration Specialist',
          'Maxillofacial Surgeon (post-MDS)',
          'Dental Public Health Officer',
        ],
        entranceRoutes: ['NEET-UG', 'State Dental Counselling'],
      },
      {
        id: 'pharmacy',
        title: 'Pharmacy & Drug Formulation',
        summary: 'Pharmaceutical science, medicine formulation, clinical trials, and drug quality assurance.',
        courses: [
          'B.Pharm (Bachelor of Pharmacy — 4 Years)',
          'Pharm.D (Doctor of Pharmacy — 6-Year Clinical Program)',
          'Diploma in Pharmacy (D.Pharm)',
        ],
        careers: [
          'Clinical Pharmacist & Hospital Drug Specialist',
          'Pharmaceutical Formulator & R&D Scientist',
          'Regulatory Affairs Officer',
          'Quality Control & Assurance Manager',
        ],
        entranceRoutes: ['State Pharmacy Entrance Exams (CETs)', 'CUET-UG for Central Universities', 'NEET / Direct Merit in approved colleges'],
      },
      {
        id: 'nursing',
        title: 'Nursing & Patient Care Leadership',
        summary: 'Patient management, emergency care, surgical assistance, and hospital nursing administration.',
        courses: [
          'B.Sc Nursing (4 Years)',
          'Post-Basic B.Sc Nursing',
          'M.Sc Clinical Nursing Specializations',
        ],
        careers: [
          'Critical Care / ICU Specialist Nurse',
          'Chief Nursing Officer / Hospital Administrator',
          'Pediatric & Neonatal Care Nurse',
          'International Healthcare Staff Nurse (UK, Gulf, US, Australia)',
        ],
        entranceRoutes: ['State Nursing CETs', 'NEET-UG (accepted by AIIMS & military nursing)', 'AIIMS B.Sc Nursing Exam'],
      },
      {
        id: 'allied_health',
        title: 'Allied Health Sciences & Diagnostics',
        summary: 'Advanced medical imaging, physiotherapy, cardiac technology, and hospital laboratory diagnosis.',
        courses: [
          'BPT (Bachelor of Physiotherapy — 4.5 Years)',
          'B.Sc Medical Laboratory Technology (BMLT)',
          'B.Sc Radiology & Medical Imaging Technology',
          'B.Sc Cardiac Technology & Perfusion',
          'BOT (Bachelor of Occupational Therapy)',
        ],
        careers: [
          'Clinical Physiotherapist & Sports Rehabilitation Specialist',
          'Diagnostic Radiographer & MRI/CT Specialist',
          'Cardiac Technologist & Cath Lab Specialist',
          'Clinical Laboratory Technologist',
        ],
        entranceRoutes: ['State Paramedical & Allied Health Admissions', 'NEET-UG / University Specific Merit', 'AIIMS Allied Sciences'],
      },
      {
        id: 'life_sciences',
        title: 'Life Sciences, Genetics & Research',
        summary: 'Investigating cellular mechanisms, molecular biology, genomics, and epidemiological science.',
        courses: [
          'B.Sc (Hons) in Microbiology',
          'B.Sc in Genetics & Genomics',
          'B.Sc Biochemistry & Molecular Biology',
          'BS-MS Dual Degree in Biological Sciences',
        ],
        careers: [
          'Microbiologist & Pathogen Researcher',
          'Clinical Geneticist & Genome Analyst',
          'Vaccine & Immunology Scientist',
          'Biochemical R&D Specialist',
        ],
        entranceRoutes: ['CUET-UG', 'IISER IAT', 'State Universities Merit Admissions'],
      },
      {
        id: 'agriculture_veterinary',
        title: 'Agriculture, Veterinary & Forestry',
        summary: 'Sustainable crop sciences, agricultural technology, veterinary medicine, and food security.',
        courses: [
          'B.V.Sc & AH (Bachelor of Veterinary Science & Animal Husbandry — 5.5 Years)',
          'B.Sc (Hons) Agriculture (4 Years — ICAR Accredited)',
          'B.Sc (Hons) Horticulture / Forestry',
          'B.Tech Food Technology',
        ],
        careers: [
          'Veterinary Surgeon & Animal Health Specialist',
          'Agricultural Development Officer (ADO)',
          'Agronomist & Seed Production Specialist',
          'Food Safety & Quality Inspector',
        ],
        entranceRoutes: ['NEET-UG (for BVSc national quota)', 'ICAR AIEEA (CUET-UG)', 'State Agriculture CETs (EAMCET, KCET, MP PAT)'],
      },
      {
        id: 'biotechnology',
        title: 'Biotechnology & Bio-Engineering',
        summary: 'Applying engineering principles to biological systems for pharmaceuticals, bio-fuels, and genetic tools.',
        courses: [
          'B.Tech / B.Sc in Biotechnology',
          'B.Tech in Biomedical Engineering',
          'B.Tech in Bioinformatics',
        ],
        careers: [
          'Bioinformatics Engineer',
          'Bioprocess & Fermentation Specialist',
          'Biomedical Instrumentation Engineer',
          'Agricultural Biotech Specialist',
        ],
        entranceRoutes: ['JEE Main / State CETs (for B.Tech)', 'CUET-UG', 'Direct Institutional Merit'],
      },
    ],
  },

  [PATHWAY_KEYS.MEC]: {
    id: PATHWAY_KEYS.MEC,
    code: 'MEC',
    name: 'MEC — Mathematics, Economics, Commerce',
    badge: 'Quantitative Commerce & Finance Stream',
    color: '#7c3aed', // violet-600
    accentBg: '#f5f3ff',
    accentBorder: '#ddd6fe',
    summary: 'The premiere analytical commerce pathway for students who enjoy numbers, economics, business data, and want access to corporate finance, analytics, and elite management degrees.',
    subjectsInPlusTwo: ['Mathematics (Applied & Pure Mathematics)', 'Economics (Micro, Macro, Indian Economic Development)', 'Commerce & Accountancy (Financial Accounting, Business Systems)', 'English & Second Language'],
    gateways: [
      {
        id: 'commerce_accounting',
        title: 'Advanced Commerce & Professional Accounting',
        summary: 'Deep corporate accounting, international financial reporting standards, taxation, and auditing.',
        courses: [
          'B.Com (Honours) with specialization in Financial Accounting',
          'B.Com in Professional Accounting / International Finance',
          'B.Com + Integrated ACCA / US CMA',
        ],
        careers: [
          'Corporate Accountant & Financial Controller',
          'Internal & Forensic Auditor',
          'Tax Consultant & International Tax Advisor',
          'Treasury & Capital Management Lead',
        ],
        entranceRoutes: ['CUET-UG (Top Central Universities like SRCC, St. Xavier’s)', 'State University Merit Admissions'],
      },
      {
        id: 'finance_investment',
        title: 'Finance & Investment Banking',
        summary: 'Capital markets, equity valuation, venture capital, financial derivatives, and quantitative trading.',
        courses: [
          'B.Sc (Hons) Finance / BBA in Finance',
          'Bachelor of Accounting & Finance (BAF)',
          'CFA (Chartered Financial Analyst — Level 1 preparation)',
        ],
        careers: [
          'Equity Research Analyst',
          'Investment Banking Associate',
          'Wealth & Portfolio Manager',
          'Financial Risk Analyst',
        ],
        entranceRoutes: ['CUET-UG', 'DU JAT / IPMAT', 'NMIMS NPAT, Christ University Entrance'],
      },
      {
        id: 'ca_cma_cs',
        title: 'Chartered Accountancy (CA / CMA / CS)',
        summary: 'Elite professional statutory credentials governing statutory audits, financial management, and corporate law.',
        courses: [
          'CA Foundation → CA Intermediate → CA Final (ICAI)',
          'CMA Foundation → Intermediate → Final (ICMAI)',
          'CS Executive Entrance Test (CSEET) → Executive → Professional (ICSI)',
        ],
        careers: [
          'Practicing Chartered Accountant (Statutory Auditor)',
          'Chief Financial Officer (CFO)',
          'Cost & Management Accountant',
          'Corporate Governance Officer & Company Secretary',
        ],
        entranceRoutes: ['ICAI CA Foundation Exam', 'ICMAI Foundation Exam', 'ICSI CSEET Exam'],
      },
      {
        id: 'economics',
        title: 'Economics & Quantitative Econometrics',
        summary: 'Analytical study of economic policy, market dynamics, mathematical modeling, and public finance.',
        courses: [
          'B.A. (Hons) / B.Sc (Hons) in Economics',
          'B.Sc in Econometrics & Mathematical Economics',
          'Integrated M.Sc in Economics',
        ],
        careers: [
          'Macroeconomic Forecaster',
          'Economic Policy Analyst (NITI Aayog, RBI, World Bank)',
          'Market Research Consultant',
          'Pricing & Revenue Management Analyst',
        ],
        entranceRoutes: ['CUET-UG (Economics + Math compulsory for top colleges)', 'St. Stephen’s, SRCC, Ashoka, Azim Premji admissions'],
      },
      {
        id: 'bba_management',
        title: 'BBA & Elite Integrated Management',
        summary: 'Business administration, strategic leadership, corporate marketing, and organizational operations.',
        courses: [
          '5-Year Integrated Programme in Management (IPM at IIM Indore, Rohtak, Ranchi, Bodh Gaya, Jammu)',
          'BBA (Honours) / Bachelor of Management Studies (BMS)',
        ],
        careers: [
          'Management Consultant (McKinsey, BCG, Bain feeder)',
          'Brand & Product Marketing Manager',
          'Business Operations & Strategy Lead',
          'Corporate Business Analyst',
        ],
        entranceRoutes: ['IPMAT (IIM Indore / Rohtak)', 'JIPMAT', 'CUET-UG for BMS at Delhi University', 'NPAT, SET'],
      },
      {
        id: 'banking_fintech',
        title: 'Banking & Financial Services',
        summary: 'Commercial banking operations, credit underwriting, digital payments, and fintech risk frameworks.',
        courses: [
          'B.Com in Banking & Insurance (BBI)',
          'B.Sc in FinTech & Digital Financial Services',
          'BBA in Banking & Wealth Management',
        ],
        careers: [
          'Commercial Banking Officer',
          'Credit Risk & Loan Underwriter',
          'Fintech Product Analyst',
          'Mutual Fund & Relationship Manager',
        ],
        entranceRoutes: ['CUET-UG', 'University Banking Admissions', 'Direct merit entry'],
      },
    ],
  },

  [PATHWAY_KEYS.CEC]: {
    id: PATHWAY_KEYS.CEC,
    code: 'CEC',
    name: 'CEC — Civics, Economics, Commerce',
    badge: 'Business, Management & Governance Stream',
    color: '#d97706', // amber-600
    accentBg: '#fffbeb',
    accentBorder: '#fde68a',
    summary: 'The ideal stream for students who want strong business and commercial grounding without the burden of advanced calculus, opening direct doors to management, law, civil governance, and enterprise.',
    subjectsInPlusTwo: ['Commerce & Accountancy (Business Bookkeeping, Financial Statements)', 'Economics (Applied Economics, Commerce Dynamics)', 'Civics & Political Science (Indian Constitution, Governance, Public Administration)', 'English & Elective'],
    gateways: [
      {
        id: 'commerce',
        title: 'General Commerce & Business Practice',
        summary: 'Practical enterprise management, corporate accounting, commercial sales, and tax compliance.',
        courses: [
          'B.Com (General / Computer Applications)',
          'B.Com in Corporate Administration',
          'B.Com in Marketing & Retail Management',
        ],
        careers: [
          'Corporate Accountant & Business Executive',
          'Commercial Operations Specialist',
          'Tax Filing & GST Compliance Advisor',
          'Procurement & Inventory Manager',
        ],
        entranceRoutes: ['CUET-UG (General Test & Commerce subjects)', 'State University Merit Admissions'],
      },
      {
        id: 'bba_management',
        title: 'BBA & Enterprise Management',
        summary: 'Practical management skills, leadership, sales operations, human resources, and entrepreneurship.',
        courses: [
          'BBA (Bachelor of Business Administration)',
          'BBA in Retail & Supply Chain Operations',
          'BBA in Family Business & Entrepreneurship',
        ],
        careers: [
          'Operations Manager & Team Lead',
          'Business Development Executive',
          'Human Resources Coordinator',
          'Small Business Owner / Startup Founder',
        ],
        entranceRoutes: ['CUET-UG (General Test)', 'SET (Symbiosis)', 'Direct University Selection'],
      },
      {
        id: 'law',
        title: 'Law & Corporate Legal Advisory',
        summary: 'Comprehensive legal education, constitutional law, contract negotiations, and corporate litigation.',
        courses: [
          '5-Year Integrated BBA LLB / BA LLB (Honours)',
          'B.Com LLB (Commerce + Law Dual Degree)',
        ],
        careers: [
          'Corporate Legal Counsel',
          'Civil & Criminal Litigation Advocate',
          'Contract Specialist & Arbitrator',
          'Judicial Magistrate (via State Judicial Services)',
        ],
        entranceRoutes: ['CLAT (Common Law Admission Test for National Law Universities)', 'AILET (NLU Delhi)', 'State Law CETs (MH CET Law, TS/AP LAWCET)'],
      },
      {
        id: 'economics_applied',
        title: 'Applied Economics & Commercial Research',
        summary: 'Understanding consumer behaviour, market cycles, trade policies, and corporate finance trends.',
        courses: [
          'B.A. Economics (General & Applied)',
          'B.Com Applied Economics',
        ],
        careers: [
          'Business Research Associate',
          'Market Intelligence Analyst',
          'Financial & Business Journalist',
          'Public Policy Research Assistant',
        ],
        entranceRoutes: ['CUET-UG', 'State University Merit Admissions'],
      },
      {
        id: 'banking_insurance',
        title: 'Banking, Microfinance & Insurance',
        summary: 'Branch banking operations, customer credit assessment, retail banking, and microfinance delivery.',
        courses: [
          'B.Com Banking & Insurance',
          'Diploma in Banking & Financial Operations',
        ],
        careers: [
          'Bank Relationship Manager',
          'Loan Processing Officer',
          'Insurance Underwriter & Claims Assessor',
          'Microfinance Field Officer',
        ],
        entranceRoutes: ['University Merit', 'State College Admissions'],
      },
      {
        id: 'public_admin',
        title: 'Public Administration & Civil Services',
        summary: 'Governmental systems, democratic administration, welfare policies, and public service exams.',
        courses: [
          'B.A. in Public Administration / Political Science',
          'B.A. in Governance & Social Development',
        ],
        careers: [
          'Civil Servant (UPSC / State Public Service Commissions)',
          'Public Sector Undertaking (PSU) Officer',
          'Non-Profit & NGO Program Manager',
          'Municipal Administration Executive',
        ],
        entranceRoutes: ['CUET-UG', 'Direct University Admission (followed by UPSC/State PSC preparation)'],
      },
    ],
  },

  [PATHWAY_KEYS.HEC]: {
    id: PATHWAY_KEYS.HEC,
    code: 'HEC / Humanities',
    name: 'HEC / Humanities — Humanities & Social Sciences',
    badge: 'Law, Humanities, Media & Society Stream',
    color: '#c026d3', // fuchsia-600
    accentBg: '#fdf4ff',
    accentBorder: '#f5d0fe',
    summary: 'A rich, flexible stream for inquisitive minds drawn to people, literature, legal systems, human behavior, visual arts, and shaping society and public policy.',
    subjectsInPlusTwo: ['History (World, Indian & Modern History)', 'Political Science & Civics (Democratic Theory, International Politics)', 'Economics or Psychology / Sociology', 'English Literature, Journalism / Elective Language'],
    gateways: [
      {
        id: 'law',
        title: 'Law & Constitutional Jurisprudence',
        summary: 'Five-year integrated legal education leading to the bar, judiciary, corporate law firms, and policy advocacy.',
        courses: [
          '5-Year Integrated BA LLB (Honours)',
          '5-Year Integrated BBA LLB / B.Sc LLB',
        ],
        careers: [
          'Advocate & Trial Lawyer',
          'Corporate Law Associate & Compliance Counsel',
          'Human Rights Advocate & Legal Aid Specialist',
          'Judicial Officer / Civil Judge (State Judicial Services)',
        ],
        entranceRoutes: ['CLAT (National Law Universities)', 'AILET (NLU Delhi)', 'SLAT (Symbiosis)', 'State Law CETs'],
      },
      {
        id: 'psychology',
        title: 'Psychology, Counseling & Behavioral Science',
        summary: 'Scientific study of the human mind, psychological assessment, behavioral therapy, and mental health counseling.',
        courses: [
          'B.A. / B.Sc in Psychology (Honours)',
          'B.A. in Applied Psychology',
          'Integrated M.Sc in Cognitive Psychology',
        ],
        careers: [
          'Counseling Psychologist (Schools, Colleges & Clinics)',
          'Clinical Psychologist (with M.Phil / RCI licensing)',
          'Organizational Behavior & HR Consultant',
          'Child Development & Behavioral Specialist',
        ],
        entranceRoutes: ['CUET-UG for DU (Lady Shri Ram, Jesus and Mary), BHU', 'Christ University, Ashoka University'],
      },
      {
        id: 'journalism_media',
        title: 'Journalism, Media & Mass Communication',
        summary: 'Investigative reporting, television broadcasting, digital storytelling, content strategy, and public relations.',
        courses: [
          'B.A. in Journalism & Mass Communication (BJMC)',
          'B.A. in Digital Media & Communication',
          'B.A. in Film Production & Media Arts',
        ],
        careers: [
          'Broadcast & Investigative Journalist',
          'Digital Content Strategist & Editor',
          'Public Relations (PR) & Corporate Communications Lead',
          'Documentary Filmmaker & Media Producer',
        ],
        entranceRoutes: ['IIMC Entrance Exam (Post-graduation)', 'CUET-UG for Central Universities', 'IP University CET, Symbiosis SET'],
      },
      {
        id: 'social_sciences',
        title: 'Social Sciences & Policy Research',
        summary: 'In-depth analysis of societal structures, international diplomacy, community welfare, and socio-economic research.',
        courses: [
          'B.A. (Hons) in Sociology / Social Work (BSW)',
          'B.A. in Political Science & International Relations',
          'B.A. in Development Studies',
        ],
        careers: [
          'Public Policy Analyst & Think-Tank Researcher',
          'Diplomatic & International Relations Specialist',
          'Corporate Social Responsibility (CSR) Director',
          'Social Work & Community Development Executive',
        ],
        entranceRoutes: ['CUET-UG', 'TISS BAT / CUET (Tata Institute of Social Sciences)', 'Ashoka University Admissions'],
      },
      {
        id: 'teaching_education',
        title: 'Teaching, Pedagogy & Education Leadership',
        summary: 'Shaping future generations through school education, academic curriculum innovation, and pedagogy.',
        courses: [
          '4-Year Integrated BA-B.Ed (National Common Entrance Examination)',
          'B.A. in Education Studies',
        ],
        careers: [
          'Senior Secondary School Educator (PGT / TGT)',
          'Curriculum Designer & Educational Content Creator',
          'EdTech Instructional Specialist',
          'Academic Counselor & School Principal',
        ],
        entranceRoutes: ['NCET (National Common Entrance Test for 4-year ITEP)', 'State Teacher Training CETs'],
      },
      {
        id: 'civil_services',
        title: 'Civil Services & Public Administration Pathways',
        summary: 'Direct academic foundation in Indian history, polity, geography, and economy needed for premier competitive exams.',
        courses: [
          'B.A. in History, Polity & Economics (Civil Services Foundation Batch)',
          'B.A. in Public Administration',
        ],
        careers: [
          'IAS (Indian Administrative Service) Officer',
          'IPS (Indian Police Service) Officer',
          'IFS (Indian Foreign Service) Diplomat',
          'State Civil Executive (Deputy Collector, DSP)',
        ],
        entranceRoutes: ['Graduation Degree + UPSC Civil Services Examination (CSE)', 'State Public Service Commission Exams (Group 1 / 2)'],
      },
      {
        id: 'design_creative',
        title: 'Design, Creative Arts & Visual Aesthetics',
        summary: 'User experience design, industrial product styling, visual graphics, fashion, and communication design.',
        courses: [
          'B.Des (Bachelor of Design — 4 Years)',
          'BFA (Bachelor of Fine Arts)',
          'B.Des in Fashion & Apparel Communication',
        ],
        careers: [
          'UX / UI Product Designer',
          'Visual Identity & Brand Designer',
          'Art Director & Creative Producer',
          'Industrial & Ergonomic Designer',
        ],
        entranceRoutes: ['UCEED (IIT Bombay)', 'NID DAT (National Institute of Design)', 'NIFT Entrance Exam'],
      },
    ],
  },

  [PATHWAY_KEYS.DIPLOMA]: {
    id: PATHWAY_KEYS.DIPLOMA,
    code: 'Diploma / Polytechnic',
    name: 'Diploma / Polytechnic (3-Year Technical Engineering)',
    badge: 'Hands-on Technical & Engineering Stream',
    color: '#0d9488', // teal-600
    accentBg: '#f0fdfa',
    accentBorder: '#99f6e4',
    summary: 'A highly practical, job-oriented technical education directly after Class 10. Provides hands-on mastery of engineering equipment and offers a verified lateral-entry route directly into the 2nd year of B.Tech degrees.',
    subjectsInPlusTwo: ['Applied Engineering Mathematics', 'Applied Physics & Chemistry Labs', 'Engineering Drawing & CAD Drafting', 'Department Core Technical Labs (Mechanical / Electrical / Electronics / Civil / CS)'],
    gateways: [
      {
        id: 'engineering_diploma',
        title: 'Core Engineering Diplomas',
        summary: 'Practical hands-on technical diplomas with extensive machinery, electrical, and structural workshops.',
        courses: [
          'Diploma in Mechanical Engineering',
          'Diploma in Civil Engineering',
          'Diploma in Electrical & Electronics Engineering (EEE)',
          'Diploma in Computer Engineering / Information Technology',
          'Diploma in Electronics & Communication Engineering (ECE)',
        ],
        careers: [
          'Junior Engineer (JE) in State & Central Departments',
          'Technical Site Supervisor & Quality Control Inspector',
          'Draftsman & CAD Design Assistant',
          'Plant Maintenance & Equipment Specialist',
        ],
        entranceRoutes: ['State Polytechnic Entrance Exams (POLYCET, JEECUP, JEXPO)', 'Direct Merit after Class 10 Board Exams'],
      },
      {
        id: 'technical_specialization',
        title: 'Advanced Technical Specializations',
        summary: 'Specialized industrial domains requiring dedicated technical certification and workshop calibration.',
        courses: [
          'Diploma in Automobile Engineering',
          'Diploma in Mechatronics & Industrial Robotics',
          'Diploma in Tool & Die Making',
          'Diploma in Chemical / Petrochemical Engineering',
        ],
        careers: [
          'Automotive Diagnostic Technician',
          'Industrial Robotics & CNC Operator',
          'Tooling Specialist & Precision Machinist',
          'Process Control Technician',
        ],
        entranceRoutes: ['State POLYCET / Institute of Tool Design Admissions'],
      },
      {
        id: 'lateral_entry_degree',
        title: 'Lateral-Entry B.Tech Degree Pathway',
        summary: 'A direct academic ladder enabling diploma holders to join the 2nd year (3rd semester) of full B.Tech engineering degrees.',
        courses: [
          'Lateral Entry to B.Tech Mechanical / Civil / EEE / ECE',
          'Lateral Entry to B.Tech Computer Science / Information Technology',
        ],
        careers: [
          'Graduate Engineer Trainee (GET)',
          'Full-fledged Professional Engineer (B.Tech Equivalent)',
          'Engineering Project Lead & Technical Manager',
        ],
        entranceRoutes: ['State Engineering Common Entrance Test (ECET / JELET / LEET) for direct 2nd-year B.Tech admission'],
      },
      {
        id: 'apprenticeships_technical',
        title: 'Public Sector & Industrial Apprenticeships',
        summary: 'Structured on-the-job training with stipends in India’s leading public sector and manufacturing corporations.',
        courses: [
          'NATS (National Apprenticeship Training Scheme for Diploma Engineers)',
          'PSU Technician Apprenticeships (BHEL, NTPC, IOCL, ISRO, Indian Railways)',
        ],
        careers: [
          'Railway Junior Engineer (RRB JE)',
          'PSU Permanent Technical Staff',
          'Defense Ordinance Factory Technician',
          'Heavy Industrial Plant Operator',
        ],
        entranceRoutes: ['NATS Portal Registration', 'RRB JE Examination', 'PSU Technician Recruitment Tests'],
      },
      {
        id: 'further_specialization',
        title: 'Post-Diploma Certifications & Industry Mastery',
        summary: 'Advanced certifications in automation, building information modeling (BIM), and high-voltage operations.',
        courses: [
          'Post Diploma in Industrial Safety (PDIS)',
          'Advanced Diploma in CNC Technology',
          'Building Information Modeling (BIM) Professional Certification',
        ],
        careers: [
          'Safety Officer & Environmental Compliance Lead',
          'Senior Industrial Maintenance Foreman',
          'BIM Coordinator & Structural Drafter',
        ],
        entranceRoutes: ['State Technical Board Post-Diploma Admissions'],
      },
    ],
  },

  [PATHWAY_KEYS.VOCATIONAL]: {
    id: PATHWAY_KEYS.VOCATIONAL,
    code: 'Vocational / Skill Pathway',
    name: 'Vocational / Skill Pathway (ITI & Specialized Vocational)',
    badge: 'Industry & Applied Skills Stream',
    color: '#ea580c', // orange-600
    accentBg: '#fff7ed',
    accentBorder: '#fed7aa',
    summary: 'A fast, practical, employment-focused route designed to build verifiable trade competencies, offering rapid financial independence with flexible bridges into higher vocational degrees.',
    subjectsInPlusTwo: ['Trade Practical Workshop (60% time on machines & tools)', 'Trade Theory (Fundamentals of mechanics, circuits, materials)', 'Workshop Calculation & Applied Science', 'Employability Skills & Digital Literacy'],
    gateways: [
      {
        id: 'iti_trades',
        title: 'Certified ITI Craftsman Trades (NCVT / SCVT)',
        summary: 'One to two-year practical craftsmanship trades certified by the National Council for Vocational Training.',
        courses: [
          'Electrician Trade (2 Years — NCVT Certified)',
          'Fitter Trade (2 Years — Bench work, machine fitting)',
          'Machinist & Turner Trades (Precision metal fabrication)',
          'Draughtsman Mechanical / Civil',
          'Refrigeration & Air Conditioning (HVAC) Technician',
        ],
        careers: [
          'Certified Industrial Electrician',
          'Precision Fitter & Assembly Specialist',
          'Heavy Machinery Machinist',
          'HVAC Installation & Maintenance Specialist',
        ],
        entranceRoutes: ['State ITI Admissions (Online Merit based on Class 10 marks)'],
      },
      {
        id: 'industry_skills',
        title: 'Industry-Oriented High Demand Technical Skills',
        summary: 'Short to medium duration specialized technical training aligned with modern green energy, mobility, and electronics.',
        courses: [
          'Solar PV Rooftop Installation & Maintenance',
          'Electric Vehicle (EV) Battery & Drive-train Technician',
          'Mobile & Consumer Electronics Diagnostic Technician',
          'Industrial Welding & Fabricator (MIG / TIG / Plasma)',
        ],
        careers: [
          'Solar Energy Technical Associate',
          'EV Fleet Maintenance Specialist',
          'Quality Certified Welder (Shipbuilding & Fabrication)',
          'Telecom & Optical Fiber Splicer',
        ],
        entranceRoutes: ['National Skill Development Corporation (NSDC) Centers', 'PMKVY / Industrial Skill Hubs'],
      },
      {
        id: 'apprenticeships_dual',
        title: 'National Apprenticeship & Dual Training',
        summary: 'Paid apprenticeship contracts combining factory floor experience with formal trade theory assessments.',
        courses: [
          'NAPS (National Apprenticeship Promotion Scheme) Trades',
          'Dual System of Training (DST with partner industries)',
        ],
        careers: [
          'All India Trade Test (AITT) National Apprentice Certificate (NAC) Holder',
          'Manufacturing Production Associate',
          'Automotive Assembly Line Technician',
        ],
        entranceRoutes: ['Apprenticeship India Portal (apprenticeshipindia.gov.in)'],
      },
      {
        id: 'vocational_degree_progression',
        title: 'B.Voc & Degree Progression Pathways',
        summary: 'Legitimate higher education progression allowing vocational learners to earn a recognized Bachelor of Vocation university degree.',
        courses: [
          'B.Voc in Industrial Production Technology',
          'B.Voc in Automotive Technology',
          'B.Voc in Renewable Energy Management',
          'Lateral Entry to 2nd Year Polytechnic Diploma',
        ],
        careers: [
          'Vocational Training Instructor (ITI Instructor / Trainer)',
          'Shop-Floor Technical Executive',
          'Industrial Operations Supervisor',
        ],
        entranceRoutes: ['University B.Voc Entrance & Merit Admissions', 'State Directorate of Technical Education'],
      },
      {
        id: 'entrepreneurship_trade',
        title: 'Independent Contracting & Small Enterprise',
        summary: 'Starting an independent technical contracting business, workshop, or repair service firm.',
        courses: [
          'Entrepreneurship Development Programs (EDP via MSME)',
          'Electrical Contractor Licensing Examination',
        ],
        careers: [
          'Licensed Electrical Contractor',
          'Automotive Service & Repair Workshop Owner',
          'Fabrication & Metal Works Proprietor',
        ],
        entranceRoutes: ['State Electrical Licensing Boards', 'MSME Development Institutes'],
      },
    ],
  },
};

/**
 * Deterministic scoring engine for Parent Class 10 flow.
 * 
 * Takes:
 * - answers.subjects (Array): Subjects child enjoys most
 * - answers.mathComfort (String): Level of comfort/interest in mathematics
 * - answers.bioInterest (String): Level of interest in biology/life sciences
 * - answers.careerFields (Array or String): General fields/careers of interest
 * - answers.educationPreference (String): Degree vs Diploma vs Vocational vs Unsure
 * - answers.careerInMind (String): Specific career or goal in mind
 * 
 * Returns clean, structured analysis:
 * - recommendedPathway (Object)
 * - isUndecided (Boolean)
 * - whyThisFits (Array of 3 personalized reasons)
 * - gateways (Array of gateway objects for the primary pathway)
 * - alternativePathways (Array of alternative pathway summaries)
 * - actionSteps (Array of 3 practical next steps for the parent)
 */
export function evaluateParentClass10(answers = {}) {
  const asList = (v) => (Array.isArray(v) ? v : v ? [v] : []);
  const asString = (v) => (Array.isArray(v) ? v[0] || '' : typeof v === 'string' ? v : '');

  const subjects = asList(answers.subjects);
  const mathComfort = asString(answers.mathComfort);
  const bioInterest = asString(answers.bioInterest);
  const careerFields = asList(answers.careerFields);
  const educationPreference = asString(answers.educationPreference);
  const careerInMind = asString(answers.careerInMind);

  // Initialize pathway score counters
  const scores = {
    [PATHWAY_KEYS.MPC]: 0,
    [PATHWAY_KEYS.BIPC]: 0,
    [PATHWAY_KEYS.MEC]: 0,
    [PATHWAY_KEYS.CEC]: 0,
    [PATHWAY_KEYS.HEC]: 0,
    [PATHWAY_KEYS.DIPLOMA]: 0,
    [PATHWAY_KEYS.VOCATIONAL]: 0,
  };

  // 1. Education Pathway Preference weighting
  if (educationPreference.includes('Diploma') || educationPreference.includes('Polytechnic')) {
    scores[PATHWAY_KEYS.DIPLOMA] += 12;
  } else if (educationPreference.includes('Vocational') || educationPreference.includes('ITI')) {
    scores[PATHWAY_KEYS.VOCATIONAL] += 12;
  } else if (educationPreference.includes('Degree') || educationPreference.includes('10+2') || educationPreference.includes('Intermediate')) {
    // Normal +2 stream boost
    scores[PATHWAY_KEYS.MPC] += 1.5;
    scores[PATHWAY_KEYS.BIPC] += 1.5;
    scores[PATHWAY_KEYS.MEC] += 1.5;
    scores[PATHWAY_KEYS.CEC] += 1.5;
    scores[PATHWAY_KEYS.HEC] += 1.5;
  }

  // 2. Mathematics Comfort
  if (mathComfort.includes('Loves Mathematics') || mathComfort.includes('enthusiasm')) {
    scores[PATHWAY_KEYS.MPC] += 6;
    scores[PATHWAY_KEYS.MEC] += 5;
    scores[PATHWAY_KEYS.DIPLOMA] += 3;
    scores[PATHWAY_KEYS.CEC] += 1;
  } else if (mathComfort.includes('Comfortable') || mathComfort.includes('performs well')) {
    scores[PATHWAY_KEYS.MPC] += 4;
    scores[PATHWAY_KEYS.MEC] += 4;
    scores[PATHWAY_KEYS.BIPC] += 2;
    scores[PATHWAY_KEYS.DIPLOMA] += 2;
    scores[PATHWAY_KEYS.CEC] += 2;
    scores[PATHWAY_KEYS.HEC] += 1;
  } else if (mathComfort.includes('Average') || mathComfort.includes('applied/practical')) {
    scores[PATHWAY_KEYS.CEC] += 4;
    scores[PATHWAY_KEYS.BIPC] += 3;
    scores[PATHWAY_KEYS.HEC] += 3;
    scores[PATHWAY_KEYS.DIPLOMA] += 3;
    scores[PATHWAY_KEYS.VOCATIONAL] += 3;
    scores[PATHWAY_KEYS.MEC] += 1;
  } else if (mathComfort.includes('stressful') || mathComfort.includes('minimal or no advanced math') || mathComfort.includes('avoiding')) {
    scores[PATHWAY_KEYS.HEC] += 5;
    scores[PATHWAY_KEYS.CEC] += 5;
    scores[PATHWAY_KEYS.BIPC] += 3;
    scores[PATHWAY_KEYS.VOCATIONAL] += 3;
    scores[PATHWAY_KEYS.MPC] -= 10;
    scores[PATHWAY_KEYS.MEC] -= 6;
  }

  // 3. Biology Interest
  if (bioInterest.includes('High interest') || bioInterest.includes('fascinated by living systems') || bioInterest.includes('medicine')) {
    scores[PATHWAY_KEYS.BIPC] += 8;
  } else if (bioInterest.includes('Moderate interest') || bioInterest.includes('curious')) {
    scores[PATHWAY_KEYS.BIPC] += 3;
    scores[PATHWAY_KEYS.HEC] += 1; // psychology overlap
  } else if (bioInterest.includes('Low interest')) {
    scores[PATHWAY_KEYS.BIPC] -= 3;
  } else if (bioInterest.includes('dislikes') || bioInterest.includes('avoid life sciences')) {
    scores[PATHWAY_KEYS.BIPC] -= 10;
  }

  // 4. Subjects Enjoyed Most
  subjects.forEach((subj) => {
    if (subj.includes('Mathematics')) {
      scores[PATHWAY_KEYS.MPC] += 4;
      scores[PATHWAY_KEYS.MEC] += 3;
      scores[PATHWAY_KEYS.DIPLOMA] += 2;
    }
    if (subj.includes('Physical Sciences') || subj.includes('Physics') || subj.includes('Chemistry')) {
      scores[PATHWAY_KEYS.MPC] += 4;
      scores[PATHWAY_KEYS.BIPC] += 3;
      scores[PATHWAY_KEYS.DIPLOMA] += 3;
    }
    if (subj.includes('Biological Sciences') || subj.includes('Biology')) {
      scores[PATHWAY_KEYS.BIPC] += 5;
    }
    if (subj.includes('Computer Science') || subj.includes('Coding') || subj.includes('Technology')) {
      scores[PATHWAY_KEYS.MPC] += 4;
      scores[PATHWAY_KEYS.DIPLOMA] += 3;
    }
    if (subj.includes('Commerce') || subj.includes('Business Studies')) {
      scores[PATHWAY_KEYS.MEC] += 4;
      scores[PATHWAY_KEYS.CEC] += 4;
    }
    if (subj.includes('Economics')) {
      scores[PATHWAY_KEYS.MEC] += 4;
      scores[PATHWAY_KEYS.CEC] += 3;
      scores[PATHWAY_KEYS.HEC] += 2;
    }
    if (subj.includes('Social Sciences') || subj.includes('History') || subj.includes('Civics')) {
      scores[PATHWAY_KEYS.HEC] += 5;
      scores[PATHWAY_KEYS.CEC] += 3;
    }
    if (subj.includes('Languages') || subj.includes('Literature')) {
      scores[PATHWAY_KEYS.HEC] += 4;
      scores[PATHWAY_KEYS.CEC] += 2;
    }
    if (subj.includes('Arts') || subj.includes('Design') || subj.includes('Creative')) {
      scores[PATHWAY_KEYS.HEC] += 4;
      scores[PATHWAY_KEYS.MPC] += 1.5; // architecture fit
    }
    if (subj.includes('Practical') || subj.includes('Workshop') || subj.includes('Machines') || subj.includes('Electronics')) {
      scores[PATHWAY_KEYS.DIPLOMA] += 5;
      scores[PATHWAY_KEYS.VOCATIONAL] += 5;
      scores[PATHWAY_KEYS.MPC] += 2;
    }
  });

  // 5. General Career / Field Interests
  careerFields.forEach((field) => {
    if (field.includes('Engineering & Technology') || field.includes('Engineering')) {
      scores[PATHWAY_KEYS.MPC] += 5;
      scores[PATHWAY_KEYS.DIPLOMA] += 4;
    }
    if (field.includes('Medicine') || field.includes('Healthcare') || field.includes('Pharma')) {
      scores[PATHWAY_KEYS.BIPC] += 7;
    }
    if (field.includes('Commerce') || field.includes('Accounting') || field.includes('Banking')) {
      scores[PATHWAY_KEYS.MEC] += 4;
      scores[PATHWAY_KEYS.CEC] += 4;
    }
    if (field.includes('Business') || field.includes('Management') || field.includes('Entrepreneurship')) {
      scores[PATHWAY_KEYS.CEC] += 4;
      scores[PATHWAY_KEYS.MEC] += 3;
      scores[PATHWAY_KEYS.HEC] += 2;
    }
    if (field.includes('Law') || field.includes('Public Policy')) {
      scores[PATHWAY_KEYS.HEC] += 5;
      scores[PATHWAY_KEYS.CEC] += 4;
    }
    if (field.includes('Social Sciences') || field.includes('Psychology') || field.includes('Humanities')) {
      scores[PATHWAY_KEYS.HEC] += 6;
    }
    if (field.includes('Media') || field.includes('Journalism') || field.includes('Communications')) {
      scores[PATHWAY_KEYS.HEC] += 5;
      scores[PATHWAY_KEYS.CEC] += 3;
    }
    if (field.includes('Design') || field.includes('Architecture') || field.includes('Creative Arts')) {
      scores[PATHWAY_KEYS.HEC] += 4;
      scores[PATHWAY_KEYS.MPC] += 3; // for Architecture
    }
    if (field.includes('Defense') || field.includes('Civil Services') || field.includes('Armed Forces')) {
      scores[PATHWAY_KEYS.MPC] += 3; // Air Force, Navy technical
      scores[PATHWAY_KEYS.HEC] += 3; // Civil Services (Polity, History)
      scores[PATHWAY_KEYS.CEC] += 2;
    }
    if (field.includes('Hands-on') || field.includes('Technical & Engineering Trades')) {
      scores[PATHWAY_KEYS.DIPLOMA] += 6;
      scores[PATHWAY_KEYS.VOCATIONAL] += 6;
    }
  });

  // 6. Career in Mind
  if (careerInMind.includes('Software') || careerInMind.includes('Data Scientist') || careerInMind.includes('Technologist')) {
    scores[PATHWAY_KEYS.MPC] += 5;
    scores[PATHWAY_KEYS.DIPLOMA] += 3;
  } else if (careerInMind.includes('Doctor') || careerInMind.includes('Medical Specialist') || careerInMind.includes('Surgeon')) {
    scores[PATHWAY_KEYS.BIPC] += 8;
  } else if (careerInMind.includes('Chartered Accountant') || careerInMind.includes('Investment Banker')) {
    scores[PATHWAY_KEYS.MEC] += 6;
    scores[PATHWAY_KEYS.CEC] += 3;
  } else if (careerInMind.includes('Civil Servant') || careerInMind.includes('Public Administrator')) {
    scores[PATHWAY_KEYS.HEC] += 5;
    scores[PATHWAY_KEYS.CEC] += 4;
    scores[PATHWAY_KEYS.MPC] += 1;
  } else if (careerInMind.includes('Lawyer') || careerInMind.includes('Corporate Counsel')) {
    scores[PATHWAY_KEYS.HEC] += 6;
    scores[PATHWAY_KEYS.CEC] += 4;
  } else if (careerInMind.includes('Defense Officer') || careerInMind.includes('Commercial Pilot')) {
    scores[PATHWAY_KEYS.MPC] += 6;
  } else if (careerInMind.includes('Architect')) {
    scores[PATHWAY_KEYS.MPC] += 6;
  } else if (careerInMind.includes('Polytechnic Engineer') || careerInMind.includes('Technical Specialist')) {
    scores[PATHWAY_KEYS.DIPLOMA] += 8;
  } else if (careerInMind.includes('Craftsman') || careerInMind.includes('Trade')) {
    scores[PATHWAY_KEYS.VOCATIONAL] += 8;
  } else if (careerInMind.includes('Healthcare Professional') || careerInMind.includes('Pharmacy') || careerInMind.includes('Nursing')) {
    scores[PATHWAY_KEYS.BIPC] += 6;
  } else if (careerInMind.includes('Business Owner') || careerInMind.includes('Corporate Manager')) {
    scores[PATHWAY_KEYS.CEC] += 4;
    scores[PATHWAY_KEYS.MEC] += 3;
  }

  // Sort pathways by score descending
  const sorted = Object.entries(scores)
    .map(([key, val]) => ({ key, score: Math.round(val * 10) / 10 }))
    .sort((a, b) => b.score - a.score);

  const top1 = sorted[0];
  const top2 = sorted[1];
  const top3 = sorted[2];

  // Detect genuine undecided / balanced exploration
  const isExplicitlyUndecided =
    careerFields.some((f) => f.includes('Undecided')) ||
    careerInMind.includes('No specific career') ||
    careerInMind.includes('keeping options open');

  const isCloseTie = top1 && top2 && (top1.score - top2.score <= 1.0) && top1.score > 4;
  const isUndecided = isExplicitlyUndecided && isCloseTie;

  const primaryKey = top1?.key || PATHWAY_KEYS.MPC;
  const primaryData = PATHWAYS_DATA[primaryKey] || PATHWAYS_DATA[PATHWAY_KEYS.MPC];

  // Craft 3 tailored "Why this fits" reasons reflecting child's actual inputs
  const whyReasons = [];

  // Reason 1: Subject alignment & enjoyment
  if (subjects.length > 0) {
    const matchedSubjects = subjects.slice(0, 2).join(' and ');
    if (primaryKey === PATHWAY_KEYS.MPC) {
      whyReasons.push(`Your child enjoys ${matchedSubjects}, which forms the natural mathematical and physical foundation required for MPC.`);
    } else if (primaryKey === PATHWAY_KEYS.BIPC) {
      whyReasons.push(`Your child shows a strong affinity for ${matchedSubjects}, which directly aligns with the living systems and biological coursework in BiPC.`);
    } else if (primaryKey === PATHWAY_KEYS.MEC) {
      whyReasons.push(`Their enjoyment of ${matchedSubjects} provides the dual quantitative and commercial grounding essential for MEC.`);
    } else if (primaryKey === PATHWAY_KEYS.CEC) {
      whyReasons.push(`Their natural interest in ${matchedSubjects} builds an ideal base for commerce, economics, and institutional governance in CEC.`);
    } else if (primaryKey === PATHWAY_KEYS.HEC) {
      whyReasons.push(`Their curiosity in ${matchedSubjects} connects directly with the humanistic, legal, and analytical depth of HEC / Humanities.`);
    } else if (primaryKey === PATHWAY_KEYS.DIPLOMA) {
      whyReasons.push(`Their practical aptitude in ${matchedSubjects} makes the hands-on engineering lab work in Polytechnic a direct, fulfilling fit.`);
    } else if (primaryKey === PATHWAY_KEYS.VOCATIONAL) {
      whyReasons.push(`Their interest in ${matchedSubjects} aligns with hands-on technical trades and industry-certified workshop training.`);
    }
  } else {
    whyReasons.push(`The core subjects in ${primaryData.code} offer a balanced progression tailored to their current school foundation.`);
  }

  // Reason 2: Math comfort or cognitive orientation
  if (mathComfort) {
    if (primaryKey === PATHWAY_KEYS.MPC && (mathComfort.includes('Loves') || mathComfort.includes('Comfortable'))) {
      whyReasons.push(`Their strong comfort with Mathematics enables them to handle higher-level calculus, physics mechanics, and technical problem-solving with confidence.`);
    } else if (primaryKey === PATHWAY_KEYS.BIPC && (mathComfort.includes('Average') || mathComfort.includes('stressful') || mathComfort.includes('applied'))) {
      whyReasons.push(`BiPC directs their academic focus onto life sciences and biological reasoning, keeping their workload free from advanced engineering calculus.`);
    } else if (primaryKey === PATHWAY_KEYS.MEC && (mathComfort.includes('Loves') || mathComfort.includes('Comfortable'))) {
      whyReasons.push(`Their mathematical aptitude gives them a major competitive advantage in economic statistics, financial mathematics, and CA/CFA pathways.`);
    } else if (primaryKey === PATHWAY_KEYS.CEC && (mathComfort.includes('Average') || mathComfort.includes('stressful'))) {
      whyReasons.push(`CEC provides rigorous commercial and business training while avoiding high-stress abstract mathematics.`);
    } else if (primaryKey === PATHWAY_KEYS.HEC) {
      whyReasons.push(`HEC channels their cognitive energy into reading, critical reasoning, essay analysis, and debate rather than formula memorization.`);
    } else if (primaryKey === PATHWAY_KEYS.DIPLOMA) {
      whyReasons.push(`Polytechnic focuses on applied, practical engineering mathematics connected immediately to real-world machinery.`);
    } else {
      whyReasons.push(`Their learning comfort profile lines up smoothly with the teaching and testing style of ${primaryData.code}.`);
    }
  } else {
    whyReasons.push(`Matches their preferred cognitive balance between analytical reasoning and conceptual study.`);
  }

  // Reason 3: Career goals, gateways opened, or education preference
  if (careerInMind && !careerInMind.includes('No specific') && !careerInMind.includes('keeping options')) {
    whyReasons.push(`Directly unlocks the mandatory prerequisite gateways needed for their goal of ${careerInMind.toLowerCase()}.`);
  } else if (careerFields.length > 0) {
    const fieldsJoined = careerFields.slice(0, 2).join(' and ');
    whyReasons.push(`Directly feeds into their stated career interests in ${fieldsJoined.toLowerCase()} through accredited professional gateways.`);
  } else if (educationPreference.includes('Diploma') || educationPreference.includes('Polytechnic')) {
    whyReasons.push(`Fulfills their preference for a 3-year technical diploma with the valuable safety net of lateral entry directly into 2nd year B.Tech.`);
  } else if (educationPreference.includes('Vocational') || educationPreference.includes('ITI')) {
    whyReasons.push(`Meets their goal of early hands-on industry skill mastery, paid apprenticeships, and direct job readiness.`);
  } else {
    whyReasons.push(`Keeps a broad spectrum of high-demand undergraduate degree gateways open so they can specialize with maturity in Class 12.`);
  }

  // Select 2 meaningful alternative pathways (never repeating primary)
  const alternatives = [];
  [top2, top3].filter(Boolean).forEach((alt) => {
    if (alt.key !== primaryKey && PATHWAYS_DATA[alt.key]) {
      const altData = PATHWAYS_DATA[alt.key];
      let altWhy = '';
      let altGatewaysOpened = '';

      if (alt.key === PATHWAY_KEYS.MPC) {
        altWhy = 'If they wish to keep technical engineering, computing, and defense routes completely accessible alongside pure science.';
        altGatewaysOpened = 'Engineering (B.Tech), Computer Science & IT, Architecture, and National Defence Academy.';
      } else if (alt.key === PATHWAY_KEYS.BIPC) {
        altWhy = 'If their interest in life sciences or healthcare deepens over the coming months.';
        altGatewaysOpened = 'MBBS/Medicine, Pharmacy, Allied Health Sciences, and Biotechnology.';
      } else if (alt.key === PATHWAY_KEYS.MEC) {
        altWhy = 'If they want strong corporate commerce with the analytical leverage of mathematics for finance and economics.';
        altGatewaysOpened = 'Chartered Accountancy, Investment Finance, Corporate Economics, and Integrated MBA (IPMAT).';
      } else if (alt.key === PATHWAY_KEYS.CEC) {
        altWhy = 'If they prefer a clear business and law track without the pressure of higher calculus.';
        altGatewaysOpened = 'Commerce (B.Com), Business Administration (BBA), Law (BA LLB), and Banking.';
      } else if (alt.key === PATHWAY_KEYS.HEC) {
        altWhy = 'If they are drawn toward law, public administration, psychological sciences, journalism, or civil governance.';
        altGatewaysOpened = 'Law (5-Yr Integrated), Psychology, Media & Journalism, Civil Services, and Design.';
      } else if (alt.key === PATHWAY_KEYS.DIPLOMA) {
        altWhy = 'If they prefer practical machine workshops and want the option to join engineering via lateral entry.';
        altGatewaysOpened = '3-Year Polytechnic, Junior Engineer positions, and direct 2nd-year B.Tech lateral admission.';
      } else if (alt.key === PATHWAY_KEYS.VOCATIONAL) {
        altWhy = 'If quick industry certification, hands-on trades, and early financial independence are appealing.';
        altGatewaysOpened = 'NCVT ITI certification, National Apprenticeships, and B.Voc vocational degrees.';
      }

      alternatives.push({
        id: altData.id,
        code: altData.code,
        name: altData.name,
        badge: altData.badge,
        color: altData.color,
        summary: altData.summary,
        subjectsInPlusTwo: altData.subjectsInPlusTwo,
        gateways: altData.gateways,
        whyItCouldFit: altWhy,
        gatewaysOpened: altGatewaysOpened,
        topGateways: altData.gateways.slice(0, 3).map((g) => g.title),
      });
    }
  });

  // 3 Counselor Next Steps for the Parent
  const actionSteps = [
    {
      title: 'Review the subject combination together',
      description: `Discuss the daily subjects in ${primaryData.code} (${primaryData.subjectsInPlusTwo.slice(0, 2).join(', ')}) with your child to confirm they feel excited, not overwhelmed.`,
    },
    {
      title: 'Explore 1 or 2 relevant gateway projects',
      description: `Before admissions finalize, encourage your child to try a small hands-on activity, workshop, or introductory course in their top gateway (${primaryData.gateways[0]?.title}).`,
    },
    {
      title: 'Verify school & junior college options',
      description: `Shortlist institutions offering ${primaryData.code} that provide strong faculty, lab facilities, and balanced support without excessive coaching pressure.`,
    },
  ];

  return {
    flow: 'parent_class10',
    pathwayCode: primaryData.code,
    pathwayTitle: primaryData.name,
    primaryPathway: primaryData,
    isUndecided,
    whyThisFits: whyReasons,
    gateways: primaryData.gateways,
    alternativePathways: alternatives,
    actionSteps,
    scores,
    answers,
  };
}
